'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';

export default function RegisterPage() {
  const { signUp, loading } = useAuthStore();
  const { setName } = useUserStore();
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
    if (!/^[a-zA-Z0-9_]+$/.test(username)) { setError('Benutzername darf nur Buchstaben, Zahlen und _ enthalten.'); return; }
    if (password.length < 6)  { setError('Passwort muss mindestens 6 Zeichen lang sein.'); return; }
    if (password !== confirm)  { setError('Passwörter stimmen nicht überein.'); return; }

    const err = await signUp(username, email, password);
    if (err) { setError(err); return; }
    setName(username);
    router.push('/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        width: '100%', maxWidth: '440px',
        background: 'rgba(12,6,40,0.97)',
        backdropFilter: 'blur(48px)',
        border: '1px solid rgba(140,100,255,0.32)',
        borderRadius: '22px',
        padding: '36px 32px',
        boxShadow: '0 28px 72px rgba(0,0,0,0.75), 0 0 60px rgba(100,60,220,0.20)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '14px', margin: '0 auto 12px',
            background: 'linear-gradient(135deg, #6D4AE8, #4F8EF7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px', fontWeight: 800, color: 'white',
            boxShadow: '0 6px 20px rgba(109,74,232,0.55)',
          }}>
            T
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'rgba(255,255,255,0.95)', margin: '0 0 4px' }}>
            Konto erstellen
          </h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.42)', margin: 0 }}>
            Kostenlos · Kein echtes Geld · Sofort loslegen
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: '6px' }}>
              Benutzername <span style={{ color: 'rgba(255,255,255,0.28)', fontWeight: 400 }}>(erscheint in der Bestenliste)</span>
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
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: '6px' }}>
              E-Mail <span style={{ color: 'rgba(255,255,255,0.28)', fontWeight: 400 }}>(keine Bestätigung nötig)</span>
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
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: '6px' }}>
              Passwort <span style={{ color: 'rgba(255,255,255,0.28)', fontWeight: 400 }}>(min. 6 Zeichen)</span>
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
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: '6px' }}>
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
              padding: '10px 14px', borderRadius: '10px', fontSize: '13px',
              background: 'rgba(240,78,78,0.14)', border: '1px solid rgba(240,78,78,0.28)',
              color: '#F87171',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', fontSize: '15px', minHeight: '50px', marginTop: '4px', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Registrieren…' : '✨ Konto erstellen'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'rgba(255,255,255,0.40)' }}>
          Bereits ein Konto?{' '}
          <Link href="/login" style={{ color: '#A78BFA', fontWeight: 700, textDecoration: 'none' }}>
            Anmelden
          </Link>
        </div>

        <p style={{ marginTop: '16px', fontSize: '11px', color: 'rgba(255,255,255,0.22)', textAlign: 'center', lineHeight: 1.5 }}>
          Mit der Registrierung akzeptierst du, dass TradeMaster Pro ein Lernspiel ohne echtes Geld ist.
        </p>
      </div>
    </div>
  );
}
