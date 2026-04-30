import type { Stock, Candle } from '@/domain/models';

// Generates a new candle based on the previous close using GBM-like motion
export function generateNextCandle(prevClose: number, volatility = 0.015): Candle {
  const drift   = (Math.random() - 0.49) * volatility;
  const open    = prevClose;
  const close   = open * (1 + drift);
  const swing   = Math.abs(close - open) + open * 0.003;
  const high    = Math.max(open, close) + Math.random() * swing;
  const low     = Math.min(open, close) - Math.random() * swing;
  const volume  = Math.floor(500_000 + Math.random() * 4_000_000);
  return { timestamp: Date.now(), open, high, low: Math.max(0.01, low), close, volume };
}

export function tickStocks(stocks: Stock[]): Stock[] {
  return stocks.map(stock => {
    const volatility = stock.assetClass === 'crypto' ? 0.025 : 0.012;
    const candle = generateNextCandle(stock.currentPrice, volatility);
    const updatedCandles = [...stock.candles.slice(-89), candle];
    return {
      ...stock,
      currentPrice: candle.close,
      dayHigh: Math.max(stock.dayHigh, candle.high),
      dayLow:  Math.min(stock.dayLow,  candle.low),
      candles: updatedCandles,
    };
  });
}

// RSI calculation (14 periods)
export function calculateRSI(candles: Candle[], period = 14): number {
  if (candles.length < period + 1) return 50;
  const changes = candles.slice(-period - 1).map((c, i, arr) =>
    i === 0 ? 0 : c.close - arr[i - 1].close,
  ).slice(1);

  const gains  = changes.filter(c => c > 0).reduce((s, c) => s + c, 0) / period;
  const losses = changes.filter(c => c < 0).reduce((s, c) => s + Math.abs(c), 0) / period;
  if (losses === 0) return 100;
  const rs = gains / losses;
  return 100 - 100 / (1 + rs);
}

// EMA calculation
export function calculateEMA(values: number[], period: number): number[] {
  const k = 2 / (period + 1);
  const ema: number[] = [];
  values.forEach((v, i) => {
    if (i === 0) { ema.push(v); return; }
    ema.push(v * k + ema[i - 1] * (1 - k));
  });
  return ema;
}

// MACD calculation
export function calculateMACD(candles: Candle[]): { macd: number; signal: number; histogram: number } {
  if (candles.length < 26) return { macd: 0, signal: 0, histogram: 0 };
  const closes = candles.map(c => c.close);
  const ema12  = calculateEMA(closes, 12);
  const ema26  = calculateEMA(closes, 26);
  const macdLine = ema12.map((v, i) => v - ema26[i]);
  const signalLine = calculateEMA(macdLine.slice(-9), 9);
  const macd    = macdLine[macdLine.length - 1];
  const signal  = signalLine[signalLine.length - 1];
  return { macd, signal, histogram: macd - signal };
}
