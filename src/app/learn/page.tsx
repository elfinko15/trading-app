'use client';
import { useState } from 'react';
import type { Module } from '@/domain/models';
import { useLearningStore } from '@/store/learningStore';
import Header from '@/components/layout/Header';
import ModuleCard from '@/components/learning/ModuleCard';
import LessonView from '@/components/learning/LessonView';
import DailyChallenges from '@/components/gamification/DailyChallenges';
import { useUserStore } from '@/store/userStore';

export default function LearnPage() {
  const { modules, setActiveModule, resetQuiz } = useLearningStore();
  const { user } = useUserStore();

  const [selectedModule,   setSelectedModule]   = useState<Module | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  const lesson       = selectedModule?.lessons.find(l => l.id === selectedLessonId) ?? null;
  const totalLessons = modules.reduce((s, m) => s + m.lessons.length, 0);
  const completed    = user.completedLessons.length;
  const progress     = Math.round((completed / totalLessons) * 100);

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header title="Lernen" />

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Progress bar */}
        <div className="card" style={{ padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div>
              <span style={{ fontSize: '14px', fontWeight: 700 }}>Lernfortschritt</span>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginLeft: '8px' }}>
                {completed}/{totalLessons} Lektionen abgeschlossen
              </span>
            </div>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#A78BFA' }}>{progress}%</span>
          </div>
          <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              width: `${progress}%`, height: '100%',
              background: 'linear-gradient(90deg, #818CF8, #6D4AE8)',
              borderRadius: '4px', transition: 'width 0.6s ease',
            }} />
          </div>
        </div>

        <div className="grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '16px', alignItems: 'start' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {selectedModule ? (
              <>
                <button
                  onClick={() => setSelectedModule(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#A78BFA', textAlign: 'left', padding: '0 0 4px', fontWeight: 600 }}
                >
                  ← Alle Module
                </button>
                <div className="card">
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '22px' }}>{selectedModule.icon}</span>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700 }}>{selectedModule.title}</div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>{selectedModule.description}</div>
                    </div>
                  </div>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Lektion</th>
                        <th>Typ</th>
                        <th style={{ textAlign: 'right' }}>Dauer</th>
                        <th style={{ textAlign: 'right' }}>XP</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedModule.lessons.map((les, idx) => {
                        const done = user.completedLessons.includes(les.id);
                        return (
                          <tr key={les.id} style={{ cursor: 'pointer' }}
                            onClick={() => { resetQuiz(); setSelectedLessonId(les.id); }}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{
                                  width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                                  background: done ? 'rgba(0,199,135,0.18)' : 'rgba(109,74,232,0.18)',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontSize: '10px', fontWeight: 700,
                                  color: done ? '#00C787' : '#A78BFA',
                                }}>
                                  {done ? '✓' : idx + 1}
                                </div>
                                <span style={{ fontWeight: 600 }}>{les.title}</span>
                              </div>
                            </td>
                            <td><span className="badge-neutral" style={{ fontSize: '10px' }}>{les.type}</span></td>
                            <td style={{ textAlign: 'right', color: 'rgba(255,255,255,0.45)' }}>{les.duration} Min.</td>
                            <td style={{ textAlign: 'right', color: '#F59E0B', fontWeight: 700 }}>+{les.xpReward}</td>
                            <td>
                              {done
                                ? <span className="badge-up" style={{ fontSize: '10px' }}>Abgeschlossen</span>
                                : <span className="badge-neutral" style={{ fontSize: '10px' }}>Ausstehend</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              modules.map(mod => (
                <ModuleCard
                  key={mod.id}
                  module={mod}
                  onClick={() => { setSelectedModule(mod); setActiveModule(mod.id); }}
                />
              ))
            )}
          </div>

          <DailyChallenges />
        </div>
      </div>

      {selectedModule && lesson && (
        <LessonView
          lesson={lesson}
          module={selectedModule}
          onClose={() => { setSelectedLessonId(null); resetQuiz(); }}
        />
      )}
    </div>
  );
}
