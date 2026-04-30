'use client';
import { useEffect, useState, useCallback } from 'react';
import Header from '@/components/layout/Header';
import { useAuthStore } from '@/store/authStore';
import { supabase, type Profile, type Friendship } from '@/lib/supabase';
import { fmt } from '@/lib/formatters';
import Link from 'next/link';

type FriendWithProfile = Friendship & { friend: Profile };

export default function FriendsPage() {
  const { user } = useAuthStore();

  const [search,       setSearch]       = useState('');
  const [searchResult, setSearchResult] = useState<Profile | null>(null);
  const [searching,    setSearching]    = useState(false);
  const [friends,      setFriends]      = useState<FriendWithProfile[]>([]);
  const [pending,      setPending]      = useState<FriendWithProfile[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [msg,          setMsg]          = useState('');

  const loadFriends = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await supabase
        .from('friendships')
        .select(`
          *,
          requester:profiles!friendships_requester_id_fkey(*),
          addressee:profiles!friendships_addressee_id_fkey(*)
        `)
        .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

      const all = (data ?? []).map(f => ({
        ...f,
        friend: f.requester_id === user.id ? f.addressee : f.requester,
      })) as FriendWithProfile[];

      setFriends(all.filter(f => f.status === 'accepted'));
      setPending(all.filter(f => f.status === 'pending' && f.addressee_id === user.id));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { loadFriends(); }, [loadFriends]);

  const handleSearch = async () => {
    if (!search.trim() || !user) return;
    setSearching(true);
    setSearchResult(null);
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .ilike('username', search.trim())
      .neq('id', user.id)
      .single();
    setSearchResult(data ?? null);
    setSearching(false);
  };

  const sendRequest = async (friendId: string) => {
    if (!user) return;
    const { error } = await supabase
      .from('friendships')
      .insert({ requester_id: user.id, addressee_id: friendId });
    if (error) { setMsg('Bereits eine Anfrage gesendet.'); }
    else { setMsg('Freundschaftsanfrage gesendet! ✅'); }
    setSearchResult(null);
    setSearch('');
    setTimeout(() => setMsg(''), 3000);
  };

  const acceptRequest = async (friendshipId: string) => {
    await supabase.from('friendships').update({ status: 'accepted' }).eq('id', friendshipId);
    loadFriends();
  };

  const declineRequest = async (friendshipId: string) => {
    await supabase.from('friendships').update({ status: 'declined' }).eq('id', friendshipId);
    loadFriends();
  };

  const removeFriend = async (friendshipId: string) => {
    await supabase.from('friendships').delete().eq('id', friendshipId);
    loadFriends();
  };

  if (!user) {
    return (
      <div style={{ minHeight: '100vh' }}>
        <Header title="Freunde" />
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '52px', marginBottom: '16px' }}>👥</div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '10px' }}>Freunde hinzufügen</h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.50)', marginBottom: '24px', lineHeight: 1.65 }}>
            Um Freunde hinzuzufügen und dich zu vergleichen, brauchst du ein kostenloses Konto.
          </p>
          <Link href="/register" className="btn-primary" style={{ textDecoration: 'none' }}>
            ✨ Kostenlos registrieren
          </Link>
          <div style={{ marginTop: '12px' }}>
            <Link href="/login" style={{ fontSize: '13px', color: '#A78BFA', textDecoration: 'none', fontWeight: 600 }}>
              Bereits ein Konto? Anmelden →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header title="Freunde" />
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '760px' }}>

        {/* Search */}
        <div className="card" style={{ padding: '18px 20px' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '14px' }}>🔍 Freund suchen</div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              className="glass-input"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Benutzername eingeben…"
              style={{ flex: 1 }}
            />
            <button className="btn-primary" onClick={handleSearch} disabled={searching} style={{ whiteSpace: 'nowrap' }}>
              {searching ? '…' : 'Suchen'}
            </button>
          </div>

          {msg && (
            <div style={{ marginTop: '12px', fontSize: '13px', color: '#6EE7B7', background: 'rgba(0,199,135,0.12)', border: '1px solid rgba(0,199,135,0.22)', borderRadius: '8px', padding: '10px 14px' }}>
              {msg}
            </div>
          )}

          {searchResult && (
            <div style={{
              marginTop: '14px', padding: '14px 16px', borderRadius: '12px',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(120,80,255,0.20)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
                }}>
                  {searchResult.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px' }}>{searchResult.username}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.42)', marginTop: '2px' }}>
                    Level {searchResult.level} · {searchResult.total_trades} Trades · {searchResult.win_rate.toFixed(0)}% Win-Rate
                  </div>
                </div>
              </div>
              <button className="btn-primary" onClick={() => sendRequest(searchResult.id)} style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
                + Hinzufügen
              </button>
            </div>
          )}

          {searchResult === null && search && !searching && (
            <div style={{ marginTop: '12px', fontSize: '13px', color: 'rgba(255,255,255,0.40)' }}>
              Kein Nutzer mit diesem Namen gefunden.
            </div>
          )}
        </div>

        {/* Pending requests */}
        {pending.length > 0 && (
          <div className="card">
            <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.07)', fontSize: '14px', fontWeight: 700 }}>
              📩 Freundschaftsanfragen ({pending.length})
            </div>
            {pending.map(f => (
              <div key={f.id} style={{
                padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(120,80,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                    {f.friend.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700 }}>{f.friend.username}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.40)' }}>möchte dein Freund sein</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button className="btn-primary" onClick={() => acceptRequest(f.id)} style={{ padding: '8px 14px', minHeight: '40px', fontSize: '13px' }}>
                    Annehmen
                  </button>
                  <button className="btn-ghost" onClick={() => declineRequest(f.id)} style={{ padding: '8px 14px', minHeight: '40px', fontSize: '13px' }}>
                    Ablehnen
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Friends list */}
        <div className="card">
          <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.07)', fontSize: '14px', fontWeight: 700 }}>
            👥 Freunde ({friends.length})
          </div>

          {loading ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'rgba(255,255,255,0.40)' }}>Lade…</div>
          ) : friends.length === 0 ? (
            <div style={{ padding: '36px', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>👥</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.60)', marginBottom: '6px' }}>Noch keine Freunde</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>Suche nach einem Benutzernamen und füge ihn hinzu!</div>
            </div>
          ) : (
            friends.map((f, i) => {
              const pnlUp = f.friend.total_pnl >= 0;
              return (
                <div key={f.id} style={{
                  padding: '14px 18px',
                  borderBottom: i < friends.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                      <div style={{
                        width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                        background: 'linear-gradient(135deg, rgba(109,74,232,0.35), rgba(79,142,247,0.35))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
                        border: '1px solid rgba(140,100,255,0.25)',
                      }}>
                        {f.friend.avatar}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '15px' }}>{f.friend.username}</div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.40)', marginTop: '2px' }}>
                          Level {f.friend.level} · 🔥{f.friend.streak_days} Streak · {f.friend.xp.toLocaleString('de')} XP
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFriend(f.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: 'rgba(255,255,255,0.28)', padding: '4px', flexShrink: 0 }}
                      title="Freund entfernen"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Comparison stats */}
                  <div style={{
                    marginTop: '12px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px',
                  }}>
                    {[
                      { label: 'Portfolio', value: fmt.currency(f.friend.portfolio_value), color: 'rgba(255,255,255,0.88)' },
                      { label: 'Gesamt P&L', value: fmt.currency(f.friend.total_pnl), color: pnlUp ? '#00C787' : '#F04E4E' },
                      { label: 'Win-Rate', value: `${f.friend.win_rate.toFixed(0)}%`, color: '#A78BFA' },
                      { label: 'Trades', value: String(f.friend.total_trades), color: 'rgba(255,255,255,0.70)' },
                    ].map(stat => (
                      <div key={stat.label} style={{
                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '8px', padding: '8px 10px', textAlign: 'center',
                      }}>
                        <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                          {stat.label}
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: stat.color, fontVariantNumeric: 'tabular-nums' }}>
                          {stat.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
