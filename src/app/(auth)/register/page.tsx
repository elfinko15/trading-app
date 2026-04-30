'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { useSettingsStore } from '@/store/settingsStore';

export default function RegisterPage() {
  const { signUp, loading } = useAuthStore();
  const { setName } = useUserStore();
  const { resetTutorial } = useSettingsStore();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [error,    setError]    = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (username.length < 3)  { setError('Benutzername muss mindestens 3 Zeichen lang sein.'); return; }
    if (username.length > 20) { setError('Benutzername darf maximal 20 Zeichen lang sein.'); return; }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) { setError('Nur Buchstaben, Zahlen und _ erlaubt.'); return; }
    if (password.length < 6)  { setError('Passwort muss mindestens 6 Zeichen lang sein.'); return; }
    if (password !== confirm)  { setError('Passwörter stimmen nicht überein.'); return; }

    const err = await signUp(username, email, password);
    if (err) { setError(err); return; }
    setName(username);
    resetTutorial();
    router.push('/dashboard');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '460px', margin: '0 auto' }}>

      {/* Logo */}
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <div style={{
          width: '68px', height: '68px', borderRadius: '20px', margin: '0 auto 14px',
          background: 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', fontWeight: 900, color: 'white',
          boxShadow: '0 0 48px rgba(124,58,237,0.60), 0 8px 24px rgba(0,0,0,0.55)',
          border: '1px solid rgba(180,140,255,0.25)',
        }}>
          T
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#fff', margin: '0 0 5px', letterSpacing: '-0.03em' }}>
          Konto erstellen
        </h1>
        <p style={{ fontSize: '13px', color: 'rgba(180,160,255,0.55)', margin: 0 }}>
          Kostenlos · Kein echtes Geld · Sofort loslegen
        </p>
      </div>

      {/* Glass card */}
      <div style={{
        width: '100%',
        background: 'rgba(8,4,28,0.88)',
        backdropFilter: 'blur(64px) saturate(300%)',
        WebkitBackdropFilter: 'blur(64px) saturate(300%)',
        border: '1px solid rgba(140,100,255,0.25)',
        borderRadius: '26px',
        padding: '32px',
        boxShadow: '0 40px 100px rgba(0,0,0,0.85), inset 0 1px 0 rgba(200,160,255,0.12), 0 0 100px rgba(100,50,220,0.12)',
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(160,130,255,0.65)', display: 'block', marginBottom: '7px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Benutzername
              <span style={{ color: 'rgba(255,255,255,0.22)', fontWeight: 400, textTransform: 'none', letterSpacing: 0, marginLeft: '6px' }}>erscheint in der Bestenliste</span>
            </label>
            <input
              type="text"
              className="glass-input"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="z.B. ProTrader99"
              required
              minLength={3} maxLength={20}
              autoComplete="username"
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(160,130,255,0.65)', display: 'block', marginBottom: '7px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              E-Mail
              <span style={{ color: 'rgba(255,255,255,0.22)', fontWeight: 400, textTransform: 'none', letterSpacing: 0, marginLeft: '6px' }}>keine Bestätigung nötig</span>
            </label>
            <input
              type="email"
              className="glass-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="deine@email.de"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(160,130,255,0.65)', display: 'block', marginBottom: '7px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Passwort
              <span style={{ color: 'rgba(255,255,255,0.22)', fontWeight: 400, textTransform: 'none', letterSpacing: 0, marginLeft: '6px' }}>min. 6 Zeichen</span>
            </label>
            <input
              type="password"
              className="glass-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(160,130,255,0.65)', display: 'block', marginBottom: '7px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Passwort bestätigen
            </label>
            <input
              type="password"
              className="glass-input"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div style={{
              padding: '11px 14px', borderRadius: '12px', fontSize: '13px',
              background: 'rgba(240,78,78,0.10)', border: '1px solid rgba(240,78,78,0.22)',
              color: '#F87171', display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', fontSize: '16px', minHeight: '54px', marginTop: '4px', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? '⏳ Registrieren…' : '✨ Konto erstellen & loslegen'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '18px 0 14px' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.22)' }}>bereits registriert?</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
        </div>

        <div style={{ textAlign: 'center', fontSize: '14px', color: 'rgba(255,255,255,0.42)' }}>
          <Link href="/login" style={{ color: '#A78BFA', fontWeight: 700, textDecoration: 'none' }}>
            🚀 Jetzt anmelden
          </Link>
        </div>

        <p style={{ marginTop: '16px', fontSize: '11px', color: 'rgba(255,255,255,0.18)', textAlign: 'center', lineHeight: 1.6 }}>
          TradeMaster Pro ist ein Lernspiel. Kein echtes Geld, keine echten Risiken.
        </p>
      </div>
    </div>
  );
}
