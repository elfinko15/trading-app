'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/dashboard',   icon: '🏠', label: 'Home' },
  { href: '/trading',     icon: '📈', label: 'Trading' },
  { href: '/portfolio',   icon: '💼', label: 'Portfolio' },
  { href: '/leaderboard', icon: '🏆', label: 'Ranking' },
  { href: '/friends',     icon: '👥', label: 'Freunde' },
  { href: '/settings',    icon: '⚙️', label: 'Settings' },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="bottom-nav">
      {NAV.map(item => {
        const active = pathname === item.href || pathname.startsWith(item.href + '/');
        return (
          <Link key={item.href} href={item.href} className={`bottom-nav-item ${active ? 'active' : ''}`}>
            <span style={{ fontSize: '20px', lineHeight: 1 }}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
