'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { useAuthStore } from '@/store/authStore';

const NAV = [
  { href: '/dashboard',   icon: '🏠', label: 'Dashboard' },
  { href: '/trading',     icon: '📈', label: 'Trading' },
  { href: '/portfolio',   icon: '💼', label: 'Portfolio' },
  { href: '/learn',       icon: '📚', label: 'Lernen' },
  { href: '/leaderboard', icon: '🏆', label: 'Bestenliste' },
  { href: '/friends',     icon: '👥', label: 'Freunde' },
  { href: '/journal',     icon: '📝', label: 'Journal' },
  { href: '/settings',    icon: '⚙️', label: 'Einstellungen' },
];

const LEVEL_LABELS: Record<string, string> = {
  beginner:     'Anfänger',
  intermediate: 'Fortgeschritten',
  advanced:     'Erfahren',
  expert:       'Experte',
};

function getXPForLevel(level: number): number {
  const T = [0, 0, 200, 500, 900, 1400, 2100, 3000, 4200, 5600, 7200, 9000];
  return T[Math.max(0, Math.min(level, T.length - 1))];
}

export default function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { user } = useUserStore();
  const { user: authUser, signOut } = useAuthStore();

  const xpCur  = user.xp - getXPForLevel(user.level - 1);
  const xpNext = getXPForLevel(user.level) - getXPForLevel(user.level - 1);
  const xpPct  = Math.min(100, Math.max(0, (xpCur / xpNext) * 100));

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <aside className="sidebar flex flex-col w-56 min-h-screen shrink-0" style={{ fontFamily: 'inherit' }}>

      {/* Logo */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(120,80,255,0.12)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #6D4AE8 0%, #4F8EF7 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', fontWeight: 800, color: 'white',
            boxShadow: '0 4px 12px rgba(109,74,232,0.50)',
          }}>T</div>
          <div>
            <div style={{ fontWeight: 800, color: 'white', fontSize: '14px', lineHeight: 1 }}>TradeMaster</div>
            <div style={{ fontSize: '10px', marginTop: '2px', color: 'rgba(255,255,255,0.35)' }}>Pro · Simulator</div>
          </div>
        </div>
      </div>

      {/* User card */}
      <div style={{ padding: '12px', borderBottom: '1px solid rgba(120,80,255,0.10)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #6D4AE8, #4F8EF7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', fontWeight: 800, color: 'white',
            boxShadow: '0 3px 10px rgba(109,74,232,0.45)',
          }}>
            {user.name.slice(0, 1).toUpperCase()}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {authUser?.username ?? user.name}
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.38)' }}>
              Lvl {user.level} · {LEVEL_LABELS[user.userLevel]}
            </div>
          </div>
          {authUser && (
            <button
              onClick={handleSignOut}
              title="Abmelden"
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: 'rgba(255,255,255,0.28)', padding: '2px', flexShrink: 0 }}
            >
              ↪
            </button>
          )}
        </div>

        <div className="xp-bar" style={{ height: '4px', marginBottom: '4px' }}>
          <div className="xp-fill" style={{ height: '100%', width: `${xpPct}%` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'rgba(255,255,255,0.28)' }}>
          <span>{user.xp.toLocaleString('de')} XP</span>
          <span>+{user.xpToNextLevel} bis Lvl {user.level + 1}</span>
        </div>

        {!authUser && (
          <Link href="/register" style={{
            display: 'block', marginTop: '8px', padding: '7px 10px', borderRadius: '8px', textAlign: 'center',
            background: 'rgba(109,74,232,0.20)', border: '1px solid rgba(140,100,255,0.28)',
            fontSize: '11px', fontWeight: 700, color: '#C4B5FD', textDecoration: 'none',
          }}>
            ✨ Anmelden / Registrieren
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.10em', color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', padding: '8px 10px 5px' }}>
          Menü
        </div>
        {NAV.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link key={item.href} href={item.href} className={`nav-item ${active ? 'active' : ''}`}>
              <span style={{ fontSize: '15px', width: '20px', textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Stats footer */}
      <div style={{ padding: '12px', borderTop: '1px solid rgba(120,80,255,0.10)' }}>
        <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.10em', color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', marginBottom: '8px' }}>
          Statistiken
        </div>
        {[
          { label: 'Trades',   value: user.totalTrades },
          { label: 'Win-Rate', value: `${user.winRate}%` },
          { label: 'Streak',   value: `${user.streakDays}🔥` },
          { label: 'Erfolge',  value: `${user.achievements.filter(a => a.unlockedAt).length}/${user.achievements.length}` },
        ].map(s => (
          <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px 0' }}>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.32)' }}>{s.label}</span>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.62)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{s.value}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
