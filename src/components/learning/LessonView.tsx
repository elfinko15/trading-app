'use client';
import { useState } from 'react';
import type { Lesson, Module } from '@/domain/models';
import { useLearningStore } from '@/store/learningStore';
import { useUserStore } from '@/store/userStore';

interface Props {
  lesson: Lesson;
  module: Module;
  onClose: () => void;
}

export default function LessonView({ lesson, module, onClose }: Props) {
  const { completeLesson: markDone, submitQuizAnswer, quizAnswers, resetQuiz } = useLearningStore();
  const { completeLesson: markUser, addXP } = useUserStore();

  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore]         = useState(0);

  const handleComplete = () => {
    markDone(module.id, lesson.id);
    markUser(lesson.id);
    addXP(lesson.xpReward);
    onClose();
  };

  const handleQuizSubmit = () => {
    if (!lesson.questions) return;
    const correct = lesson.questions.filter((q, i) => quizAnswers[i] === q.correctIndex).length;
    setQuizScore(correct);
    setQuizSubmitted(true);
    if (correct === lesson.questions.length) {
      markDone(module.id, lesson.id);
      markUser(lesson.id);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
      background: 'rgba(10,22,40,0.7)', backdropFilter: 'blur(6px)',
    }}>
      <div style={{
        background: 'var(--surface-white)',
        border: '1px solid var(--surface-border)',
        borderRadius: '10px',
        maxWidth: '680px', width: '100%',
        maxHeight: '88vh', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
      }}>
        {/* Header */}
        <div style={{
          padding: '14px 18px',
          borderBottom: '1px solid var(--surface-border)',
          background: 'var(--surface-subtle)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '3px' }}>
              {module.title}
            </div>
            <h2 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{lesson.title}</h2>
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>⏱ {lesson.duration} Min.</span>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#F59E0B' }}>+{lesson.xpReward} XP</span>
              <span className="badge-neutral" style={{ fontSize: '10px' }}>{lesson.type}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: 'var(--text-muted)', lineHeight: 1, padding: '2px' }}>✕</button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px' }}>
          {lesson.type === 'theory' && (
            <div style={{ lineHeight: 1.7, color: 'var(--text-secondary)', fontSize: '13px' }}>
              {lesson.content.split('\n').map((line, i) => {
                if (line.startsWith('# '))  return <h1 key={i} style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 12px' }}>{line.slice(2)}</h1>;
                if (line.startsWith('## ')) return <h2 key={i} style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: '16px 0 6px', paddingBottom: '4px', borderBottom: '1px solid var(--surface-border)' }}>{line.slice(3)}</h2>;
                if (line.startsWith('```')) return null;
                if (line.startsWith('- ')) return <li key={i} style={{ marginLeft: '16px', marginBottom: '3px', color: 'var(--text-secondary)' }}>{line.slice(2)}</li>;
                if (line.trim() === '') return <div key={i} style={{ height: '6px' }} />;
                const parts = line.split(/\*\*(.*?)\*\*/g);
                return (
                  <p key={i} style={{ margin: '0 0 6px' }}>
                    {parts.map((p, j) => j % 2 === 1 ? <strong key={j} style={{ color: 'var(--text-primary)' }}>{p}</strong> : p)}
                  </p>
                );
              })}
            </div>
          )}

          {lesson.type === 'quiz' && lesson.questions && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {lesson.questions.map((q, qi) => (
                <div key={qi} style={{ padding: '14px', background: 'var(--surface-subtle)', borderRadius: '8px', border: '1px solid var(--surface-border)' }}>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 10px' }}>
                    {qi + 1}. {q.question}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {q.options.map((opt, oi) => {
                      const selected = quizAnswers[qi] === oi;
                      const correct  = q.correctIndex === oi;
                      let bg = 'var(--surface-white)';
                      let border = 'var(--surface-border)';
                      let color = 'var(--text-secondary)';
                      if (quizSubmitted && correct) { bg = 'var(--green-bg)'; border = '#6EE7B7'; color = 'var(--green-text)'; }
                      if (quizSubmitted && selected && !correct) { bg = 'var(--red-bg)'; border = '#FCA5A5'; color = 'var(--red-text)'; }
                      if (!quizSubmitted && selected) { bg = 'var(--blue-50)'; border = 'var(--blue-300)'; color = 'var(--blue-500)'; }

                      return (
                        <button
                          key={oi}
                          disabled={quizSubmitted}
                          onClick={() => !quizSubmitted && submitQuizAnswer(qi, oi)}
                          style={{
                            padding: '9px 12px', borderRadius: '6px',
                            border: `1px solid ${border}`, background: bg, color,
                            fontSize: '12px', textAlign: 'left', cursor: quizSubmitted ? 'default' : 'pointer',
                            transition: 'all 0.12s', fontWeight: selected ? 600 : 400,
                          }}
                        >
                          <span style={{ fontWeight: 700, marginRight: '6px' }}>{String.fromCharCode(65 + oi)}.</span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {quizSubmitted && (
                    <div style={{ marginTop: '10px', padding: '8px 12px', background: '#EFF6FF', border: '1px solid var(--blue-200)', borderRadius: '6px', fontSize: '11px', color: 'var(--blue-500)' }}>
                      💡 {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {quizSubmitted && lesson.questions && (
            <div style={{
              marginTop: '16px', padding: '14px', borderRadius: '8px', textAlign: 'center',
              background: quizScore === lesson.questions.length ? 'var(--green-bg)' : '#FFF7ED',
              border: `1px solid ${quizScore === lesson.questions.length ? '#6EE7B7' : '#FCD34D'}`,
            }}>
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>{quizScore === lesson.questions.length ? '🎉' : '📖'}</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {quizScore}/{lesson.questions.length} richtig
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {quizScore === lesson.questions.length ? `Perfekt! +${lesson.xpReward} XP gutgeschrieben` : 'Lies die Erklärungen und versuche es erneut'}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 18px', borderTop: '1px solid var(--surface-border)', display: 'flex', gap: '10px', background: 'var(--surface-subtle)' }}>
          <button onClick={onClose} className="btn-ghost" style={{ flex: '0 0 auto' }}>Zurück</button>
          {lesson.type === 'quiz' && !quizSubmitted ? (
            <button
              onClick={handleQuizSubmit}
              disabled={Object.keys(quizAnswers).length < (lesson.questions?.length ?? 0)}
              className="btn-primary"
              style={{ flex: 1, opacity: Object.keys(quizAnswers).length < (lesson.questions?.length ?? 0) ? 0.4 : 1 }}
            >
              Antworten auswerten
            </button>
          ) : (
            <button onClick={handleComplete} className="btn-primary" style={{ flex: 1 }}>
              ✓ Abschließen · +{lesson.xpReward} XP
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
