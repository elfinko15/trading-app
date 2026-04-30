'use client';
import { useUserStore } from '@/store/userStore';
import { fmt } from '@/lib/formatters';

export default function AchievementsPanel() {
  const { user } = useUserStore();
  const unlocked = user.achievements.filter(a => a.unlockedAt);
  const locked   = user.achievements.filter(a => !a.unlockedAt);

  return (
    <div className="card">
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Achievements</span>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{unlocked.length}/{user.achievements.length}</span>
      </div>

      <div style={{ padding: '12px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
        {[...unlocked, ...locked].map(ach => {
          const done = !!ach.unlockedAt;
          return (
            <div key={ach.id} style={{
              display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '10px',
              borderRadius: '6px',
              border: `1px solid ${done ? '#FCD34D' : 'var(--surface-border)'}`,
              background: done ? '#FFFBEB' : 'var(--surface-subtle)',
              opacity: done ? 1 : 0.5,
              filter: done ? 'none' : 'grayscale(0.5)',
              transition: 'all 0.2s',
            }}>
              <span style={{ fontSize: '20px', flexShrink: 0 }}>{ach.icon}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1px' }}>{ach.title}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', lineHeight: 1.4 }}>{ach.description}</div>
                {done ? (
                  <div style={{ fontSize: '10px', color: '#92400E', fontWeight: 600, marginTop: '3px' }}>
                    +{ach.xpReward} XP · {fmt.date(ach.unlockedAt!)}
                  </div>
                ) : ach.target && ach.progress !== undefined ? (
                  <div style={{ marginTop: '4px' }}>
                    <div style={{ height: '3px', background: 'var(--surface-border)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: `${(ach.progress / ach.target) * 100}%`, height: '100%', background: 'var(--blue-400)' }} />
                    </div>
                    <div style={{ fontSize: '9px', color: 'var(--text-faint)', marginTop: '2px' }}>{ach.progress}/{ach.target}</div>
                  </div>
                ) : (
                  <div style={{ fontSize: '10px', color: 'var(--text-faint)', marginTop: '2px' }}>+{ach.xpReward} XP</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
