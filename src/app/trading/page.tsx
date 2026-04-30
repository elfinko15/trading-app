'use client';
import { useEffect } from 'react';
import { useMarketStore } from '@/store/marketStore';
import { fmt } from '@/lib/formatters';
import Header from '@/components/layout/Header';
import StockList from '@/components/trading/StockList';
import OrderPanel from '@/components/trading/OrderPanel';
import TechnicalIndicators from '@/components/trading/TechnicalIndicators';
import CandlestickChart from '@/components/trading/CandlestickChart';
import { usePortfolioStore } from '@/store/portfolioStore';

export default function TradingPage() {
  const { stocks, selectedSymbol, startTicker } = useMarketStore();
  const { portfolio } = usePortfolioStore();
  const stock    = stocks.find(s => s.symbol === selectedSymbol);

  useEffect(() => { startTicker(); }, [startTicker]);

  if (!stock) return null;

  const change    = stock.currentPrice - stock.previousClose;
  const changePct = (change / stock.previousClose) * 100;
  const isUp      = change >= 0;
  const position  = portfolio.positions[selectedSymbol];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header title="Trading" />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Watchlist */}
        <div style={{ width: '188px', flexShrink: 0, overflow: 'hidden', borderRight: '1px solid rgba(120,80,255,0.12)' }}>
          <StockList />
        </div>

        {/* Main chart area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRight: '1px solid rgba(120,80,255,0.12)' }}>

          {/* Stock header */}
          <div style={{
            background: 'rgba(4,0,18,0.70)',
            borderBottom: '1px solid rgba(120,80,255,0.12)',
            padding: '10px 16px',
            display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '18px', fontWeight: 800, color: 'rgba(255,255,255,0.95)' }}>{stock.symbol}</span>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.42)' }}>{stock.name}</span>
                <span className="badge-neutral">{stock.assetClass.toUpperCase()}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '24px', fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: 'rgba(255,255,255,0.95)' }}>
                {fmt.currency(stock.currentPrice)}
              </span>
              <span className={isUp ? 'badge-up' : 'badge-down'} style={{ fontSize: '12px', padding: '4px 9px' }}>
                {isUp ? '▲' : '▼'} {fmt.currency(Math.abs(change))} ({fmt.percent(changePct)})
              </span>
            </div>

            {[
              { label: 'Eröffnung', value: fmt.currency(stock.candles.at(-1)?.open ?? stock.currentPrice) },
              { label: 'Hoch',      value: fmt.currency(stock.dayHigh) },
              { label: 'Tief',      value: fmt.currency(stock.dayLow) },
              { label: 'Volumen',   value: `${(stock.volume / 1e6).toFixed(1)}M` },
            ].map(item => (
              <div key={item.label} className="hide-mobile" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.32)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.88)', fontVariantNumeric: 'tabular-nums' }}>{item.value}</div>
              </div>
            ))}

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span className="live-indicator" />
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.42)' }}>Live · Simuliert</span>
            </div>
          </div>

          {/* Chart */}
          <div style={{ flex: 1, background: '#0D1B2A', padding: '8px', minHeight: 0 }}>
            <CandlestickChart candles={stock.candles} symbol={stock.symbol} />
          </div>

          {/* Bottom info bar */}
          <div style={{
            background: 'rgba(4,0,18,0.70)',
            borderTop: '1px solid rgba(120,80,255,0.10)',
            padding: '8px 16px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.38)', margin: 0, maxWidth: '60%' }}>{stock.description}</p>
            {position && (
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.32)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Meine Position</div>
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>{position.quantity}× · {fmt.currency(position.marketValue)}</div>
                </div>
                <span className={position.unrealizedPnL >= 0 ? 'badge-up' : 'badge-down'}>
                  {fmt.currency(position.unrealizedPnL)} ({fmt.percent(position.unrealizedPnLPct)})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right panel */}
        <div style={{ width: '264px', flexShrink: 0, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <TechnicalIndicators stock={stock} />
          <OrderPanel />
        </div>
      </div>
    </div>
  );
}
