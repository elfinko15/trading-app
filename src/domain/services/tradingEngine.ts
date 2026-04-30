import type { Order, Portfolio, Position, Transaction, Stock } from '@/domain/models';

export const COMMISSION_RATE = 0.001; // 0.1% per trade

export interface TradeResult {
  success: boolean;
  error?: string;
  order?: Order;
  transaction?: Transaction;
}

export function validateOrder(
  order: Omit<Order, 'id' | 'status' | 'createdAt'>,
  portfolio: Portfolio,
  stock: Stock,
): string | null {
  const { side, type, quantity, limitPrice, stopPrice } = order;

  if (quantity <= 0) return 'Menge muss größer als 0 sein.';

  const price = type === 'market' ? stock.currentPrice : (limitPrice ?? stock.currentPrice);

  if (side === 'buy') {
    const cost = price * quantity * (1 + COMMISSION_RATE);
    if (cost > portfolio.cash) {
      return `Nicht genug Kapital. Benötigt: $${cost.toFixed(2)}, Verfügbar: $${portfolio.cash.toFixed(2)}`;
    }
  }

  if (side === 'sell') {
    const position = portfolio.positions[order.symbol];
    if (!position || position.quantity < quantity) {
      const held = position?.quantity ?? 0;
      return `Nicht genug Aktien. Gehalten: ${held}, Verkaufen: ${quantity}`;
    }
  }

  if (type === 'limit' && !limitPrice) return 'Limit-Preis erforderlich.';
  if (type === 'stop-loss' && !stopPrice) return 'Stop-Preis erforderlich.';
  if (type === 'limit' && limitPrice && limitPrice <= 0) return 'Limit-Preis muss positiv sein.';

  return null;
}

export function executeMarketOrder(
  order: Omit<Order, 'id' | 'status' | 'createdAt' | 'filledAt' | 'filledPrice'>,
  portfolio: Portfolio,
  stock: Stock,
): { portfolio: Portfolio; order: Order; transaction: Transaction } {
  const id = `order-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const now = Date.now();
  const fillPrice = stock.currentPrice * (1 + (Math.random() - 0.5) * 0.001); // tiny slippage
  const fee = fillPrice * order.quantity * COMMISSION_RATE;
  const total = fillPrice * order.quantity;

  const filledOrder: Order = {
    ...order,
    id,
    status: 'filled',
    createdAt: now,
    filledAt: now,
    filledPrice: fillPrice,
  };

  const transaction: Transaction = {
    id: `tx-${Date.now()}`,
    orderId: id,
    symbol: order.symbol,
    side: order.side,
    quantity: order.quantity,
    price: fillPrice,
    total,
    fee,
    timestamp: now,
    strategy: order.strategy ?? 'unspecified',
    notes: order.notes,
  };

  const newPortfolio = applyTransaction(portfolio, transaction, stock);
  return { portfolio: newPortfolio, order: filledOrder, transaction };
}

function applyTransaction(portfolio: Portfolio, tx: Transaction, stock: Stock): Portfolio {
  const p = { ...portfolio };
  const positions = { ...p.positions };

  if (tx.side === 'buy') {
    p.cash -= tx.total + tx.fee;

    const existing = positions[tx.symbol];
    if (existing) {
      const totalQty   = existing.quantity + tx.quantity;
      const totalCost  = existing.averagePrice * existing.quantity + tx.price * tx.quantity;
      positions[tx.symbol] = {
        ...existing,
        quantity: totalQty,
        averagePrice: totalCost / totalQty,
        costBasis: totalCost,
        currentPrice: stock.currentPrice,
        marketValue: totalQty * stock.currentPrice,
        unrealizedPnL: totalQty * stock.currentPrice - totalCost,
        unrealizedPnLPct: (totalQty * stock.currentPrice - totalCost) / totalCost * 100,
      };
    } else {
      const costBasis = tx.price * tx.quantity;
      positions[tx.symbol] = {
        symbol: tx.symbol,
        quantity: tx.quantity,
        averagePrice: tx.price,
        currentPrice: stock.currentPrice,
        marketValue: tx.quantity * stock.currentPrice,
        costBasis,
        unrealizedPnL: tx.quantity * stock.currentPrice - costBasis,
        unrealizedPnLPct: (tx.quantity * stock.currentPrice - costBasis) / costBasis * 100,
        realizedPnL: 0,
        assetClass: stock.assetClass,
        openedAt: tx.timestamp,
      };
    }
  } else {
    // sell
    const existing = positions[tx.symbol];
    if (!existing) return p;

    const realizedPnL = (tx.price - existing.averagePrice) * tx.quantity - tx.fee;
    tx.pnl    = realizedPnL;
    tx.pnlPct = realizedPnL / (existing.averagePrice * tx.quantity) * 100;

    p.cash += tx.total - tx.fee;

    const newQty = existing.quantity - tx.quantity;
    if (newQty <= 0) {
      delete positions[tx.symbol];
    } else {
      const newCostBasis = existing.averagePrice * newQty;
      positions[tx.symbol] = {
        ...existing,
        quantity: newQty,
        costBasis: newCostBasis,
        marketValue: newQty * stock.currentPrice,
        unrealizedPnL: newQty * stock.currentPrice - newCostBasis,
        unrealizedPnLPct: (newQty * stock.currentPrice - newCostBasis) / newCostBasis * 100,
        realizedPnL: (existing.realizedPnL ?? 0) + realizedPnL,
      };
    }
    p.realizedPnL = (p.realizedPnL ?? 0) + realizedPnL;
  }

  p.positions    = positions;
  p.transactions = [...p.transactions, tx];
  p.orders       = [...p.orders, { id: tx.orderId, symbol: tx.symbol, side: tx.side, type: 'market', quantity: tx.quantity, status: 'filled', createdAt: tx.timestamp, filledAt: tx.timestamp, filledPrice: tx.price, strategy: tx.strategy }];

  return recalculatePortfolio(p);
}

export function recalculatePortfolio(portfolio: Portfolio): Portfolio {
  const equity = Object.values(portfolio.positions).reduce(
    (sum, pos) => sum + pos.marketValue, 0,
  );
  const unrealizedPnL = Object.values(portfolio.positions).reduce(
    (sum, pos) => sum + pos.unrealizedPnL, 0,
  );
  const totalValue   = portfolio.cash + equity;
  const totalCost    = Object.values(portfolio.positions).reduce((s, p) => s + p.costBasis, 0);
  const totalPnL     = unrealizedPnL + portfolio.realizedPnL;
  const invested     = totalCost + portfolio.realizedPnL;
  const totalPnLPct  = invested > 0 ? totalPnL / 10_000 * 100 : 0; // relative to initial 10k

  return { ...portfolio, equity, unrealizedPnL, totalValue, totalCost, totalPnL, totalPnLPct };
}

export function updatePositionPrices(portfolio: Portfolio, prices: Record<string, number>): Portfolio {
  const positions = { ...portfolio.positions };
  for (const symbol of Object.keys(positions)) {
    const price = prices[symbol];
    if (!price) continue;
    const pos = positions[symbol];
    positions[symbol] = {
      ...pos,
      currentPrice: price,
      marketValue: pos.quantity * price,
      unrealizedPnL: pos.quantity * price - pos.costBasis,
      unrealizedPnLPct: (pos.quantity * price - pos.costBasis) / pos.costBasis * 100,
    };
  }
  return recalculatePortfolio({ ...portfolio, positions });
}
