'use client';
import { useEffect, useState, useCallback } from 'react';
import Header from '@/components/layout/Header';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { usePortfolioStore } from '@/store/portfolioStore';
import { supabase, type Profile } from '@/lib/supabase';
import { fmt } from '@/lib/formatters';

const MEDAL = ['🥇', '🥈', '🥉'];

const TABS = ['Global', 'Freunde'] as const;
type Tab = typeof TABS[number];

export default function LeaderboardPage() {
  const { user }      = useAuthStore();
  const { user: me }  = useUserStore();
  const { portfolio } = usePortfolioStore();

  const [tab,      setTab]      = useState<Tab>('Global');
  const [entries,  setEntries]  = useState<Profile[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [myRank,   setMyRank]   = useState<number | null>(null);

  const loadLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      let q = supabase
        .from('profiles')
        .select('*')
        .order('portfolio_value', { ascending: false })
        .limit(50);

      if (tab === 'Freunde' && user) {
        const { data: friendships } = await supabase
          .from('friendships')
          .select('requester_id, addressee_id')
          .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
          .eq('status', 'accepted');
        const friendIds = (friendships ?? []).map(f =>
          f.requester_id === user.id ? f.addressee_id : f.requester_id
        );
        if (friendIds.length === 0) { setEntries([]); setLoading(false); return; }
        q = q.in('id', [...friendIds, user.id]);
      }

      const { data } = await q;
      setEntries(data ?? []);

      if (user && data) {
        const rank = data.findIndex(p => p.id === user.id);
        setMyRank(rank >= 0 ? rank + 1 : null);
      }
    } finally {
      setLoading(false);
    }
  }, [tab, user]);

  useEffect(() => { loadLeaderboard(); }, [loadLeaderboard]);

  // Local fallback entry (when not logged in)
  const localEntry: Profile = {
    id: 'local',
    username: me.name,
    avatar: me.avatar,
    level: me.level,
    xp: me.xp,
    total_trades: me.totalTrades,
    win_rate: me.winRate,
    streak_days: me.streakDays,
    portfolio_value: portfolio.totalValue,
    total_pnl: portfolio.totalPnL,
    total_pnl_pct: portfolio.totalPnLPct,
    created_at: new Date(me.joinedAt).toISOString(),
  };

  const displayEntries = entries.length > 0 ? entries : (user ? [] : [localEntry]);

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header title="Bestenliste" />
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '860px' }}>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '10px 22px', minHeight: '44px', borderRadius: '10px', fontSize: '14px', fontWeight: 700,
                border: 'none', borderWidth: '1px', borderStyle: 'solid', cursor: 'pointer', transition: 'all 0.15s',
                borderColor: tab === t ? 'rgba(140,100,255,0.55)' : 'rgba(255,255,255,0.10)',
                background: tab === t ? 'rgba(109,74,232,0.22)' : 'rgba(255,255,255,0.05)',
                color: tab === t ? '#C4B5FD' : 'rgba(255,255,255,0.55)',
              }}
            >
              {t === 'Global' ? '🌍 Global' : '👥 Freunde'}
            </button>
          ))}

          <div style={{ flex: 1 }} />

          {!user && (
            <a href="/register" style={{
              padding: '10px 18px', minHeight: '44px', borderRadius: '10px', fontSize: '13px', fontWeight: 700,
              background: 'linear-gradient(135deg, #6D4AE8, #4F8EF7)', color: '#fff',
              textDecoration: 'none', display: 'flex', alignItems: 'center',
              boxShadow: '0 4px 14px rgba(109,74,232,0.35)',
            }}>
              ✨ Anmelden & mitmachen
            </a>
          )}
        </div>

        {/* My rank card */}
        {user && myRank && (
          <div style={{
            background: 'rgba(109,74,232,0.18)', border: '1px solid rgba(140,100,255,0.35)',
            borderRadius: '14px', padding: '14px 20px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.42)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>Dein Rang</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#A78BFA' }}>#{myRank}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', fontWeight: 700 }}>{user.username}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>
                {fmt.currency(portfolio.totalValue)} Portfolio
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard table */}
        <div className="card">
          <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 700 }}>
              {tab === 'Global' ? '🌍 Globale Bestenliste' : '👥 Freunde-Ranking'}
            </span>
            <button
              onClick={loadLeaderboard}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#A78BFA', fontWeight: 600 }}
            >
              🔄 Aktualisieren
            </button>
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.40)' }}>
              Lade Bestenliste…
            </div>
          ) : displayEntries.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>
                {tab === 'Freunde' ? '👥' : '🌍'}
              </div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'rgba(255,255,255,0.70)', marginBottom: '6px' }}>
                {tab === 'Freunde' ? 'Noch keine Freunde' : 'Keine Einträge'}
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.38)' }}>
                {tab === 'Freunde'
                  ? 'Gehe zu "Freunde" um andere Trader hinzuzufügen.'
                  : 'Sei der Erste auf der Bestenliste!'}
              </div>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>Rang</th>
                  <th>Trader</th>
                  <th className="hide-mobile">Level</th>
                  <th style={{ textAlign: 'right' }}>Portfolio</th>
                  <th style={{ textAlign: 'right' }}>P&L</th>
                  <th className="hide-mobile" style={{ textAlign: 'right' }}>Win-Rate</th>
                  <th className="hide-mobile" style={{ textAlign: 'right' }}>Trades</th>
                </tr>
              </thead>
              <tbody>
                {displayEntries.map((p, i) => {
                  const isMe = user ? p.id === user.id : p.id === 'local';
                  const pnlUp = p.total_pnl >= 0;
                  return (
                    <tr key={p.id} style={{ background: isMe ? 'rgba(109,74,232,0.10)' : undefined }}>
                      <td style={{ textAlign: 'center' }}>
                        {i < 3
                          ? <span style={{ fontSize: '18px' }}>{MEDAL[i]}</span>
                          : <span style={{ fontSize: '14px', fontWeight: 700, color: 'rgba(255,255,255,0.50)' }}>#{i + 1}</span>}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
                            background: isMe ? 'linear-gradient(135deg, #6D4AE8, #4F8EF7)' : 'rgba(120,80,255,0.18)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '16px',
                          }}>
                            {p.avatar}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '14px' }}>
                              {p.username}
                              {isMe && <span style={{ marginLeft: '6px', fontSize: '11px', color: '#A78BFA', fontWeight: 600 }}>(Du)</span>}
                            </div>
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.38)', marginTop: '1px' }}>
                              🔥 {p.streak_days} Tage Streak
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="hide-mobile">
                        <span style={{
                          display: 'inline-block', padding: '3px 9px', borderRadius: '6px',
                          background: 'rgba(120,80,255,0.18)', color: '#C4B5FD', fontSize: '12px', fontWeight: 700,
                        }}>
                          Lvl {p.level}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 700, fontVariantNumeric: 'tabular-nums', fontSize: '14px' }}>
                        {fmt.currency(p.portfolio_value)}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className={pnlUp ? 'badge-up' : 'badge-down'}>
                          {pnlUp ? '+' : ''}{fmt.currency(p.total_pnl)}
                        </span>
                      </td>
                      <td className="hide-mobile" style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
                        {p.win_rate.toFixed(0)}%
                      </td>
                      <td className="hide-mobile" style={{ textAlign: 'right', color: 'rgba(255,255,255,0.55)', fontVariantNumeric: 'tabular-nums' }}>
                        {p.total_trades}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {!user && (
          <div style={{
            padding: '18px 20px', borderRadius: '14px',
            background: 'rgba(109,74,232,0.12)', border: '1px solid rgba(120,80,255,0.22)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>
              🏆 Möchtest du in der Bestenliste erscheinen?
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.50)', marginBottom: '14px' }}>
              Erstelle ein kostenloses Konto und konkurriere mit anderen Tradern!
            </div>
            <a href="/register" className="btn-primary" style={{ textDecoration: 'none' }}>
              ✨ Kostenlos registrieren
            </a>
          </div>
        )}

      </div>
    </div>
  );
}
