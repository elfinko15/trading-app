'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Module } from '@/domain/models';
import { CURRICULUM } from '@/data/curriculum';

interface LearningState {
  modules: Module[];
  activeModule: string | null;
  activeLesson: string | null;
  quizAnswers: Record<string, number>;
  setActiveModule: (id: string | null) => void;
  setActiveLesson: (id: string | null) => void;
  completeLesson: (moduleId: string, lessonId: string) => void;
  submitQuizAnswer: (questionIndex: number, answerIndex: number) => void;
  resetQuiz: () => void;
}

export const useLearningStore = create<LearningState>()(
  persist(
    (set) => ({
      modules: CURRICULUM,
      activeModule: null,
      activeLesson: null,
      quizAnswers: {},

      setActiveModule: (id) => set({ activeModule: id, activeLesson: null }),
      setActiveLesson: (id) => set({ activeLesson: id }),

      completeLesson: (moduleId, lessonId) => set(state => {
        const modules = state.modules.map(mod => {
          if (mod.id !== moduleId) return mod;
          const lessons = mod.lessons.map(l =>
            l.id === lessonId ? { ...l, completed: true } : l,
          );
          const completedCount = lessons.filter(l => l.completed).length;
          const progress       = Math.round((completedCount / lessons.length) * 100);
          const completed      = completedCount === lessons.length;
          return { ...mod, lessons, progress, completed };
        });
        return { modules };
      }),

      submitQuizAnswer: (qi, ai) => set(state => ({
        quizAnswers: { ...state.quizAnswers, [qi]: ai },
      })),

      resetQuiz: () => set({ quizAnswers: {} }),
    }),
    { name: 'trademaster-learning' },
  ),
);
