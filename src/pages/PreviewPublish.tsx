import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTestStore } from "../store/testStore";
import { testService, subjectService, topicService } from "../api/testService";
import { questionService } from "../api/questionService";
import { toast } from "sonner";
import DashboardLayout from "../layouts/DashboardLayout";
import { FiEdit2, FiClock, FiFileText, FiAward, FiCalendar } from "react-icons/fi";
import QuestionSidebar from "../components/QuestionSidebar";
import ArStickers from "../assets/ar_stickers.svg";

interface Subject {
  id: string;
  name: string;
}

interface Topic {
  id: string;
  name: string;
  subject_id?: string;
  subjectId?: string;
}

interface SubTopic {
  id: string;
  name: string;
  topic_id?: string;
  topicId?: string;
}

export default function PreviewPublish() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentTest, questions, updateTest, setCurrentTest, tests, setTests, setQuestions } = useTestStore();
  const [loading, setLoading] = useState(false);
  const [liveUntil, setLiveUntil] = useState("always");
  const [customDate, setCustomDate] = useState("");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subTopics, setSubTopics] = useState<SubTopic[]>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setFetching(true);
      try {
        // Fetch subjects
        const subjectsResult = await subjectService.getAllSubjects();
        const subjectsData = subjectsResult.data || [];
        setSubjects(subjectsData);

        // Fetch test if not in store
        let test = currentTest;
        if (!test) {
          test = tests.find(t => t.id === id);
        }
        if (!test) {
          const testResult = await testService.getTestById(id);
          test = testResult.data;
          setCurrentTest(test);
        }

        // Fetch topics and subtopics if test has subject and topics
        if (test) {
          if (test.subject) {
            const topicsResult = await topicService.getTopicsBySubject(test.subject);
            const topicsData = topicsResult.data || [];
            setTopics(topicsData);

            if (test.topics && test.topics.length > 0) {
              const subTopicsResult = await topicService.getSubTopicsByTopics(test.topics);
              const subTopicsData = subTopicsResult.data || [];
              setSubTopics(subTopicsData);
            }
          }

          // Fetch questions if not in store
          if (questions.length === 0) {
            // Check if test has questions array with IDs
            if (test.questions && test.questions.length > 0) {
              const questionsResult = await questionService.fetchBulkQuestions(test.questions);
              setQuestions(questionsResult.data || []);
            } else {
              // Try to get questions by test ID
              const questionsResult = await questionService.getQuestionsByTestId(test.id);
              setQuestions(questionsResult.data || []);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [id, currentTest, tests, setCurrentTest, questions, setQuestions]);

  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.name || subjectId;
  };

  const getTopicName = (topicId: string) => {
    const topic = topics.find(t => t.id === topicId);
    return topic?.name || topicId;
  };

  const getSubtopicName = (subtopicId: string) => {
    const subtopic = subTopics.find(st => st.id === subtopicId);
    return subtopic?.name || subtopicId;
  };

  const handlePublish = async () => {
    if (!id) return;

    try {
      setLoading(true);
      console.log("Publishing test with id:", id);
      const publishResult = await testService.publishTest(id);
      console.log("Publish test result:", publishResult);
      
      // Refresh the tests list!
      const allTestsResult = await testService.getAllTests();
      setTests(allTestsResult.data || []);
      
      updateTest(id, { status: "live" });
      toast.success("Test published successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to publish test:", error);
      toast.error("Failed to publish test");
    } finally {
      setLoading(false);
    }
  };

  const sidebar = (
    <QuestionSidebar
      backPath="/add-questions"
      currentQuestionIndex={0}
      onEditQuestion={() => {}}
      onDeleteQuestion={() => {}}
      title="Test creation"
    />
  );

  return (
    <DashboardLayout innerSidebar={sidebar}>
      <div className="p-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <div className="text-[#667085]">
            Test Creation / Create Test / {currentTest?.type === "practice" ? "Chapter Wise" : currentTest?.type === "pyq" ? "PYQ" : "Mock Test"}
          </div>
        </div>

        {/* Test Details Card */}
        {currentTest && (
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 mb-8">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-[#1D2939] text-white px-4 py-1 rounded-full text-sm">
                {currentTest.type === "practice" ? "Chapter Wise" : currentTest.type === "pyq" ? "PYQ" : "Mock Test"}
              </span>
              <button
                onClick={() => navigate(`/edit-test/${currentTest.id}`)}
                className="text-[#5D7BF7] hover:text-[#4a66d4]"
              >
                <FiEdit2 size={20} />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <img src={ArStickers} alt="Test Icon" className="w-6 h-6" />
              <div className="text-lg font-medium text-[#1D2939]">
                {currentTest.name}
              </div>
              <span className={`px-4 py-1 rounded-lg text-sm ${
                currentTest.difficulty === "easy" 
                  ? "bg-green-100 text-green-700" 
                  : currentTest.difficulty === "medium" 
                  ? "bg-yellow-100 text-yellow-700" 
                  : "bg-red-100 text-red-700"
              }`}>
                {currentTest.difficulty}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-10 gap-y-4">
              <div>
                <div className="mb-4">
                  <span className="text-[#667085] mr-2">Subject</span>
                  <span className="text-[#1D2939] font-medium">: {getSubjectName(currentTest.subject) || currentTest.subject}</span>
                </div>
                <div>
                  <span className="text-[#667085] mr-2">Topic</span>
                  <span className="text-[#1D2939] mr-2">:</span>
                  {currentTest.topics?.map((topicId, i) => (
                    <span key={i} className="ml-2 px-3 py-1 border border-yellow-400 text-yellow-700 rounded-lg text-sm mr-2">
                      {getTopicName(topicId)}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-6">
                <div className="flex items-center gap-2 text-sm text-[#667085] bg-gray-50 px-4 py-2 rounded-lg">
                  <FiClock size={16} />
                  <span>{currentTest.total_time || 60} Min</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#667085] bg-gray-50 px-4 py-2 rounded-lg">
                  <FiFileText size={16} />
                  <span>{currentTest.total_questions || 50} Q's</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#667085] bg-gray-50 px-4 py-2 rounded-lg">
                  <FiAward size={16} />
                  <span>{currentTest.total_marks || 250} Marks</span>
                </div>
              </div>
              
              <div>
                <span className="text-[#667085] mr-2">Sub Topic</span>
                <span className="text-[#1D2939] mr-2">:</span>
                {currentTest.sub_topics?.map((subtopicId, i) => (
                  <span key={i} className="ml-2 px-3 py-1 border border-yellow-400 text-yellow-700 rounded-lg text-sm mr-2">
                    {getSubtopicName(subtopicId)}
                  </span>
                ))}
              </div>
            </div>

            {/* Publish Now / Schedule Publish Buttons */}
            <div className="mt-6 flex gap-3">
              <button 
                onClick={handlePublish} 
                disabled={loading}
                className="px-6 py-2 bg-[#5D7BF7] text-white rounded-lg hover:bg-[#4a66d4] transition-colors disabled:opacity-50"
              >
                Publish Now
              </button>
              <button className="px-6 py-2 border border-[#E5E7EB] text-[#667085] rounded-lg hover:bg-[#F9FAFB] transition-colors">
                Schedule Publish
              </button>
            </div>
          </div>
        )}

        {/* Live Until Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-medium text-[#344054] mb-6">
            Live Until
          </h2>
          <p className="text-[#667085] mb-6">
            Choose how long this test should remain available on the platform.
          </p>

          <div className="grid grid-cols-2 gap-x-32 gap-y-8 mb-8">
            <label className="flex items-center gap-3 cursor-pointer text-[#667085]">
              <input
                type="radio"
                name="liveUntil"
                value="always"
                checked={liveUntil === "always"}
                onChange={(e) => setLiveUntil(e.target.value)}
                className="h-5 w-5"
              />
              Always Available
            </label>
            <label className="flex items-center gap-3 cursor-pointer text-[#667085]">
              <input
                type="radio"
                name="liveUntil"
                value="3weeks"
                checked={liveUntil === "3weeks"}
                onChange={(e) => setLiveUntil(e.target.value)}
                className="h-5 w-5"
              />
              3 Weeks
            </label>
            <label className="flex items-center gap-3 cursor-pointer text-[#667085]">
              <input
                type="radio"
                name="liveUntil"
                value="1week"
                checked={liveUntil === "1week"}
                onChange={(e) => setLiveUntil(e.target.value)}
                className="h-5 w-5"
              />
              1 Week
            </label>
            <label className="flex items-center gap-3 cursor-pointer text-[#667085]">
              <input
                type="radio"
                name="liveUntil"
                value="1month"
                checked={liveUntil === "1month"}
                onChange={(e) => setLiveUntil(e.target.value)}
                className="h-5 w-5"
              />
              1 Month
            </label>
            <label className="flex items-center gap-3 cursor-pointer text-[#667085]">
              <input
                type="radio"
                name="liveUntil"
                value="2weeks"
                checked={liveUntil === "2weeks"}
                onChange={(e) => setLiveUntil(e.target.value)}
                className="h-5 w-5"
              />
              2 Weeks
            </label>
            <label className="flex items-center gap-3 cursor-pointer text-[#5D7BF7]">
              <input
                type="radio"
                name="liveUntil"
                value="custom"
                checked={liveUntil === "custom"}
                onChange={(e) => setLiveUntil(e.target.value)}
                className="h-5 w-5"
              />
              Custom Duration
            </label>
          </div>

          {liveUntil === "custom" && (
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="w-full h-[56px] rounded-xl border border-[#E5E7EB] px-5 outline-none"
                  />
                  <FiCalendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div className="flex-1">
                <div className="relative">
                  <select className="w-full h-[56px] rounded-xl border border-[#E5E7EB] px-5 outline-none bg-white">
                    <option value="">Select End Time</option>
                  </select>
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Preview Questions Section */}
        <div>
          <h2 className="text-2xl font-medium text-[#344054] mb-8">
            Preview Questions
          </h2>
          {questions.map((q, i) => (
            <div key={i} className="border border-[#E5E7EB] rounded-xl p-6 mb-6 bg-white">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-[#4D57F5] text-white px-3 py-1 rounded-lg text-sm">
                  MCQ
                </span>
                <span className="text-[#667085] text-sm">
                  {i + 1}/{questions.length}
                </span>
              </div>
              <div 
                className="text-lg font-medium mb-8 text-[#344054] prose prose-blue max-w-none" 
                dangerouslySetInnerHTML={{ __html: q.question }} 
              />
              <div className="grid gap-3 mb-6">
                {[1, 2, 3, 4].map((opt) => {
                  const optionKey = `option${opt}` as keyof typeof q;
                  const isCorrect = q.correct_option === `option${opt}`;
                  return (
                    <div
                      key={opt}
                      className={`p-4 rounded-xl border ${
                        isCorrect
                          ? "border-[#26AF66] bg-[#F0FDF4]"
                          : "border-[#E5E7EB]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            isCorrect ? "border-[#26AF66] bg-[#26AF66]" : "border-gray-300"
                          }`}>
                            {isCorrect && (
                              <svg
                                className="w-4 h-4 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                          <span className={isCorrect ? "text-[#27AE60]" : "text-[#667085]"}>
                            {q[optionKey]}
                          </span>
                        </div>
                        {isCorrect && (
                          <span className="text-[#27AE60] text-sm font-medium">
                            Correct Answer ✓
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {q.explanation && (
                <div className="p-4 bg-yellow-50 rounded-xl">
                  <p className="text-[#9C4221]">
                    <span className="font-medium">Explanation:</span> {q.explanation}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Buttons */}
        <div className="flex justify-end gap-4 mt-12">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-[160px] h-[52px] rounded-xl bg-[#F5F7FF] text-[#5D7BF7] hover:bg-[#E6EBFF] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePublish}
            disabled={loading}
            className="w-[160px] h-[52px] rounded-xl bg-[#6B7EF8] text-white hover:bg-[#5a6de3] transition-colors disabled:opacity-50"
          >
            {loading ? "Publishing..." : "Confirm"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
