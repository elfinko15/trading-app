'use client';
import { useState } from 'react';
import Header from '@/components/layout/Header';
import { useSettingsStore, AVATARS_LIST } from '@/store/settingsStore';
import { usePortfolioStore } from '@/store/portfolioStore';
import { useUserStore } from '@/store/userStore';
import { useMarketStore } from '@/store/marketStore';

const SPEED_OPTIONS = [
  { label: 'Sehr schnell', value: 800 },
  { label: 'Schnell',      value: 1500 },
  { label: 'Normal',       value: 2000 },
  { label: 'Langsam',      value: 4000 },
  { label: 'Sehr langsam', value: 8000 },
];

const CAPITAL_OPTIONS = [
  { label: '$500',   value: 500 },
  { label: '$1K',    value: 1_000 },
  { label: '$2.5K',  value: 2_500 },
  { label: '$5K',    value: 5_000 },
  { label: '$10K',   value: 10_000 },
  { label: '$25K',   value: 25_000 },
  { label: '$50K',   value: 50_000 },
  { label: '$100K',  value: 100_000 },
  { label: '$250K',  value: 250_000 },
];

const COMMISSION_OPTIONS = [
  { label: 'Kostenlos (0%)',        value: 0 },
  { label: 'Günstig (0.1%)',        value: 0.001 },
  { label: 'Realistisch (0.5%)',    value: 0.005 },
];

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'rgba(18,8,48,0.75)',
      backdropFilter: 'blur(40px)',
      WebkitBackdropFilter: 'blur(40px)',
      border: '1px solid rgba(140,100,255,0.22)',
      borderRadius: '16px', overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0,0,0,0.55)',
    }}>
      <div style={{
        padding: '14px 20px', background: 'rgba(120,80,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <span style={{ fontSize: '18px' }}>{icon}</span>
        <span style={{ fontSize: '14px', fontWeight: 700, color: 'rgba(255,255,255,0.92)' }}>{title}</span>
      </div>
      <div style={{ padding: '4px 0' }}>{children}</div>
    </div>
  );
}

function Row({ label, hint, children, last }: { label: string; hint?: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '14px 20px', minHeight: '62px',
      borderBottom: last ? 'none' : '1px solid rgba(255,255,255,0.05)',
      gap: '12px',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.88)' }}>{label}</div>
        {hint && <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.38)', marginTop: '2px', lineHeight: 1.4 }}>{hint}</div>}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: '52px', height: '30px', borderRadius: '15px', border: 'none', flexShrink: 0,
        background: on ? 'linear-gradient(135deg, #6D4AE8, #4F8EF7)' : 'rgba(255,255,255,0.12)',
        cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
        boxShadow: on ? '0 2px 8px rgba(109,74,232,0.40)' : 'none',
      }}
    >
      <div style={{
        width: '22px', height: '22px', borderRadius: '50%', background: 'white',
        position: 'absolute', top: '4px', left: on ? '26px' : '4px',
        transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.30)',
      }} />
    </button>
  );
}

