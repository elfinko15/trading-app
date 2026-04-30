'use client';
import type { Module } from '@/domain/models';
import { useUserStore } from '@/store/userStore';

interface Props {
  module: Module;
  onClick: () => void;
}

export default function ModuleCard({ module, onClick }: Props) {
  const { user } = useUserStore();
  const locked   = user.level < module.requiredLevel;

  return (
    <button
      onClick={locked ? undefined : onClick}
      disabled={locked}
      style={{
        width: '100%', textAlign: 'left', cursor: locked ? 'not-allowed' : 'pointer',
        background: 'var(--surface-white)', border: '1px solid var(--surface-border)',
        borderLeft: locked ? `3px solid var(--surface-divider)` : `3px solid var(--blue-500)`,
        borderRadius: '8px', padding: '14px 16px',
        opacity: locked ? 0.5 : 1,
        transition: 'box-shadow 0.15s ease, transform 0.15s ease',
        display: 'block',
      }}
      onMouseEnter={e => { if (!locked) { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <span style={{ fontSize: '24px', lineHeight: 1, flexShrink: 0 }}>{module.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{module.title}</span>
            {module.completed && (
              <span className="badge-up" style={{ fontSize: '10px' }}>✓ Abgeschlossen</span>
            )}
            {locked && (
              <span className="badge-neutral" style={{ fontSize: '10px' }}>🔒 Ab Level {module.requiredLevel}</span>
            )}
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 10px' }}>{module.description}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ flex: 1, height: '5px', background: 'var(--blue-100)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                width: `${module.progress}%`, height: '100%',
                background: 'linear-gradient(90deg, var(--blue-400), var(--blue-300))',
                borderRadius: '3px', transition: 'width 0.5s ease',
              }} />
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              {module.lessons.filter(l => l.completed).length}/{module.lessons.length} Lektionen
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
