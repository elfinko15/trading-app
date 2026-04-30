export const fmt = {
  currency: (v: number, digits = 2) =>
    new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'USD', minimumFractionDigits: digits, maximumFractionDigits: digits }).format(v),

  percent: (v: number, digits = 2) =>
    `${v >= 0 ? '+' : ''}${v.toFixed(digits)}%`,

  number: (v: number) =>
    new Intl.NumberFormat('de-DE').format(v),

  compact: (v: number) => {
    if (Math.abs(v) >= 1e12) return `$${(v / 1e12).toFixed(2)}T`;
    if (Math.abs(v) >= 1e9)  return `$${(v / 1e9).toFixed(2)}B`;
    if (Math.abs(v) >= 1e6)  return `$${(v / 1e6).toFixed(2)}M`;
    return `$${v.toFixed(2)}`;
  },

  date: (ts: number) =>
    new Date(ts).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' }),

  time: (ts: number) =>
    new Date(ts).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),

  pnlColor: (v: number) => v >= 0 ? 'text-emerald-400' : 'text-red-400',

  pnlBg: (v: number) => v >= 0
    ? 'bg-emerald-500/20 text-emerald-300'
    : 'bg-red-500/20 text-red-300',
};
