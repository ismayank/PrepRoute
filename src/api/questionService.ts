import api from './axiosClient';

const mockQuestions: any[] = [
  {
    id: "q1",
    type: "mcq",
    question: "What is 2 + 2?",
    option1: "3",
    option2: "4",
    option3: "5",
    option4: "6",
    correct_option: "option2",
    explanation: "Basic addition",
    difficulty: "easy",
    test_id: "test-1",
  }
];

export const questionService = {
  getQuestionsByTestId: async (testId: string) => {
    try {
      const response = await api.get(`/tests/${testId}/questions`);
      return response.data;
    } catch (error) {
      console.log("Falling back to mock questions");
      return {
        success: true,
        data: mockQuestions.filter(q => q.test_id === testId),
      };
    }
  },
  createQuestion: async (testId: string, data: any) => {
    try {
      const response = await api.post(`/tests/${testId}/questions`, data);
      return response.data;
    } catch (error) {
      console.log("Falling back to mock create question");
      const newQuestion = {
        id: `q-${Date.now()}`,
        ...data,
        test_id: testId,
      };
      mockQuestions.push(newQuestion);
      return {
        success: true,
        data: newQuestion,
      };
    }
  },
  updateQuestion: async (questionId: string, data: any) => {
    try {
      const response = await api.put(`/questions/${questionId}`, data);
      return response.data;
    } catch (error) {
      console.log("Falling back to mock update question");
      const index = mockQuestions.findIndex(q => q.id === questionId);
      if (index !== -1) {
        mockQuestions[index] = { ...mockQuestions[index], ...data };
        return {
          success: true,
          data: mockQuestions[index],
        };
      }
      throw new Error("Question not found");
    }
  },
  deleteQuestion: async (questionId: string) => {
    try {
      const response = await api.delete(`/questions/${questionId}`);
      return response.data;
    } catch (error) {
      console.log("Falling back to mock delete question");
      const index = mockQuestions.findIndex(q => q.id === questionId);
      if (index !== -1) {
        mockQuestions.splice(index, 1);
      }
      return {
        success: true,
      };
    }
  },
  bulkCreateQuestions: async (questions: any[]) => {
    try {
      const response = await api.post('/questions/bulk', { questions });
      return response.data;
    } catch (error) {
      console.log("Falling back to mock bulk create questions");
      const newQuestions = questions.map(q => ({
        id: `q-${Date.now()}-${Math.random()}`,
        ...q,
      }));
      mockQuestions.push(...newQuestions);
      return {
        success: true,
        data: newQuestions,
        message: `Successfully created ${questions.length} questions`,
      };
    }
  },
  fetchBulkQuestions: async (questionIds: string[]) => {
    try {
      const response = await api.post('/questions/fetchBulk', { question_ids: questionIds });
      return response.data;
    } catch (error) {
      console.log("Falling back to mock fetch bulk questions");
      return {
        success: true,
        data: mockQuestions.filter(q => questionIds.includes(q.id)),
      };
    }
  },
};
