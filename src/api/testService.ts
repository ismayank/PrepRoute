import api from "./axiosClient";

// Mock data
const mockSubjects = {
  success: true,
  data: [
    { id: "1", name: "Mathematics" },
    { id: "2", name: "Physics" },
    { id: "3", name: "Chemistry" },
    { id: "4", name: "Biology" },
  ],
};

const mockTopics = {
  success: true,
  data: [
    { id: "t1", name: "Algebra", subjectId: "1" },
    { id: "t2", name: "Calculus", subjectId: "1" },
    { id: "t3", name: "Newtonian Mechanics", subjectId: "2" },
  ],
};

const mockSubTopics = {
  success: true,
  data: [
    { id: "st1", name: "Linear Equations", topicId: "t1" },
    { id: "st2", name: "Quadratic Equations", topicId: "t1" },
  ],
};

let mockTests = {
  success: true,
  data: [
    {
      id: "test1",
      name: "Sample Test 1",
      subject: "Mathematics",
      topics: ["Algebra"],
      status: "draft",
      createdAt: "2025-01-15T10:00:00Z",
    },
    {
      id: "test2",
      name: "Physics Quiz",
      subject: "Physics",
      topics: ["Newtonian Mechanics"],
      status: "live",
      createdAt: "2025-01-20T14:30:00Z",
    },
  ],
};

export const testService = {
  getAllTests: async () => {
    try {
      const response = await api.get("/tests");
      console.log("Using API tests, response:", response.data);
      return response.data;
    } catch (error) {
      console.log("Falling back to mock tests, error:", error);
      console.log("Returning mockTests data:", mockTests.data);
      return mockTests;
    }
  },
  getTestById: async (id: string) => {
    try {
      const response = await api.get(`/tests/${id}`);
      return response.data;
    } catch (error) {
      console.log("Falling back to mock test");
      return {
        success: true,
        data: {
          id: id,
          name: "Mock Test",
          subject: "1", // Using ID instead of name
          topics: ["t1"],
          status: "draft",
          type: "practice",
          sub_topics: ["st1"],
          correct_marks: 4,
          wrong_marks: -1,
          unattempt_marks: 0,
          difficulty: "medium",
          total_time: 60,
          total_marks: 100,
          total_questions: 25,
        }
      };
    }
  },
  createTest: async (data: any) => {
    try {
      console.group("🟡 Create Test API Call");
      console.log("Request URL:", "/tests");
      console.log("Request Method:", "POST");
      console.log("Request Data:", data);
      console.log("Request Data (stringified):", JSON.stringify(data, null, 2));
      console.groupEnd();
      const response = await api.post("/tests", data);
      console.log("API create test response:", response.data);
      return response.data;
    } catch (error) {
      console.group("🔴 Create Test API Error");
      console.error("Create Test Error Details:", error);
      console.groupEnd();
      console.log("Falling back to mock create test");
      const newTest = {
        id: `test-${Date.now()}`,
        ...data,
        status: data.status || "draft",
        createdAt: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };
      mockTests.data.push(newTest);
      console.log("Updated mockTests after create:", mockTests.data);
      return {
        success: true,
        data: newTest,
        message: "Test created successfully"
      };
    }
  },
  updateTest: async (id: string, data: any) => {
    try {
      const response = await api.put(`/tests/${id}`, data);
      return response.data;
    } catch (error) {
      console.log("Falling back to mock update test");
      const testIndex = mockTests.data.findIndex(t => t.id === id);
      if (testIndex !== -1) {
        mockTests.data[testIndex] = {
          ...mockTests.data[testIndex],
          ...data
        };
        return {
          success: true,
          data: mockTests.data[testIndex],
          message: "Test updated successfully"
        };
      }
      return {
        success: true,
        data: { id, ...data },
        message: "Test updated successfully"
      };
    }
  },
  deleteTest: async (id: string) => {
    try {
      const response = await api.delete(`/tests/${id}`);
      return response.data;
    } catch (error) {
      console.log("Falling back to mock delete test");
      mockTests.data = mockTests.data.filter(test => test.id !== id);
      return {
        success: true,
        message: "Test deleted successfully"
      };
    }
  },
  publishTest: async (id: string) => {
    try {
      const response = await api.put(`/tests/${id}`, { status: "live" });
      console.log("API publish test response:", response.data);
      return response.data;
    } catch (error) {
      console.log("Falling back to mock publish test");
      // Update mock test status to live
      const testIndex = mockTests.data.findIndex(t => t.id === id);
      if (testIndex !== -1) {
        mockTests.data[testIndex] = {
          ...mockTests.data[testIndex],
          status: "live"
        };
      }
      console.log("Updated mockTests after publish:", mockTests.data);
      return {
        success: true,
        message: "Test published successfully"
      };
    }
  },
};

export const subjectService = {
  getAllSubjects: async () => {
    try {
      const response = await api.get("/subjects");
      return response.data;
    } catch (error) {
      console.log("Falling back to mock subjects");
      return mockSubjects;
    }
  },
};

export const topicService = {
  getTopicsBySubject: async (subjectId: string) => {
    try {
      console.log("Calling getTopicsBySubject with:", subjectId);
      const response = await api.get(`/topics/subject/${subjectId}`);
      console.log("getTopicsBySubject response:", response.data);
      return response.data;
    } catch (error) {
      console.log("Falling back to mock topics");
      return mockTopics;
    }
  },
  getSubTopicsByTopics: async (topicIds: string[]) => {
    try {
      console.log("Calling getSubTopicsByTopics with:", topicIds);
      const response = await api.post("/sub-topics/multi-topics", { topicIds });
      console.log("getSubTopicsByTopics response:", response.data);
      return response.data;
    } catch (error) {
      console.log("Falling back to mock subtopics");
      return mockSubTopics;
    }
  },
};
