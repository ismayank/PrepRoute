import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { testService, subjectService, topicService } from "../api/testService";
import { useTestStore } from "../store/testStore";
import { toast } from "sonner";

interface Props {
  test: any;
  isOpen: boolean;
  onClose: () => void;
}

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

export default function EditTestModal({ test, isOpen, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subTopics, setSubTopics] = useState<SubTopic[]>([]);
  const { updateTest } = useTestStore();

  const [formData, setFormData] = useState({
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

  useEffect(() => {
    if (isOpen) {
      fetchSubjects();
      if (test.subject) {
        handleSubjectChange(test.subject, true);
      }
    }
  }, [isOpen, test]);

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
    }
  };

  const handleSubjectChange = async (subjectId: string, _initialLoad = false) => {
    setFormData(prev => ({ ...prev, subject: subjectId, topics: [], sub_topics: [] }));
    try {
      const result = await topicService.getTopicsBySubject(subjectId);
      setTopics(result.data || [
        { id: "t1", name: "Algebra", subject_id: subjectId },
        { id: "t2", name: "Calculus", subject_id: subjectId }
      ]);
      setSubTopics([]);
    } catch (error) {
      console.error("Failed to fetch topics:", error);
    }
  };

  const handleTopicsChange = async (selectedTopic: string) => {
    const topicsArray = selectedTopic ? [selectedTopic] : [];
    setFormData(prev => ({ ...prev, topics: topicsArray, sub_topics: [] }));
    if (selectedTopic) {
      try {
        const result = await topicService.getSubTopicsByTopics([selectedTopic]);
        setSubTopics(result.data || [
          { id: "st1", name: "Linear Equations", topic_id: selectedTopic },
          { id: "st2", name: "Quadratic Equations", topic_id: selectedTopic }
        ]);
      } catch (error) {
        console.error("Failed to fetch subtopics:", error);
      }
    } else {
      setSubTopics([]);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const result = await testService.updateTest(test.id, formData);
      updateTest(test.id, result.data);
      toast.success("Test updated successfully!");
      onClose();
    } catch (error) {
      console.error("Failed to update test:", error);
      toast.error("Failed to update test");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-[#E5E7EB]">
          <h2 className="text-2xl font-semibold text-[#1D2939]">Edit Test</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX size={24} className="text-[#667085]" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex w-fit rounded-2xl border border-[#E5E7EB] overflow-hidden mb-8">
            <button
              onClick={() => setFormData(prev => ({ ...prev, type: "practice" }))}
              className={`px-8 py-4 font-medium ${formData.type === "practice"
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
                  className="w-full h-[56px] rounded-xl border border-[#E5E7EB] px-4 text-[16px] outline-none bg-white"
                >
                  <option value="">Choose from Drop-down</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
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
                className="w-full h-[56px] rounded-xl border border-[#E5E7EB] px-4 text-[16px] outline-none"
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
                  className="w-full h-14 rounded-xl border border-[#E5E7EB] px-4"
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
                  className="w-full h-14 rounded-xl border border-[#E5E7EB] px-4"
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
                className="w-full h-[56px] rounded-xl border border-[#E5E7EB] px-4 text-[16px] outline-none"
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
                  Hard
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
                  className="w-full h-[56px] rounded-xl border border-[#E5E7EB] px-4 text-[18px]"
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
                  className="w-full h-[56px] rounded-xl border border-[#E5E7EB] px-4 text-[18px]"
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
                  className="w-full h-[56px] rounded-xl border border-[#E5E7EB] px-4 text-[18px]"
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
                  className="w-full h-[56px] rounded-xl border border-[#E5E7EB] px-4 text-[16px] outline-none"
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
                  className="w-full h-[56px] rounded-xl border border-[#E5E7EB] px-4 text-[16px] outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-5 mt-16">
            <button
              onClick={onClose}
              className="w-[160px] h-[52px] rounded-xl bg-[#F5F7FF] text-[#5D7BF7] hover:bg-[#E6EBFF] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-[160px] h-[52px] rounded-xl bg-[#6B7EF8] text-white hover:bg-[#5D6FE3] transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
