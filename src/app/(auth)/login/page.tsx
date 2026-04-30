'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const { signIn, loading } = useAuthStore();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const err = await signIn(username, password);
    if (err) { setError(err); return; }
    router.push('/dashboard');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '460px', margin: '0 auto' }}>

      {/* Logo */}
      <div style={{ marginBottom: '28px', textAlign: 'center' }}>
        <div style={{
          width: '76px', height: '76px', borderRadius: '24px', margin: '0 auto 16px',
          background: 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '32px', fontWeight: 900, color: 'white',
          boxShadow: '0 0 48px rgba(124,58,237,0.65), 0 10px 30px rgba(0,0,0,0.60)',
          border: '1px solid rgba(180,140,255,0.25)',
        }}>
          T
        </div>
        <h1 style={{ fontSize: '30px', fontWeight: 900, color: '#fff', margin: '0 0 6px', letterSpacing: '-0.03em' }}>
          TradeMaster Pro
        </h1>
        <p style={{ fontSize: '14px', color: 'rgba(180,160,255,0.55)', margin: 0 }}>
          ✨ Trade die Galaxis — kostenlos & risikolos
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
        padding: '36px 32px',
        boxShadow: '0 40px 100px rgba(0,0,0,0.85), inset 0 1px 0 rgba(200,160,255,0.12), 0 0 100px rgba(100,50,220,0.12)',
      }}>
        <h2 style={{ fontSize: '17px', fontWeight: 700, color: 'rgba(255,255,255,0.80)', margin: '0 0 22px', textAlign: 'center' }}>
          Willkommen zurück 👋
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(160,130,255,0.65)', display: 'block', marginBottom: '7px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Benutzername
            </label>
            <input
              type="text"
              className="glass-input"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="z.B. ProTrader99"
              required
              autoComplete="username"
              autoCapitalize="none"
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(160,130,255,0.65)', display: 'block', marginBottom: '7px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Passwort
            </label>
            <input
              type="password"
              className="glass-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div style={{
              padding: '11px 14px', borderRadius: '12px', fontSize: '13px',
              background: 'rgba(240,78,78,0.10)', border: '1px solid rgba(240,78,78,0.22)',
              color: '#F87171',
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
            {loading ? '⏳ Anmelden…' : '🚀 Jetzt anmelden'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '18px 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.22)' }}>oder</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
        </div>

        <div style={{ textAlign: 'center', fontSize: '14px', color: 'rgba(255,255,255,0.42)' }}>
          Noch kein Konto?{' '}
          <Link href="/register" style={{ color: '#A78BFA', fontWeight: 700, textDecoration: 'none' }}>
            Jetzt registrieren ✨
          </Link>
        </div>
      </div>

      {/* Feature pills */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {['📈 Echte Kurse', '🎮 Gamifiziert', '🏆 Bestenliste', '🆓 100% kostenlos'].map(f => (
          <span key={f} style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: '99px',
            padding: '5px 12px',
            fontSize: '12px',
            color: 'rgba(255,255,255,0.40)',
            whiteSpace: 'nowrap',
          }}>{f}</span>
        ))}
      </div>
    </div>
  );
}
