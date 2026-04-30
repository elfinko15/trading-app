// German Abgeltungssteuer (capital gains tax)
// 25% flat tax + 5.5% Solidaritätszuschlag = 26.375% effective
// Sparerpauschbetrag (annual tax-free allowance): €1,000 per person

export const TAX_FREE_AMOUNT  = 1_000;   // €1,000 Sparerpauschbetrag
export const BASE_TAX_RATE    = 0.25;    // 25% Abgeltungssteuer
export const SOLI_RATE        = 0.055;   // 5.5% Solidaritätszuschlag on the tax amount
export const EFFECTIVE_RATE   = BASE_TAX_RATE * (1 + SOLI_RATE); // 26.375%

export interface TaxBreakdown {
  totalGains: number;        // gross realized gains
  totalLosses: number;       // gross realized losses (positive number)
  netGains: number;          // gains - losses
  freiBetrag: number;        // €1,000 used
  freiBetragRemaining: number;
  taxableAmount: number;     // max(netGains - freiBetrag, 0)
  abgeltungsteuer: number;   // 25% of taxable
  solidaritaetszuschlag: number; // 5.5% of the 25% tax
  totalTax: number;          // abgeltungsteuer + soli
  netAfterTax: number;       // netGains - totalTax
  effectiveRate: number;     // actual % of netGains paid as tax
}

export function calculateTax(realizedPnL: number): TaxBreakdown {
  // For simplicity, treat realizedPnL as the net (gains - losses)
  // A proper implementation would track gains and losses separately
  const netGains        = realizedPnL;
  const taxableAmount   = Math.max(netGains - TAX_FREE_AMOUNT, 0);
  const abgeltungsteuer = taxableAmount * BASE_TAX_RATE;
  const soli            = abgeltungsteuer * SOLI_RATE;
  const totalTax        = abgeltungsteuer + soli;

  return {
    totalGains:              Math.max(netGains, 0),
    totalLosses:             Math.max(-netGains, 0),
    netGains,
    freiBetrag:              Math.min(netGains, TAX_FREE_AMOUNT),
    freiBetragRemaining:     Math.max(TAX_FREE_AMOUNT - netGains, 0),
    taxableAmount,
    abgeltungsteuer,
    solidaritaetszuschlag:   soli,
    totalTax,
    netAfterTax:             netGains - totalTax,
    effectiveRate:           netGains > 0 ? (totalTax / netGains) * 100 : 0,
  };
}