export default function SettingsPage() {
  const { settings, update, resetTutorial, skipTutorial } = useSettingsStore();
  const { resetPortfolio } = usePortfolioStore();
  const { stopTicker, startTicker } = useMarketStore();
  const { user, setName } = useUserStore();

  const [name, setNameLocal]     = useState(settings.username);
  const [resetConfirm, setReset] = useState(false);
  const [saved, setSaved]        = useState(false);

  const saveProfile = () => {
    update({ username: name });
    setName(name);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSpeed = (ms: number) => {
    stopTicker();
    update({ tickerSpeed: ms });
    startTicker();
  };

  const handleReset = () => {
    if (!resetConfirm) { setReset(true); return; }
    resetPortfolio();
    setReset(false);
  };

  const chipStyle = (active: boolean): React.CSSProperties => ({
    padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 700,
    cursor: 'pointer', transition: 'all 0.15s', minHeight: '40px', border: 'none',
    borderWidth: '1px', borderStyle: 'solid',
    borderColor: active ? 'rgba(140,100,255,0.60)' : 'rgba(255,255,255,0.12)',
    background: active ? 'rgba(109,74,232,0.25)' : 'rgba(255,255,255,0.06)',
    color: active ? '#C4B5FD' : 'rgba(255,255,255,0.55)',
    boxShadow: active ? '0 0 10px rgba(109,74,232,0.25)' : 'none',
  });

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header title="Einstellungen" />
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '760px' }}>

        {/* Profil */}
        <Section title="Profil" icon="🧑‍💼">
          <Row label="Benutzername" hint="Dein Anzeigename im Spiel">
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                className="glass-input"
                value={name}
                onChange={e => setNameLocal(e.target.value)}
                style={{ width: '150px' }}
                placeholder="Dein Name"
              />
              <button className="btn-primary" onClick={saveProfile} style={{ whiteSpace: 'nowrap' }}>
                {saved ? '✓ Gespeichert' : 'Speichern'}
              </button>
            </div>
          </Row>

          <Row label="Avatar" hint="Wähle deinen Charakter">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxWidth: '280px', justifyContent: 'flex-end' }}>
              {AVATARS_LIST.map(av => (
                <button
                  key={av}
                  onClick={() => update({ avatar: av })}
                  style={{
                    width: '40px', height: '40px', borderRadius: '10px', fontSize: '20px',
                    border: settings.avatar === av ? '2px solid #A78BFA' : '1px solid rgba(255,255,255,0.12)',
                    background: settings.avatar === av ? 'rgba(120,80,255,0.25)' : 'rgba(255,255,255,0.05)',
                    cursor: 'pointer', transition: 'all 0.12s',
                    boxShadow: settings.avatar === av ? '0 0 12px rgba(120,80,255,0.45)' : 'none',
                  }}
                >
                  {av}
                </button>
              ))}
            </div>
          </Row>

          <Row label="Level & XP" hint="Dein aktueller Spielfortschritt" last>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#A78BFA' }}>Level {user.level}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.38)', marginTop: '2px' }}>
                {user.xp.toLocaleString('de')} XP · {user.achievements.filter(a => a.unlockedAt).length} Achievements
              </div>
            </div>
          </Row>
        </Section>

        {/* Startkapital */}
        <Section title="Startkapital" icon="💰">
          <div style={{ padding: '16px 20px' }}>
            <p style={{ margin: '0 0 14px', fontSize: '13px', color: 'rgba(255,255,255,0.50)', lineHeight: 1.65 }}>
              Das virtuelle Geld, das du nach einem Portfolio-Reset erhältst. Mit mehr Kapital kannst du realistischer handeln.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
              {CAPITAL_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => update({ startingCapital: opt.value })}
                  style={chipStyle(settings.startingCapital === opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div style={{
              padding: '14px 16px',
              background: 'rgba(109,74,232,0.12)',
              border: '1px solid rgba(120,80,255,0.22)',
              borderRadius: '10px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.38)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Aktuell ausgewählt</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#A78BFA', fontVariantNumeric: 'tabular-nums' }}>
                  ${settings.startingCapital.toLocaleString('de')}
                </div>
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.32)', textAlign: 'right' }}>
                Aktiv nach<br />nächstem Reset
              </div>
            </div>
          </div>
        </Section>

        {/* Simulation */}
        <Section title="Simulation & Trading" icon="⚙️">
          <Row label="Broker-Provision" hint="Kosten pro Trade (macht die Simulation realistischer)">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
              {COMMISSION_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => update({ commissionRate: opt.value })}
                  style={{ ...chipStyle(settings.commissionRate === opt.value), fontSize: '12px', padding: '7px 12px', minHeight: '36px' }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </Row>

          <Row label="Kurs-Geschwindigkeit" hint="Wie oft sich die Kurse aktualisieren">
            <select
              className="glass-input"
              style={{ width: '185px' }}
              value={settings.tickerSpeed}
              onChange={e => handleSpeed(Number(e.target.value))}
            >
              {SPEED_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label} ({o.value / 1000}s)</option>
              ))}
            </select>
          </Row>

          <Row label="Chart-Stil" hint="Darstellung der Kursverläufe">
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => update({ chartStyle: 'candlestick' })} style={chipStyle(settings.chartStyle === 'candlestick')}>
                🕯️ Kerzen
              </button>
              <button onClick={() => update({ chartStyle: 'line' })} style={chipStyle(settings.chartStyle === 'line')}>
                📉 Linie
              </button>
            </div>
          </Row>

          <Row label="Risiko-Warnungen" hint="Warnung bei sehr großen Positionen anzeigen">
            <Toggle on={settings.riskWarnings} onToggle={() => update({ riskWarnings: !settings.riskWarnings })} />
          </Row>

          <Row label="Prozente anzeigen" hint="P&L in % zusätzlich zu Dollar" last>
            <Toggle on={settings.showPercentages} onToggle={() => update({ showPercentages: !settings.showPercentages })} />
          </Row>
        </Section>

        {/* Portfolio Reset */}
        <Section title="Portfolio & Daten" icon="🗂️">
          <Row
            label="Portfolio zurücksetzen"
            hint={`Alle Positionen & Trades löschen — neu starten mit $${settings.startingCapital.toLocaleString('de')}`}
            last={!resetConfirm}
          >
            <button
              onClick={handleReset}
              style={{
                padding: '10px 16px', minHeight: '44px', borderRadius: '10px',
                fontSize: '13px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s', border: 'none',
                borderWidth: '1px', borderStyle: 'solid',
                borderColor: 'rgba(240,78,78,0.35)',
                background: resetConfirm ? 'rgba(240,78,78,0.22)' : 'rgba(240,78,78,0.08)',
                color: resetConfirm ? '#F04E4E' : 'rgba(240,78,78,0.75)',
                whiteSpace: 'nowrap',
              }}
            >
              {resetConfirm ? '⚠️ Wirklich? Nochmal tippen!' : '🔄 Portfolio zurücksetzen'}
            </button>
          </Row>
          {resetConfirm && (
            <div style={{ padding: '8px 20px 14px' }}>
              <button
                onClick={() => setReset(false)}
                style={{ fontSize: '13px', color: 'rgba(255,255,255,0.38)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0' }}
              >
                ✕ Abbrechen
              </button>
            </div>
          )}
        </Section>

        {/* Audio */}
        <Section title="Audio" icon="🔊">
          <Row label="Soundeffekte" hint="Klänge bei Trades und Achievements" last>
            <Toggle on={settings.soundEnabled} onToggle={() => update({ soundEnabled: !settings.soundEnabled })} />
          </Row>
        </Section>

        {/* Tutorial */}
        <Section title="Tutorial & Hilfe" icon="🎓">
          <Row label="Tutorial erneut ansehen" hint="Erklärt alle Funktionen Schritt für Schritt">
            <button className="btn-primary" onClick={resetTutorial} style={{ whiteSpace: 'nowrap' }}>
              🔄 Tutorial starten
            </button>
          </Row>
          <Row label="Tutorial deaktivieren" hint="Tutorial permanent ausblenden" last>
            <button
              className="btn-ghost"
              onClick={skipTutorial}
              style={{ fontSize: '13px', whiteSpace: 'nowrap' }}
            >
              Ausblenden
            </button>
          </Row>
        </Section>

        {/* About */}
        <Section title="Über TradeMaster Pro" icon="ℹ️">
          <div style={{ padding: '8px 20px 12px' }}>
            {[
              ['Version',    '1.0.0'],
              ['Modus',      'Simulator — kein echtes Geld'],
              ['Marktdaten', 'Simuliert (kein Echtzeit-Feed)'],
              ['Assets',     '10 Märkte (Aktien, ETFs, Krypto)'],
              ['Plattform',  'iPad & Desktop optimiert'],
            ].map(([k, v], i, arr) => (
              <div key={k} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '11px 0', fontSize: '13px',
                borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}>
                <span style={{ color: 'rgba(255,255,255,0.40)' }}>{k}</span>
                <span style={{ fontWeight: 600, color: 'rgba(255,255,255,0.78)' }}>{v}</span>
              </div>
            ))}
          </div>
        </Section>

      </div>
    </div>
  );
}
