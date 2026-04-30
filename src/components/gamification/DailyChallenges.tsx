'use client';
import { useUserStore } from '@/store/userStore';

const TYPE_ICONS = { analyze: '🔍', trade: '💹', learn: '📖' };
const TYPE_LABELS = { analyze: 'Analyse', trade: 'Trade', learn: 'Lernen' };

export default function DailyChallenges() {
  const { user } = useUserStore();

  return (
    <div className="card">
      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>Daily Challenges</span>
        <span style={{ fontSize: '11px', color: '#F59E0B', fontWeight: 700 }}>🔥 {user.streakDays} Tage</span>
      </div>

      <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {user.dailyChallenges.map(ch => {
          const pct = Math.min(100, (ch.progress / ch.target) * 100);
          return (
            <div key={ch.id} style={{
              padding: '10px 12px',
              borderRadius: '6px',
              border: `1px solid ${ch.completed ? '#6EE7B7' : 'var(--surface-border)'}`,
              background: ch.completed ? 'var(--green-bg)' : 'var(--surface-subtle)',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ fontSize: '14px', flexShrink: 0, marginTop: '1px' }}>{TYPE_ICONS[ch.type]}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>{ch.title}</span>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: '#F59E0B' }}>+{ch.xpReward} XP</span>
                  </div>
                  <p style={{ fontSize: '10px', color: 'var(--text-muted)', margin: '0 0 6px' }}>{ch.description}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ flex: 1, height: '4px', background: 'var(--surface-border)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${pct}%`, height: '100%', borderRadius: '2px', transition: 'width 0.4s ease',
                        background: ch.completed ? 'var(--green)' : 'var(--blue-400)',
                      }} />
                    </div>
                    <span style={{ fontSize: '9px', color: 'var(--text-faint)', flexShrink: 0 }}>{ch.progress}/{ch.target}</span>
                    {ch.completed && <span style={{ fontSize: '12px' }}>✓</span>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
