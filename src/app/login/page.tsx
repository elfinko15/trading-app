'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const { signIn, loading } = useAuthStore();
  const router = useRouter();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const err = await signIn(email, password);
    if (err) { setError(err); return; }
    router.push('/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        width: '100%', maxWidth: '420px',
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
            background: 'linear-gradient(135deg, #6D4AE8 0%, #4F8EF7 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px', fontWeight: 800, color: 'white',
            boxShadow: '0 6px 20px rgba(109,74,232,0.55)',
          }}>
            T
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'rgba(255,255,255,0.95)', margin: '0 0 4px' }}>
            TradeMaster Pro
          </h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.42)', margin: 0 }}>
            Melde dich an und trade die Galaxis
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: '6px' }}>
              E-Mail
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
            {loading ? 'Anmelden…' : '🚀 Anmelden'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'rgba(255,255,255,0.40)' }}>
          Noch kein Konto?{' '}
          <Link href="/register" style={{ color: '#A78BFA', fontWeight: 700, textDecoration: 'none' }}>
            Jetzt registrieren
          </Link>
        </div>

        {/* Demo hint */}
        <div style={{
          marginTop: '20px', padding: '12px', borderRadius: '10px',
          background: 'rgba(120,80,255,0.10)', border: '1px solid rgba(120,80,255,0.20)',
          fontSize: '12px', color: 'rgba(255,255,255,0.45)', textAlign: 'center', lineHeight: 1.5,
        }}>
          💡 Kein Backend konfiguriert? Die App funktioniert auch offline — einfach <Link href="/dashboard" style={{ color: '#A78BFA', fontWeight: 600, textDecoration: 'none' }}>ohne Login fortfahren</Link>
        </div>
      </div>
    </div>
  );
}
