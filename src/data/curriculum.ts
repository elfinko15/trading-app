import type { Module } from '@/domain/models';

export const CURRICULUM: Module[] = [
  {
    id: 'basics',
    title: 'Die Basics',
    description: 'Orderbuch, Geld-Brief-Spanne und Handelszeiten',
    icon: '📚',
    requiredLevel: 1,
    completed: false,
    progress: 0,
    lessons: [
      {
        id: 'basics-1',
        title: 'Was ist eine Aktie?',
        type: 'theory',
        duration: 5,
        xpReward: 50,
        completed: false,
        content: `
# Was ist eine Aktie?

Eine **Aktie** repräsentiert einen Eigentumsanteil an einem Unternehmen. Wenn du eine Aktie kaufst, wirst du Miteigentümer dieses Unternehmens.

## Wichtige Konzepte

**Kurs (Preis):** Der aktuelle Handelspreis einer Aktie wird durch Angebot und Nachfrage bestimmt.

**Geld-Brief-Spanne (Bid-Ask Spread):**
- **Bid (Geld):** Der höchste Preis, den ein Käufer zahlen möchte
- **Ask (Brief):** Der niedrigste Preis, den ein Verkäufer akzeptiert
- Die Differenz ist die Spread — dein "Einstiegskosten"

**Handelszeiten:**
- NYSE/NASDAQ: 15:30 – 22:00 Uhr MEZ
- Xetra (Frankfurt): 09:00 – 17:30 Uhr MEZ
- Krypto: 24/7

## Orderbuch
Das Orderbuch zeigt alle offenen Kauf- und Verkaufsaufträge. Viele Käufer = Kurs steigt. Viele Verkäufer = Kurs fällt.
        `,
      },
      {
        id: 'basics-2',
        title: 'Order-Typen erklärt',
        type: 'theory',
        duration: 6,
        xpReward: 60,
        completed: false,
        content: `
# Order-Typen

## Market Order (Marktorder)
Kaufe oder verkaufe **sofort** zum aktuellen Marktpreis.
- ✅ Wird garantiert ausgeführt
- ❌ Preis kann schlechter sein als erwartet (Slippage)

## Limit Order (Limitorder)
Kaufe/verkaufe **nur** zu einem bestimmten Preis oder besser.
- ✅ Du kontrollierst den Preis
- ❌ Wird möglicherweise nicht ausgeführt

## Stop-Loss Order
Verkaufe automatisch, wenn der Kurs eine bestimmte Schwelle **unterschreitet**.
- ✅ Schützt vor großen Verlusten
- ✅ Emotionsloser Ausstieg
- ❌ Bei starken Kurssprüngen (Gaps) kann der Stop-Kurs übersprungen werden

## Beispiel
Du kaufst AAPL bei $190. Du setzt einen Stop-Loss bei $180 (5,3% Risiko). Fällt AAPL auf $180, verkauft dein System automatisch.
        `,
      },
      {
        id: 'basics-quiz',
        title: 'Basics Quiz',
        type: 'quiz',
        duration: 4,
        xpReward: 80,
        completed: false,
        content: 'Teste dein Wissen über die Grundlagen des Aktienhandels.',
        questions: [
          {
            question: 'Was ist der "Bid-Ask Spread"?',
            options: [
              'Die Differenz zwischen Tageshoch und Tagestief',
              'Die Differenz zwischen Kaufpreis (Ask) und Verkaufspreis (Bid)',
              'Die tägliche Kursschwankung einer Aktie',
              'Der Unterschied zwischen Marktpreis und Buchwert',
            ],
            correctIndex: 1,
            explanation: 'Der Bid-Ask Spread ist die Differenz zwischen dem Preis, zu dem Käufer kaufen möchten (Bid) und dem Preis, zu dem Verkäufer verkaufen möchten (Ask). Diese Differenz repräsentiert implizite Transaktionskosten.',
          },
          {
            question: 'Welche Order-Art garantiert eine Ausführung?',
            options: ['Limit Order', 'Stop-Loss Order', 'Market Order', 'Take-Profit Order'],
            correctIndex: 2,
            explanation: 'Eine Market Order wird immer zum aktuellen Marktpreis ausgeführt. Der Nachteil ist, dass du nicht genau weißt, zu welchem Preis — besonders bei illiquiden Aktien.',
          },
          {
            question: 'Wozu dient ein Stop-Loss?',
            options: [
              'Um Gewinne zu maximieren',
              'Um Verluste auf ein Maximum zu begrenzen',
              'Um die beste Einstiegszeit zu finden',
              'Um Dividenden zu erhalten',
            ],
            correctIndex: 1,
            explanation: 'Ein Stop-Loss schützt dich vor zu großen Verlusten. Er verkauft deine Position automatisch, wenn der Kurs unter eine definierte Schwelle fällt.',
          },
        ],
      },
    ],
  },
  {
    id: 'technical',
    title: 'Technische Analyse',
    description: 'Support/Resistance, Candlesticks, MACD & RSI',
    icon: '📈',
    requiredLevel: 2,
    completed: false,
    progress: 0,
    lessons: [
      {
        id: 'tech-1',
        title: 'Candlestick-Muster',
        type: 'theory',
        duration: 8,
        xpReward: 100,
        completed: false,
        content: `
# Candlestick-Muster

## Aufbau einer Kerze
Jede Kerze zeigt 4 Preise: **Open, High, Low, Close (OHLC)**

- **Grüne Kerze:** Kurs ist gestiegen (Close > Open)
- **Rote Kerze:** Kurs ist gefallen (Close < Open)
- **Docht oben:** Kurs war kurz höher, fiel dann zurück
- **Docht unten:** Kurs war kurz tiefer, erholte sich

## Wichtige Muster

**Doji:** Open ≈ Close → Unentschlossenheit. Trendumkehr möglich.

**Hammer:** Langer unterer Docht → Käufer haben Kontrolle übernommen. Bullisches Signal.

**Shooting Star:** Langer oberer Docht → Verkäufer haben drückten den Kurs wieder runter. Bärisches Signal.

**Engulfing Pattern:** Große Kerze "verschluckt" die vorherige → starkes Trendumkehrsignal.
        `,
      },
      {
        id: 'tech-2',
        title: 'RSI & MACD Indikatoren',
        type: 'theory',
        duration: 10,
        xpReward: 120,
        completed: false,
        content: `
# Technische Indikatoren

## RSI (Relative Strength Index)
Misst, ob ein Asset **überkauft** oder **überverkauft** ist. Skala: 0–100.

- **RSI > 70:** Überkauft → möglicher Rückgang
- **RSI < 30:** Überverkauft → mögliche Erholung
- **RSI = 50:** Neutral

## MACD (Moving Average Convergence Divergence)
Zeigt die Dynamik eines Trends.

**Komponenten:**
- MACD-Linie: 12-Tage EMA minus 26-Tage EMA
- Signal-Linie: 9-Tage EMA der MACD-Linie
- Histogramm: Differenz zwischen MACD und Signal

**Signale:**
- MACD **kreuzt Signal von unten** → Kaufsignal 🟢
- MACD **kreuzt Signal von oben** → Verkaufssignal 🔴

## Support & Resistance
- **Support:** Preisniveau, bei dem viele kaufen → "Boden"
- **Resistance:** Preisniveau, bei dem viele verkaufen → "Decke"
- Bricht der Kurs durch einen Widerstand → neues Potential nach oben
        `,
      },
      {
        id: 'tech-quiz',
        title: 'Technische Analyse Quiz',
        type: 'quiz',
        duration: 5,
        xpReward: 100,
        completed: false,
        content: 'Teste dein Wissen über technische Indikatoren.',
        questions: [
          {
            question: 'Ein RSI-Wert von 78 bedeutet...',
            options: ['Die Aktie ist überverkauft', 'Die Aktie ist überkauft', 'Die Aktie ist neutral', 'Es gibt kein gültiges Signal'],
            correctIndex: 1,
            explanation: 'Ein RSI über 70 gilt als überkauft. Das bedeutet, dass die Aktie in kurzer Zeit stark gestiegen ist und eine Korrektur möglich ist.',
          },
          {
            question: 'Was zeigt ein "Hammer"-Candlestick-Muster?',
            options: [
              'Starker Abwärtstrend',
              'Käufer haben nach einem Tief die Kontrolle übernommen — bullisches Signal',
              'Unentschlossenheit am Markt',
              'Hohe Volatilität ohne klare Richtung',
            ],
            correctIndex: 1,
            explanation: 'Ein Hammer hat einen langen unteren Docht und einen kleinen Körper oben. Verkäufer drückten den Preis zuerst tief, aber Käufer haben den Kurs wieder nach oben gebracht — bullisches Zeichen.',
          },
        ],
      },
    ],
  },
  {
    id: 'psychology',
    title: 'Psychologie & Risiko',
    description: 'Positionsgrößen, Verluste managen, Trader-Psychologie',
    icon: '🧠',
    requiredLevel: 3,
    completed: false,
    progress: 0,
    lessons: [
      {
        id: 'psych-1',
        title: 'Positionsgrößen-Bestimmung',
        type: 'theory',
        duration: 7,
        xpReward: 120,
        completed: false,
        content: `
# Positionsgrößen-Bestimmung

## Die 1%-Regel
**Riskiere nie mehr als 1–2% deines Kapitals in einem einzelnen Trade.**

### Formel
\`\`\`
Positionsgröße = (Kapital × Risiko%) / (Einstieg – Stop-Loss)
\`\`\`

### Beispiel
- Kapital: $10.000
- Risiko: 1% = $100
- AAPL bei $190, Stop-Loss bei $185
- Risiko pro Aktie: $5
- **Positionsgröße: $100 / $5 = 20 Aktien**

## Warum ist das wichtig?
Ohne Positionsgrößen-Management kannst du mit einem einzigen Trade einen Großteil deines Kapitals verlieren.

## R-Multiplikator
- **1R** = dein definiertes Risiko pro Trade
- Ziel: Trades mit mindestens **2R Gewinnpotential** (Risk/Reward Ratio ≥ 2:1)
        `,
      },
      {
        id: 'psych-2',
        title: 'Emotionen im Trading',
        type: 'theory',
        duration: 6,
        xpReward: 110,
        completed: false,
        content: `
# Emotionen im Trading

## Die größten Feinde
**FOMO (Fear of Missing Out):** Du kaufst, weil alle kaufen — oft am Hoch.
**Angst:** Du verkaufst zu früh aus Angst vor Verlusten.
**Gier:** Du hältst zu lang, weil du mehr willst.
**Rache-Trading:** Nach einem Verlust überstürzt handeln, um den Verlust sofort wieder reinzuholen.

## Lösungsansätze
1. **Handelsplan:** Definiere Einstieg, Stop-Loss und Ziel **vor** dem Trade
2. **Trade-Journal:** Dokumentiere jeden Trade und deine Emotionen dabei
3. **Regeln aufstellen:** "Ich mache maximal 3 Trades pro Tag"
4. **Pause nach Verlusten:** Nach 3 Verlust-Trades stoppe für heute

## Die Wahrheit
Profis verlieren auch Trades. Der Unterschied: Sie **kontrollieren ihre Verluste** und lassen **Gewinne laufen**.
        `,
      },
    ],
  },
  {
    id: 'fundamentals',
    title: 'Fundamentalanalyse',
    description: 'KGV, Dividenden, Quartalszahlen verstehen',
    icon: '🔍',
    requiredLevel: 4,
    completed: false,
    progress: 0,
    lessons: [
      {
        id: 'fund-1',
        title: 'KGV und Bewertungskennzahlen',
        type: 'theory',
        duration: 8,
        xpReward: 130,
        completed: false,
        content: `
# Fundamentalanalyse: Bewertungskennzahlen

## KGV (Kurs-Gewinn-Verhältnis) / P/E Ratio
\`\`\`
KGV = Aktienkurs / Gewinn je Aktie (EPS)
\`\`\`
- **KGV < 15:** Günstig bewertet (oder schlechtes Wachstum)
- **KGV 15–25:** Marktdurchschnitt
- **KGV > 30:** Teuer bewertet (oder hohes Wachstum erwartet)

## Dividendenrendite
\`\`\`
Dividendenrendite = Jährliche Dividende / Aktienkurs × 100
\`\`\`
- Attraktiv für Income-Investoren
- Hohe Rendite kann auf Probleme hinweisen (Yield Trap)

## Quartalszahlen (Earnings)
4× pro Jahr berichten Unternehmen ihre Zahlen.
- **EPS Beat:** Gewinn über Erwartung → Kurs steigt oft
- **Revenue Beat:** Umsatz über Erwartung → positives Signal
- **Guidance:** Ausblick ist oft wichtiger als vergangene Zahlen

## Beispiel Apple (AAPL)
- KGV: ~29 (moderat für Big Tech)
- EPS: ~$6,44
- Dividende: $0,97/Jahr (~0,5% Rendite)
        `,
      },
    ],
  },
];
