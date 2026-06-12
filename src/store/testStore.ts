import { create } from 'zustand';
import type { Test } from '../types/test';
import type { Question } from '../types/question';

interface TestState {
  tests: Test[];
  currentTest: Test | null;
  questions: Question[];
  setTests: (tests: Test[]) => void;
  setCurrentTest: (test: Test | null) => void;
  addTest: (test: Test) => void;
  updateTest: (id: string, test: Partial<Test>) => void;
  deleteTest: (id: string) => void;
  setQuestions: (questions: Question[]) => void;
  addQuestion: (question: Question) => void;
  updateQuestion: (id: string, question: Partial<Question>) => void;
  removeQuestion: (id: string) => void;
}

export const useTestStore = create<TestState>((set) => ({
  tests: [],
  currentTest: null,
  questions: [],
  setTests: (tests) => {
    console.log("setTests called with:", tests);
    set({ tests });
  },
  setCurrentTest: (test) => {
    console.log("setCurrentTest called with:", test);
    set({ currentTest: test });
  },
  addTest: (test) => {
    console.log("addTest called with:", test);
    set((state) => ({ tests: [...state.tests, test] }));
  },
  updateTest: (id, updatedTest) => {
    console.log("updateTest called with id:", id, "data:", updatedTest);
    set((state) => ({
      tests: state.tests.map((test) =>
        test.id === id ? { ...test, ...updatedTest } : test
      ),
    }));
  },
  deleteTest: (id) => {
    console.log("deleteTest called with id:", id);
    set((state) => ({
      tests: state.tests.filter((test) => test.id !== id),
    }));
  },
  setQuestions: (questions) => {
    console.log("setQuestions called with:", questions);
    set({ questions });
  },
  addQuestion: (question) => {
    console.log("addQuestion called with:", question);
    set((state) => ({ questions: [...state.questions, question] }));
  },
  updateQuestion: (id, updatedQuestion) =>
    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === id ? { ...q, ...updatedQuestion } : q
      ),
    })),
  removeQuestion: (id) =>
    set((state) => ({
      questions: state.questions.filter((q) => q.id !== id),
    })),
}));
