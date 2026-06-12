import DashboardLayout from "../layouts/DashboardLayout";
import { FiChevronDown } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { testService, subjectService, topicService } from "../api/testService";
import { useTestStore } from "../store/testStore";
import { toast } from "sonner";

interface Subject {
  id: string;
  name: string;
}

interface Topic {
  id: string;
  name: string;
  subject_id: string;
}

interface SubTopic {
  id: string;
  name: string;
  topic_id: string;
}

export default function CreateTest() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { setCurrentTest, setQuestions, addTest, setTests } = useTestStore();

  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subTopics, setSubTopics] = useState<SubTopic[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedTopicId, setSelectedTopicId] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    type: "chapterwise",
    subject: "",
    topics: [] as string[],
    sub_topics: [] as string[],
    correct_marks: 4,
    wrong_marks: -1,
    unattempt_marks: 0,
    difficulty: "medium" as "easy" | "medium" | "hard",
    total_time: 60,
    total_marks: 100,
    total_questions: 25,
  });

  useEffect(() => {
    fetchSubjects();
    if (id) {
      fetchTest(id);
    }
  }, [id]);

  const fetchSubjects = async () => {
    try {
      const result = await subjectService.getAllSubjects();
      setSubjects(result.data || [
        { id: "1", name: "Mathematics" },
        { id: "2", name: "Physics" },
        { id: "3", name: "Chemistry" }
      ]);
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
      // Use mock subjects as fallback
      setSubjects([
        { id: "1", name: "Mathematics" },
        { id: "2", name: "Physics" },
        { id: "3", name: "Chemistry" }
      ]);
    }
  };

  const fetchTest = async (testId: string) => {
    try {
      const result = await testService.getTestById(testId);
      const test = result.data;
      setFormData({
        name: test.name || "",
        type: test.type || "practice",
        subject: test.subject || "",
        topics: test.topics || [],
        sub_topics: test.sub_topics || [],
        correct_marks: test.correct_marks || 4,
        wrong_marks: test.wrong_marks || -1,
        unattempt_marks: test.unattempt_marks || 0,
        difficulty: test.difficulty || "medium",
        total_time: test.total_time || 60,
        total_marks: test.total_marks || 100,
        total_questions: test.total_questions || 25,
      });
    } catch (error) {
      console.error("Failed to fetch test:", error);
    }
  };

  const handleSubjectChange = async (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setFormData(prev => ({ ...prev, subject: subjectId, topics: [], sub_topics: [] }));
    if (subjectId) {
      try {
        const result = await topicService.getTopicsBySubject(subjectId);
        setTopics(result.data || [
          { id: "t1", name: "Algebra", subject_id: subjectId },
          { id: "t2", name: "Calculus", subject_id: subjectId }
        ]);
        setSubTopics([]); // Clear subtopics when subject changes
      } catch (error) {
        console.error("Failed to fetch topics:", error);
        // Use mock topics as fallback
        setTopics([
          { id: "t1", name: "Algebra", subject_id: subjectId },
          { id: "t2", name: "Calculus", subject_id: subjectId }
        ]);
        setSubTopics([]);
      }
    }
  };

  const handleTopicsChange = async (selectedTopicId: string) => {
    setSelectedTopicId(selectedTopicId);
    const topicsArray = selectedTopicId ? [selectedTopicId] : [];
    setFormData(prev => ({ ...prev, topics: topicsArray, sub_topics: [] }));
    if (selectedTopicId) {
      try {
        const result = await topicService.getSubTopicsByTopics([selectedTopicId]);
        setSubTopics(result.data || [
          { id: "st1", name: "Linear Equations", topic_id: selectedTopicId },
          { id: "st2", name: "Quadratic Equations", topic_id: selectedTopicId }
        ]);
      } catch (error) {
        console.error("Failed to fetch subtopics:", error);
        // Use mock subtopics as fallback
        setSubTopics([
          { id: "st1", name: "Linear Equations", topic_id: selectedTopicId },
          { id: "st2", name: "Quadratic Equations", topic_id: selectedTopicId }
        ]);
      }
    } else {
      setSubTopics([]); // Clear subtopics when no topic is selected
    }
  };

  const handleSaveDraft = async () => {
    try {
      setLoading(true);
      // Do NOT send status in create test request!
      const { status, ...rest } = formData;
      const testData = rest;
      console.log("Sending create test data (draft):", testData);
      const result = await testService.createTest(testData);
      console.log("Create test result (draft):", result);
      
      // Refresh tests list!
      const allTests = await testService.getAllTests();
      setTests(allTests.data || []);
      
      setCurrentTest(result.data);
      addTest(result.data);
      setQuestions([]);
      toast.success("Test saved as draft!");
      navigate("/add-questions");
    } catch (error) {
      console.error("Failed to save test:", error);
      toast.error("Failed to save test");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    try {
      setLoading(true);
      let result;
      // Do NOT send status in create test request!
      const { status, ...rest } = formData;
      const testData = rest;
      console.log("Sending test data (next):", testData);
      if (id) {
        result = await testService.updateTest(id, formData);
      } else {
        result = await testService.createTest(testData);
      }
      console.log("Test save result (next):", result);
      
      // Refresh tests list!
      const allTests = await testService.getAllTests();
      setTests(allTests.data || []);
      
      setCurrentTest(result.data);
      addTest(result.data);
      setQuestions([]);
      toast.success("Test saved!");
      navigate("/add-questions");
    } catch (error) {
      console.error("Failed to save test:", error);
      toast.error("Failed to save test");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="text-[18px] text-[#667085] mb-10">
        Test Creation
        <span className="mx-3">/</span>
        {id ? "Edit Test" : "Create Test"}
      </div>

      <div className="flex w-fit rounded-2xl border border-[#E4E7EB] overflow-hidden mb-12">
        <button
          onClick={() => setFormData(prev => ({ ...prev, type: "chapterwise" }))}
          className={`px-8 py-4 font-medium ${formData.type === "chapterwise"
              ? "bg-[#F3F6FF] text-[#3559E0]"
              : "text-[#98A2B3]"
            }`}
        >
          Chapter Wise
        </button>
        <button
          onClick={() => setFormData(prev => ({ ...prev, type: "pyq" }))}
          className={`px-10 py-4 font-medium ${formData.type === "pyq"
              ? "bg-[#F3F6FF] text-[#3559E0]"
              : "text-[#98A2B3]"
            }`}
        >
          PYQ
        </button>
        <button
          onClick={() => setFormData(prev => ({ ...prev, type: "mock" }))}
          className={`px-10 py-4 font-medium ${formData.type === "mock"
              ? "bg-[#F3F6FF] text-[#3559E0]"
              : "text-[#98A2B3]"
            }`}
        >
          Mock Test
        </button>
      </div>

      <div className="grid grid-cols-2 gap-x-12 gap-y-8">
        <div>
          <label className="block text-[18px] font-medium text-[#344054] mb-3">
            Subject
          </label>
          <div className="relative">
            <select
              value={formData.subject}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="
                w-full
                h-[56px]
                rounded-xl
                border
                border-[#D0D5DD]
                px-4
                text-[16px]
                outline-none
                bg-white
              "
            >
              <option value="">Choose from Drop-down</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>{subject.name}</option>
              ))}
            </select>
            {/* <FiChevronDown
              className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-[#667085]
                pointer-events-none
              "
              size={20}
            /> */}
          </div>
        </div>

        <div>
          <label className="block text-[18px] font-medium text-[#344054] mb-3">
            Name of Test
          </label>
          <input
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter name of Test"
            className="
              w-full
              h-[56px]
              rounded-xl
              border
              border-[#D0D5DD]
              px-4
              text-[16px]
              outline-none
            "
          />
        </div>

        <div>
          <label className="block text-[18px] font-medium text-[#344054] mb-3">
            Topic
          </label>
          <div className="relative">
            <select
              value={formData.topics.length > 0 ? formData.topics[0] : ""}
              onChange={(e) => handleTopicsChange(e.target.value)}
              className="w-full h-14 rounded-xl border border-[#D0D5DD] px-4"
            >
              <option value="">Choose Topic</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>
          </div>
        </div>


        <div>
          <label className="block text-[18px] font-medium text-[#344054] mb-3">
            Sub Topic
          </label>
          <div className="relative">
            <select
              value={formData.sub_topics.length > 0 ? formData.sub_topics[0] : ""}
              onChange={(e) => setFormData(prev => ({ ...prev, sub_topics: [e.target.value] }))}
              className="w-full h-14 rounded-xl border border-[#D0D5DD] px-4"
            >
              <option value="">Choose Subtopic</option>
              {subTopics.map((subTopic) => (
                <option key={subTopic.id} value={subTopic.id}>
                  {subTopic.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[18px] font-medium text-[#344054] mb-3">
            Duration (Minutes)
          </label>
          <input
            type="number"
            value={formData.total_time}
            onChange={(e) => setFormData(prev => ({ ...prev, total_time: parseInt(e.target.value) || 0 }))}
            placeholder="Enter the time"
            className="
              w-full
              h-[56px]
              rounded-xl
              border
              border-[#D0D5DD]
              px-4
              text-[16px]
              outline-none
            "
          />
        </div>

        <div>
          <label className="block text-[18px] font-medium text-[#344054] mb-5">
            Test Difficulty Level
          </label>
          <div className="flex gap-8 mt-6">
            <label className="flex items-center gap-3 text-[18px] cursor-pointer">
              <input
                type="radio"
                name="difficulty"
                value="easy"
                checked={formData.difficulty === "easy"}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as "easy" | "medium" | "hard" }))}
                className="h-5 w-5"
              />
              Easy
            </label>
            <label className="flex items-center gap-3 text-[18px] cursor-pointer">
              <input
                type="radio"
                name="difficulty"
                value="medium"
                checked={formData.difficulty === "medium"}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as "easy" | "medium" | "hard" }))}
                className="h-5 w-5"
              />
              Medium
            </label>
            <label className="flex items-center gap-3 text-[18px] cursor-pointer">
              <input
                type="radio"
                name="difficulty"
                value="hard"
                checked={formData.difficulty === "hard"}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as "easy" | "medium" | "hard" }))}
                className="h-5 w-5"
              />
              Difficult
            </label>
          </div>
        </div>
      </div>

      <div className="mt-14">
        <h3 className="text-[18px] font-medium text-[#344054] mb-8">
          Marking Scheme:
        </h3>
        <div className="grid grid-cols-5 gap-6">
          <div>
            <label className="block text-[18px] font-medium text-[#344054] mb-3">
              Wrong Answer
            </label>
            <input
              type="number"
              value={formData.wrong_marks}
              onChange={(e) => setFormData(prev => ({ ...prev, wrong_marks: parseInt(e.target.value) || 0 }))}
              className="
                w-full
                h-[56px]
                rounded-xl
                border
                border-[#D0D5DD]
                px-4
                text-[18px]
              "
            />
          </div>
          <div>
            <label className="block text-[18px] font-medium text-[#344054] mb-3">
              Unattempted
            </label>
            <input
              type="number"
              value={formData.unattempt_marks}
              onChange={(e) => setFormData(prev => ({ ...prev, unattempt_marks: parseInt(e.target.value) || 0 }))}
              className="
                w-full
                h-[56px]
                rounded-xl
                border
                border-[#D0D5DD]
                px-4
                text-[18px]
              "
            />
          </div>
          <div>
            <label className="block text-[18px] font-medium text-[#344054] mb-3">
              Correct Answer
            </label>
            <input
              type="number"
              value={formData.correct_marks}
              onChange={(e) => setFormData(prev => ({ ...prev, correct_marks: parseInt(e.target.value) || 0 }))}
              className="
                w-full
                h-[56px]
                rounded-xl
                border
                border-[#D0D5DD]
                px-4
                text-[18px]
              "
            />
          </div>
          <div>
            <label className="block text-[18px] font-medium text-[#344054] mb-3">
              No of Questions
            </label>
            <input
              type="number"
              value={formData.total_questions}
              onChange={(e) => setFormData(prev => ({ ...prev, total_questions: parseInt(e.target.value) || 0 }))}
              placeholder="Ex: 25"
              className="
                w-full
                h-[56px]
                rounded-xl
                border
                border-[#D0D5DD]
                px-4
                text-[16px]
                outline-none
              "
            />
          </div>
          <div>
            <label className="block text-[18px] font-medium text-[#344054] mb-3">
              Total Marks
            </label>
            <input
              type="number"
              value={formData.total_marks}
              onChange={(e) => setFormData(prev => ({ ...prev, total_marks: parseInt(e.target.value) || 0 }))}
              placeholder="Ex: 100"
              className="
                w-full
                h-[56px]
                rounded-xl
                border
                border-[#D0D5DD]
                px-4
                text-[16px]
                outline-none
              "
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-5 mt-16">
        <button
          onClick={() => navigate("/dashboard")}
          className="w-[160px] h-[52px] rounded-xl bg-[#F5F7FF] text-[#3559E0]"
        >
          Cancel
        </button>
        {!id && (
          <button
            onClick={handleSaveDraft}
            disabled={loading}
            className="w-[160px] h-[52px] rounded-xl border border-[#D0D5DD] text-[#344054] disabled:opacity-50"
          >
            Save Draft
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={loading}
          className="w-[160px] h-[52px] rounded-xl bg-[#6B7EF8] text-white disabled:opacity-50"
        >
          {loading ? "Saving..." : "Next"}
        </button>
      </div>
    </DashboardLayout>
  );
}
