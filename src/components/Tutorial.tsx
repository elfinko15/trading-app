'use client';
import { useSettingsStore } from '@/store/settingsStore';

const STEPS = [
  {
    emoji: '🚀',
    title: 'Willkommen bei TradeMaster Pro!',
    text: 'Du lernst hier, wie man Aktien, ETFs und Kryptos handelt — ganz ohne echtes Geld. Du bekommst virtuelles Startkapital und kannst damit frei üben.',
    highlight: null,
    tip: '✅ Kein echtes Geld · Kein Risiko · 100% sicheres Lernen',
  },
  {
    emoji: '💰',
    title: 'Dein Startkapital',
    text: 'Du startest mit einem virtuellen Betrag (Standard: $10.000). Dieses Geld kannst du in Aktien investieren. Kurs steigt → du verdienst. Kurs fällt → du verlierst.',
    highlight: 'Oben rechts siehst du immer: dein Cash & deinen Portfoliowert.',
    tip: null,
  },
  {
    emoji: '📈',
    title: 'Trading — so kaufst du eine Aktie',
    text: 'Tippe auf "Trading". Wähle eine Aktie aus der Liste (z.B. AAPL = Apple). Menge eingeben → "Kaufen" drücken → fertig!',
    highlight: '👉 Trading → Aktie wählen → Menge eingeben → Kaufen drücken',
    tip: '💡 "Market Order" = sofortiger Kauf zum aktuellen Preis. Das ist am einfachsten!',
  },
  {
    emoji: '💼',
    title: 'Portfolio — deine Investitionen',
    text: 'Unter "Portfolio" siehst du alle Aktien, die du gerade besitzt — wie viel du investiert hast und ob du im Plus oder Minus bist.',
    highlight: 'P&L = Profit & Loss = dein Gewinn oder Verlust in Dollar.',
    tip: null,
  },
  {
    emoji: '📚',
    title: 'Lernen — werde besser',
    text: 'Im "Lernen"-Bereich gibt es kurze Lektionen zu: Was ist eine Aktie? Was ist RSI? Wie manage ich Risiko? Jede Lektion bringt XP-Punkte.',
    highlight: null,
    tip: '🎓 Mehr XP = höheres Level = neue Features werden freigeschaltet!',
  },
  {
    emoji: '🏆',
    title: 'XP, Level & Achievements',
    text: 'Jeder Trade gibt dir 25 XP. Abgeschlossene Lektionen bringen noch mehr. Erreiche neue Level und sammle Achievements — genau wie in einem Spiel!',
    highlight: '🔥 Streak: Mehrere Tage aktiv = Bonus-XP täglich!',
    tip: null,
  },
  {
    emoji: '⚙️',
    title: 'Einstellungen anpassen',
    text: 'Unter "Einstellungen" kannst du: Startkapital wählen (von $500 bis $250.000), Provision einstellen, Portfolio zurücksetzen und vieles mehr.',
    highlight: null,
    tip: null,
  },
  {
    emoji: '🎯',
    title: "Deine erste Aufgabe!",
    text: 'Geh jetzt zu "Trading", wähle eine Aktie aus und kaufe sie. Dann schau unter "Portfolio" — dort siehst du deinen ersten Trade!',
    highlight: '👇 Tippe auf "Los geht\'s!" und dann auf "Trading"',
    tip: '🏆 Nach deinem ersten Trade: Achievement "Erster Trade" + 25 XP!',
  },
];

export default function Tutorial() {
  const { settings, advanceTutorial, skipTutorial } = useSettingsStore();

  if (!settings.showTutorial || settings.tutorialCompleted) return null;

  const step   = STEPS[settings.tutorialStep] ?? STEPS[STEPS.length - 1];
  const isLast = settings.tutorialStep >= STEPS.length - 1;
  const progress = ((settings.tutorialStep + 1) / STEPS.length) * 100;

  return (
    <>
      <div className="tutorial-backdrop" onClick={skipTutorial} />
      <div className="tutorial-card" style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>

        {/* Step dots */}
        <div style={{ display: 'flex', gap: '5px', marginBottom: '24px' }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: '3px', borderRadius: '99px',
              background: i <= settings.tutorialStep ? '#A78BFA' : 'rgba(255,255,255,0.10)',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>

        {/* Content */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div style={{ fontSize: '52px', marginBottom: '14px', lineHeight: 1 }}>{step.emoji}</div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'rgba(255,255,255,0.97)', margin: '0 0 12px', lineHeight: 1.35 }}>
            {step.title}
          </h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.70)', lineHeight: 1.72, margin: 0 }}>
            {step.text}
          </p>

          {step.highlight && (
            <div style={{
              marginTop: '14px', padding: '12px 15px',
              background: 'rgba(120,80,255,0.18)',
              border: '1px solid rgba(140,100,255,0.32)',
              borderRadius: '10px',
              fontSize: '13px', color: '#C4B5FD',
              textAlign: 'left', lineHeight: 1.60, fontWeight: 500,
            }}>
              {step.highlight}
            </div>
          )}

          {step.tip && (
            <div style={{
              marginTop: '10px', padding: '12px 15px',
              background: 'rgba(0,199,135,0.12)',
              border: '1px solid rgba(0,199,135,0.24)',
              borderRadius: '10px',
              fontSize: '13px', color: '#6EE7B7',
              textAlign: 'left', lineHeight: 1.60,
            }}>
              {step.tip}
            </div>
          )}
        </div>

        {/* Counter */}
        <div style={{ textAlign: 'center', fontSize: '11px', color: 'rgba(255,255,255,0.28)', marginBottom: '12px' }}>
          Schritt {settings.tutorialStep + 1} von {STEPS.length}
        </div>

        {/* Progress bar */}
        <div style={{ height: '2px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', marginBottom: '18px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #818CF8, #A78BFA)', borderRadius: '99px', transition: 'width 0.4s ease' }} />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={skipTutorial}
            style={{
              flex: 1, padding: '12px', borderRadius: '10px', minHeight: '48px',
              border: '1px solid rgba(255,255,255,0.10)',
              background: 'rgba(255,255,255,0.05)',
              color: 'rgba(255,255,255,0.38)',
              fontSize: '13px', cursor: 'pointer', fontWeight: 600,
            }}
          >
            Überspringen
          </button>
          <button
            onClick={isLast ? skipTutorial : advanceTutorial}
            className="btn-primary"
            style={{ flex: 2, justifyContent: 'center', fontSize: '14px', minHeight: '48px' }}
          >
            {isLast ? '🚀 Los geht\'s!' : 'Weiter →'}
          </button>
        </div>
      </div>
    </>
  );
}
