export interface Test {
  id: string;
  name: string;
  subject: string;
  topics: string[];
  status: 'draft' | 'live';
  created_at: string;
  type?: string;
  sub_topics?: string[];
  correct_marks?: number;
  wrong_marks?: number;
  unattempt_marks?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  total_time?: number;
  total_marks?: number;
  total_questions?: number;
  questions?: string[];
}

export interface CreateTestInput {
  name: string;
  type: string;
  subject: string;
  topics: string[];
  sub_topics: string[];
  correct_marks: number;
  wrong_marks: number;
  unattempt_marks: number;
  difficulty: 'easy' | 'medium' | 'hard';
  total_time: number;
  total_marks: number;
  total_questions: number;
  status?: null | 'draft' | 'live';
}
