'use client';
import { useState } from 'react';
import type { OrderType, OrderSide } from '@/domain/models';
import { usePortfolioStore } from '@/store/portfolioStore';
import { useMarketStore } from '@/store/marketStore';
import { useUserStore } from '@/store/userStore';
import { fmt } from '@/lib/formatters';

const STRATEGIES = [
  'Trendfolge', 'Breakout', 'Mean Reversion', 'RSI Signal',
  'MACD Signal', 'Support/Resistance', 'News-Trade', 'Sonstiges',
];

const label: React.CSSProperties = {
  fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.40)',
  textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '5px',
};

const input: React.CSSProperties = {
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(140,100,255,0.25)',
  borderRadius: '8px', color: 'rgba(255,255,255,0.92)',
  padding: '9px 10px', minHeight: '44px',
  fontSize: '13px', outline: 'none', width: '100%',
};

export default function OrderPanel() {
  const { portfolio, placeOrder, lastTradeError, clearError } = usePortfolioStore();
  const { stocks, selectedSymbol } = useMarketStore();
  const { addXP, recordTrade, unlockAchievement, user } = useUserStore();

  const stock = stocks.find(s => s.symbol === selectedSymbol);

  const [side,        setSide]        = useState<OrderSide>('buy');
  const [orderType,   setOrderType]   = useState<OrderType>('market');
  const [quantity,    setQuantity]    = useState('1');
  const [limitPrice,  setLimitPrice]  = useState('');
  const [stopPrice,   setStopPrice]   = useState('');
  const [strategy,    setStrategy]    = useState(STRATEGIES[0]);
  const [notes,       setNotes]       = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  if (!stock) return null;

  const qty    = parseFloat(quantity) || 0;
  const price  = orderType === 'market' ? stock.currentPrice : (parseFloat(limitPrice) || stock.currentPrice);
  const total  = price * qty;
  const maxQty = side === 'buy'
    ? Math.floor(portfolio.cash / price)
    : (portfolio.positions[selectedSymbol]?.quantity ?? 0);

  const handleSubmit = () => {
    clearError();
    const success = placeOrder({
      symbol: selectedSymbol, side, type: orderType, quantity: qty,
      limitPrice: limitPrice ? parseFloat(limitPrice) : undefined,
      stopPrice:  stopPrice  ? parseFloat(stopPrice)  : undefined,
      strategy, notes,
    });
    if (success) {
      addXP(25);
      recordTrade(side === 'sell');
      if (user.totalTrades === 0)    unlockAchievement('first-trade');
      if (orderType === 'stop-loss') unlockAchievement('stop-loss-hero');
      if (stock.assetClass === 'crypto') unlockAchievement('crypto-trader');
      if (stock.assetClass === 'etf')    unlockAchievement('etf-investor');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);
      setNotes('');
    }
  };

  return (
    <div style={{
      background: 'rgba(18,8,48,0.80)',
      border: '1px solid rgba(140,100,255,0.22)',
      borderRadius: '14px', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '10px 13px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(120,80,255,0.06)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.90)' }}>Order Eingabe</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span className="live-indicator" />
          <span style={{ fontSize: '12px', fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: 'rgba(255,255,255,0.88)' }}>
            {fmt.currency(stock.currentPrice)}
          </span>
        </div>
      </div>

      <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

        {/* Buy / Sell */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          {(['buy', 'sell'] as OrderSide[]).map(s => (
            <button
              key={s}
              onClick={() => setSide(s)}
              style={{
                padding: '10px 8px', minHeight: '44px',
                borderRadius: '8px', border: 'none', borderWidth: '2px', borderStyle: 'solid',
                borderColor: side === s
                  ? (s === 'buy' ? '#00C787' : '#F04E4E')
                  : 'rgba(255,255,255,0.10)',
                background: side === s
                  ? (s === 'buy' ? 'rgba(0,199,135,0.15)' : 'rgba(240,78,78,0.15)')
                  : 'rgba(255,255,255,0.04)',
                color: side === s
                  ? (s === 'buy' ? '#00C787' : '#F04E4E')
                  : 'rgba(255,255,255,0.40)',
                fontWeight: 800, fontSize: '13px', cursor: 'pointer', transition: 'all 0.12s',
              }}
            >
              {s === 'buy' ? '▲ Kaufen' : '▼ Verkaufen'}
            </button>
          ))}
        </div>

        {/* Order Type */}
        <div>
          <label style={label}>Order-Typ</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
            {(['market', 'limit', 'stop-loss'] as OrderType[]).map(t => (
              <button
                key={t}
                onClick={() => setOrderType(t)}
                style={{
                  padding: '7px 4px', minHeight: '36px',
                  borderRadius: '7px', border: 'none', borderWidth: '1px', borderStyle: 'solid',
                  borderColor: orderType === t ? 'rgba(140,100,255,0.55)' : 'rgba(255,255,255,0.10)',
                  background: orderType === t ? 'rgba(109,74,232,0.22)' : 'rgba(255,255,255,0.04)',
                  color: orderType === t ? '#C4B5FD' : 'rgba(255,255,255,0.42)',
                  fontSize: '11px', fontWeight: 700, cursor: 'pointer',
                }}
              >
                {t === 'market' ? 'Market' : t === 'limit' ? 'Limit' : 'Stop'}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
            <label style={{ ...label, marginBottom: 0 }}>Menge</label>
            <button
              onClick={() => setQuantity(String(maxQty))}
              style={{ fontSize: '11px', color: '#A78BFA', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
            >
              Max {maxQty}
            </button>
          </div>
          <input type="number" value={quantity} min="1"
            onChange={e => setQuantity(e.target.value)} style={input} placeholder="Anzahl" />
        </div>

        {/* Limit / Stop price */}
        {(orderType === 'limit' || orderType === 'stop-loss') && (
          <div>
            <label style={label}>{orderType === 'limit' ? 'Limit-Preis ($)' : 'Stop-Preis ($)'}</label>
            <input
              type="number"
              value={orderType === 'limit' ? limitPrice : stopPrice}
              onChange={e => orderType === 'limit' ? setLimitPrice(e.target.value) : setStopPrice(e.target.value)}
              style={input}
              placeholder={`z.B. ${(stock.currentPrice * 0.98).toFixed(2)}`}
            />
          </div>
        )}

        {/* Strategy */}
        <div>
          <label style={label}>Strategie</label>
          <select value={strategy} onChange={e => setStrategy(e.target.value)} style={{ ...input, cursor: 'pointer' }}>
            {STRATEGIES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Notes */}
        <div>
          <label style={label}>Notiz</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            style={{ ...input, resize: 'none', minHeight: 'auto' }}
            rows={2}
            placeholder="Begründung..."
          />
        </div>

        {/* Cost summary */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', padding: '9px 11px' }}>
          {[
            ['Preis je Stück', fmt.currency(price)],
            ['Menge',          String(qty)],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.40)' }}>{k}</span>
              <span style={{ fontSize: '11px', fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: 'rgba(255,255,255,0.80)' }}>{v}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '7px', display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700 }}>Gesamt</span>
            <span style={{ fontSize: '14px', fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: '#A78BFA' }}>{fmt.currency(total)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.28)' }}>Verfügbar</span>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.40)', fontVariantNumeric: 'tabular-nums' }}>{fmt.currency(portfolio.cash)}</span>
          </div>
        </div>

        {/* Error */}
        {lastTradeError && (
          <div style={{ fontSize: '12px', color: '#F04E4E', background: 'rgba(240,78,78,0.12)', border: '1px solid rgba(240,78,78,0.25)', borderRadius: '7px', padding: '8px 10px' }}>
            {lastTradeError}
          </div>
        )}

        {/* Success */}
        {showSuccess && (
          <div style={{ fontSize: '12px', color: '#00C787', background: 'rgba(0,199,135,0.12)', border: '1px solid rgba(0,199,135,0.25)', borderRadius: '7px', padding: '8px 10px' }}>
            ✓ Order ausgeführt · +25 XP
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={qty <= 0}
          className={side === 'buy' ? 'btn-buy' : 'btn-sell'}
          style={{ opacity: qty <= 0 ? 0.4 : 1, cursor: qty <= 0 ? 'not-allowed' : 'pointer' }}
        >
          {side === 'buy' ? `Kaufen · ${qty}× ${selectedSymbol}` : `Verkaufen · ${qty}× ${selectedSymbol}`}
        </button>
      </div>
    </div>
  );
}
