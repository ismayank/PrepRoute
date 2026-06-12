import DashboardLayout from "../layouts/DashboardLayout";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTestStore } from "../store/testStore";
import { questionService } from "../api/questionService";
import { topicService, subjectService, testService } from "../api/testService";
import { toast } from "sonner";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import ArStickers from "../assets/ar_stickers.svg";

import {
  FiEdit2,
  FiClock,
  FiFileText,
  FiAward,
  FiTrash2,
  FiBold,
  FiItalic,
  FiUnderline,
  FiLink,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiList,
  FiImage,
} from "react-icons/fi";
import QuestionSidebar from "../components/QuestionSidebar";

export default function AddQuestions() {
  const navigate = useNavigate();
  const { currentTest, questions, setQuestions, addQuestion, updateTest, setCurrentTest } = useTestStore();

  const [loading, setLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [topics, setTopics] = useState<any[]>([]);
  const [subtopics, setSubtopics] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);

  const [questionForm, setQuestionForm] = useState({
    type: "mcq",
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    correct_option: "option1" as "option1" | "option2" | "option3" | "option4",
    explanation: "",
    difficulty: "easy" as "easy" | "medium" | "hard",
    topic: "",
    sub_topic: "",
    media_url: "",
  });

  // Mock data
  const mockSubjects: Record<string, string> = {
    "1": "Mathematics",
    "2": "Physics",
    "3": "Chemistry",
  };

  const mockTopicsList = [
    { id: "t1", name: "Algebra" },
    { id: "t2", name: "Calculus" },
    { id: "t3", name: "Newtonian Mechanics" },
  ];

  const mockSubtopicsList = [
    { id: "st1", name: "Linear Equations" },
    { id: "st2", name: "Quadratic Equations" },
  ];
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "Type here",
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setQuestionForm((prev) => ({
        ...prev,
        question: editor.getHTML(),
      }));
    },
  });

  useEffect(() => {
    // Load subjects
    const loadSubjects = async () => {
      try {
        const result = await subjectService.getAllSubjects();
        setSubjects(result.data || []);
      } catch (error) {
        console.error("Failed to load subjects");
      }
    };
    loadSubjects();

    // Load topics/subtopics based on current test
    if (currentTest?.subject) {
      const loadTopics = async () => {
        try {
          const result = await topicService.getTopicsBySubject(
            currentTest.subject,
          );
          setTopics(result.data || mockTopicsList);
        } catch (error) {
          console.error("Failed to load topics, using mock data");
          setTopics(mockTopicsList);
        }
      };
      loadTopics();
    }

    if (currentTest?.topics && currentTest.topics.length > 0) {
      const loadSubtopics = async () => {
        try {
          const result = await topicService.getSubTopicsByTopics(
            currentTest.topics,
          );
          setSubtopics(result.data || mockSubtopicsList);
        } catch (error) {
          console.error("Failed to load subtopics, using mock data");
          setSubtopics(mockSubtopicsList);
        }
      };
      loadSubtopics();
    }

    // Set default topic/subtopic from test
    if (currentTest?.topics && currentTest.topics.length > 0) {
      setQuestionForm((prev) => ({
        ...prev,
        topic: currentTest.topics[0],
        sub_topic:
          currentTest.sub_topics && currentTest.sub_topics.length > 0
            ? currentTest.sub_topics[0]
            : "",
      }));
    }

    // Load first question if available
    if (questions.length > 0) {
      setQuestionForm(questions[0]);
    }
  }, [currentTest]);

  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.name || subjectId;
  };

  const handleSaveQuestion = () => {
    if (!questionForm.question) {
      toast.error("Please enter a question");
      return;
    }
    if (
      !questionForm.option1 ||
      !questionForm.option2 ||
      !questionForm.option3 ||
      !questionForm.option4
    ) {
      toast.error("Please fill all 4 options");
      return;
    }

    // Check if we're editing an existing question or creating a new one
    const updatedQuestions = [...questions];
    if (currentQuestionIndex < updatedQuestions.length) {
      // Edit existing question
      updatedQuestions[currentQuestionIndex] = {
        id: questions[currentQuestionIndex].id,
        ...questionForm,
        test_id: currentTest?.id,
      };
      setQuestions(updatedQuestions);
      toast.success("Question updated!");
    } else {
      // Create new question
      const newQuestion = {
        id: Date.now().toString(),
        ...questionForm,
        test_id: currentTest?.id,
      };
      addQuestion(newQuestion);
      toast.success("Question added!");
    }
  };

  const handleAddAnotherQuestion = () => {
    // First save current question if it's valid
    if (questionForm.question) {
      handleSaveQuestion();
    }

    // Create new empty question
    setCurrentQuestionIndex(questions.length);
    setQuestionForm({
      type: "mcq",
      question: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      correct_option: "option1",
      explanation: "",
      difficulty: "easy",
      topic:
        currentTest?.topics && currentTest.topics.length > 0
          ? currentTest.topics[0]
          : "",
      sub_topic:
        currentTest?.sub_topics && currentTest.sub_topics.length > 0
          ? currentTest.sub_topics[0]
          : "",
      media_url: "",
    });
  };

  const handleEditQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    setQuestionForm(questions[index]);
  };

  const handleSaveAndContinue = async () => {
    // First save current question if it's valid
    if (questionForm.question && !editor?.isEmpty) {
      handleSaveQuestion();
    }

    if (questions.length === 0) {
      toast.error("Please add at least one question");
      return;
    }

    try {
      setLoading(true);
      console.log("Bulk creating questions:", questions);
      const bulkResult = await questionService.bulkCreateQuestions(questions);
      console.log("Bulk create questions result:", bulkResult);
      
      // Now update the test with question IDs!
      if (currentTest?.id && bulkResult?.data) {
        const questionIds = bulkResult.data.map(q => q.id);
        console.log("Updating test with question IDs:", questionIds);
        const updateTestPayload = {
          questions: questionIds,
          total_questions: questions.length
        };
        const updateResult = await testService.updateTest(currentTest.id, updateTestPayload);
        console.log("Update test result:", updateResult);
        // Update the currentTest in the store
        setCurrentTest({ ...currentTest, ...updateTestPayload, ...updateResult.data });
        updateTest(currentTest.id, { ...updateTestPayload, ...updateResult.data });
      }
      
      toast.success("Questions saved!");
      navigate(`/preview-publish/${currentTest?.id}`);
    } catch (error) {
      console.error("Failed to save questions:", error);
      toast.error("Failed to save questions");
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = () => {
    if (editor?.isEmpty) {
      toast.error("Please enter a question");
      return;
    }

    handleSaveQuestion();

    const totalQuestions = currentTest?.total_questions || 50;

    if (currentQuestionIndex + 1 >= totalQuestions) {
      // If it's the last question, save and navigate to preview
      handleSaveAndContinue();
      return;
    }

    const nextIndex = currentQuestionIndex + 1;

    setCurrentQuestionIndex(nextIndex);

    if (nextIndex < questions.length) {
      const nextQuestion = questions[nextIndex];

      setQuestionForm(nextQuestion);
      editor?.commands.setContent(nextQuestion.question || "");
    } else {
      setQuestionForm({
        type: "mcq",
        question: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        correct_option: "option1",
        explanation: "",
        difficulty: "easy",
        topic: currentTest?.topics?.[0] || "",
        sub_topic: currentTest?.sub_topics?.[0] || "",
        media_url: "",
      });

      editor?.commands.clearContent();
    }
  };

  const handleDeleteQuestion = (index: number) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      const updatedQuestions = questions.filter((_, i) => i !== index);

      setQuestions(updatedQuestions);

      if (updatedQuestions.length > 0) {
        const newIndex = Math.min(index, updatedQuestions.length - 1);

        setCurrentQuestionIndex(newIndex);
        setQuestionForm(updatedQuestions[newIndex]);
      } else {
        setCurrentQuestionIndex(0);
        editor?.commands.clearContent();
        setQuestionForm({
          type: "mcq",
          question: "",
          option1: "",
          option2: "",
          option3: "",
          option4: "",
          correct_option: "option1",
          explanation: "",
          difficulty: "easy",
          topic: "",
          sub_topic: "",
          media_url: "",
        });
      }

      toast.success("Question deleted");
    }
  };



  const getTopicName = (id: string) => {
    const topic =
      topics.find((t) => t.id === id) ||
      mockTopicsList.find((t) => t.id === id);
    return topic?.name || id;
  };

  const getSubtopicName = (id: string) => {
    const subtopic =
      subtopics.find((st) => st.id === id) ||
      mockSubtopicsList.find((st) => st.id === id);
    return subtopic?.name || id;
  };

  const sidebar = (
    <QuestionSidebar
      backPath="/create-test"
      currentQuestionIndex={currentQuestionIndex}
      onEditQuestion={handleEditQuestion}
      onDeleteQuestion={handleDeleteQuestion}
      onAddQuestion={handleAddAnotherQuestion}
    />
  );

  return (
    <DashboardLayout innerSidebar={sidebar}>
      <div className="p-8">
        {/* Breadcrumb and Publish Button */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-[#667085]">
            Test Creation / Create Test /{" "}
            {currentTest?.type === "practice"
              ? "Chapter Wise"
              : currentTest?.type === "pyq"
                ? "PYQ"
                : "Mock Test"}
          </div>
          <button
            onClick={handleSaveAndContinue}
            disabled={loading}
            className="px-8 py-3 bg-[#5D7BF7] text-white rounded-xl hover:bg-[#4a66d4] transition-colors disabled:opacity-50"
          >
            Publish
          </button>
        </div>

        {/* Test Details Card */}
        {currentTest && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-7">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-gray-900 text-white px-4 py-1 rounded-full text-sm">
                {currentTest.type === "practice"
                  ? "Chapter Wise"
                  : currentTest.type === "pyq"
                    ? "PYQ"
                    : "Mock Test"}
              </span>
              <button
                onClick={() => navigate(`/edit-test/${currentTest.id}`)}
                className="text-blue-600 hover:text-blue-700"
              >
                <FiEdit2 size={18} />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <img src={ArStickers} alt="Test Icon" className="w-6 h-6" />
              <div className="text-lg font-medium text-gray-900">
                {currentTest.name}
              </div>
              <span className="px-4 py-1 rounded-lg text-sm bg-teal-100 text-teal-700">
                {currentTest.difficulty}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-10 gap-y-4">
              <div>
                <div className="mb-4">
                  <span className="text-gray-600 mr-2">Subject</span>
                  <span className="text-gray-900 font-medium">
                    : {getSubjectName(currentTest.subject) || currentTest.subject}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 mr-2">Topic</span>
                  <span className="text-gray-900 mr-2">:</span>
                  {currentTest.topics?.map((topicId, i) => (
                    <span
                      key={i}
                      className="ml-2 px-3 py-1 border border-amber-400 text-amber-700 rounded-lg text-sm mr-2"
                    >
                      {getTopicName(topicId)}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-6">
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                  <FiClock size={16} />
                  <span>{currentTest.total_time || 60} Min</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                  <FiFileText size={16} />
                  <span>{currentTest.total_questions || 50} Q's</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                  <FiAward size={16} />
                  <span>{currentTest.total_marks || 250} Marks</span>
                </div>
              </div>

              <div>
                <span className="text-gray-600 mr-2">Sub Topic</span>
                <span className="text-gray-900 mr-2">:</span>
                {currentTest.sub_topics?.map((subtopicId, i) => (
                  <span
                    key={i}
                    className="ml-2 px-3 py-1 border border-amber-400 text-amber-700 rounded-lg text-sm mr-2"
                  >
                    {getSubtopicName(subtopicId)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Question Form */}
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-blue-600">
              Question {currentQuestionIndex + 1}/
              {currentTest?.total_questions || 50}
            </h2>
            <div className="flex gap-3">
              <button className="px-4 py-2 text-sm border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                + MCQ
              </button>
              <button className="px-4 py-2 text-sm border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                ↓ CSV
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => handleDeleteQuestion(currentQuestionIndex)}
              className="text-red-500 hover:text-red-600 flex items-center gap-2"
            >
              <FiTrash2 size={18} />
              <span>Delete All Edits</span>
            </button>
          </div>

          {/* Question Editor */}
          {/* <div className="border border-blue-200 rounded-xl overflow-hidden mb-8">
            <div className="h-[48px] border-b bg-white flex items-center px-4 gap-2">
              <button className="p-1 hover:bg-gray-100 rounded">
                <span className="font-bold text-gray-700 text-lg">B</span>
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <span className="italic text-gray-700 text-lg">I</span>
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <span className="underline text-gray-700 text-lg">U</span>
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <span className="text-gray-700 text-lg">↕️</span>
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <span className="text-gray-700 text-lg">📊</span>
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <span className="text-gray-700 text-lg">☰</span>
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <span className="text-gray-700 text-lg">☷</span>
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <span className="text-gray-700 text-lg">—</span>
              </button>
              <div className="w-px h-8 bg-gray-200 mx-2" />
              <button className="p-1 hover:bg-gray-100 rounded">
                <span className="text-gray-700 text-lg">📝</span>
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <span className="text-gray-700 text-lg">⊜</span>
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <span className="text-gray-700 text-lg">🔗</span>
              </button>
              <div className="flex-1" />
              <button className="p-1 hover:bg-gray-100 rounded text-gray-400">
                <span className="text-lg">
                  <FiTrash2 size={18} />
                </span>
              </button>
            </div>
            <textarea
              value={questionForm.question}
              onChange={(e) => setQuestionForm(prev => ({ ...prev, question: e.target.value }))}
              placeholder="Type here"
              className="w-full h-[220px] p-5 resize-none outline-none text-gray-600"
            />
          </div> */}
          <div className="border border-blue-200 rounded-xl overflow-hidden">
            <div className="h-14 border-b flex items-center gap-4 px-5 bg-white">
              <button
                onClick={() => editor?.chain().focus().toggleItalic().run()}
              >
                <FiItalic size={20} />
              </button>

              <button
                onClick={() => editor?.chain().focus().toggleBold().run()}
              >
                <FiBold size={20} />
              </button>

              <button
                onClick={() => editor?.chain().focus().toggleUnderline().run()}
              >
                <FiUnderline size={20} />
              </button>

              <button
                onClick={() => {
                  const url = prompt("Enter URL");
                  if (url) {
                    editor?.chain().focus().setLink({ href: url }).run();
                  }
                }}
              >
                <FiLink size={20} />
              </button>

              <button
                onClick={() =>
                  editor?.chain().focus().setTextAlign("left").run()
                }
              >
                <FiAlignLeft size={20} />
              </button>

              <button
                onClick={() =>
                  editor?.chain().focus().setTextAlign("center").run()
                }
              >
                <FiAlignCenter size={20} />
              </button>

              <button
                onClick={() =>
                  editor?.chain().focus().setTextAlign("right").run()
                }
              >
                <FiAlignRight size={20} />
              </button>

              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
              >
                <FiList size={20} />
              </button>

              <button
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";

                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];

                    if (!file) return;

                    const reader = new FileReader();

                    reader.onload = () => {
                      editor
                        ?.chain()
                        .focus()
                        .setImage({
                          src: reader.result as string,
                        })
                        .run();
                    };

                    reader.readAsDataURL(file);
                  };

                  input.click();
                }}
              >
                <FiImage size={20} />
              </button>

              <button className="font-serif text-xl">fx</button>
            </div>

            <EditorContent editor={editor} className="min-h-[250px] p-5" />
          </div>

          <h3 className="text-lg font-medium mb-5 mt-5 text-gray-800">
            Type the options below
          </h3>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {[1, 2, 3, 4].map((item) => {
              const optionKey = `option${item}` as keyof typeof questionForm;
              const isCorrect = questionForm.correct_option === `option${item}`;
              return (
                <div key={item} className="flex items-center gap-4">
                  <input
                    type="radio"
                    name="correct_option"
                    value={`option${item}`}
                    checked={isCorrect}
                    onChange={(e) =>
                      setQuestionForm((prev) => ({
                        ...prev,
                        correct_option: e.target.value as any,
                      }))
                    }
                    className="h-6 w-6 text-blue-600"
                  />
                  <div className="flex-1 relative">
                    <input
                      value={questionForm[optionKey] as string}
                      onChange={(e) =>
                        setQuestionForm((prev) => ({
                          ...prev,
                          [optionKey]: e.target.value,
                        }))
                      }
                      placeholder="Type Option here"
                      className="w-full h-[48px] rounded-lg border border-gray-200 px-4 outline-none focus:border-white-400 bg-white text-gray-700"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <span className="text-lg">
                        <FiTrash2 size={20} />
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Explanation */}
          <div className="mb-8">
            <h3 className="text-[32px] font-medium mb-5">Add Solution</h3>
            <textarea
              value={questionForm.explanation}
              onChange={(e) =>
                setQuestionForm((prev) => ({
                  ...prev,
                  explanation: e.target.value,
                }))
              }
              placeholder="Type here"
              className="w-full h-[220px] rounded-xl border border-[#E5E7EB] p-5 resize-none outline-none focus:border-[#5D7BF7] bg-white"
            />
          </div>

          {/* Question Settings */}
          <div className="mt-8 mb-10">
            <h3 className="text-[32px] font-medium mb-10">Question settings</h3>
            <div className="space-y-8">
              <div>
                <label className="block mb-3 text-lg text-[#344054]">
                  Level of Difficulty
                </label>
                <div className="relative">
                  <select
                    value={questionForm.difficulty}
                    onChange={(e) =>
                      setQuestionForm((prev) => ({
                        ...prev,
                        difficulty: e.target.value as
                          | "easy"
                          | "medium"
                          | "hard",
                      }))
                    }
                    className="w-full h-[56px] rounded-xl border border-[#E5E7EB] px-5 outline-none focus:border-[#5D7BF7] bg-white"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block mb-3 text-lg text-[#344054]">
                  Topic
                </label>
                <div className="relative">
                  <select
                    value={questionForm.topic}
                    onChange={(e) =>
                      setQuestionForm((prev) => ({
                        ...prev,
                        topic: e.target.value,
                      }))
                    }
                    className="w-full h-[56px] rounded-xl border border-[#E5E7EB] px-5 outline-none focus:border-[#5D7BF7] bg-white"
                  >
                    <option value="">Select Topic</option>
                    {[...(topics.length > 0 ? topics : mockTopicsList)].map(
                      (topic) => (
                        <option key={topic.id} value={topic.id}>
                          {topic.name}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>
              <div>
                <label className="block mb-3 text-lg text-[#344054]">
                  Sub-topic
                </label>
                <div className="relative">
                  <select
                    value={questionForm.sub_topic}
                    onChange={(e) =>
                      setQuestionForm((prev) => ({
                        ...prev,
                        sub_topic: e.target.value,
                      }))
                    }
                    className="w-full h-[56px] rounded-xl border border-[#E5E7EB] px-5 outline-none focus:border-[#5D7BF7] bg-white"
                  >
                    <option value="">Select Sub-topic</option>
                    {[
                      ...(subtopics.length > 0 ? subtopics : mockSubtopicsList),
                    ].map((subtopic) => (
                      <option key={subtopic.id} value={subtopic.id}>
                        {subtopic.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex justify-between items-center pt-8 border-t border-[#E5E7EB]">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-[#FF6B6B] text-white px-8 py-4 rounded-xl hover:bg-[#e55a54] transition-colors"
            >
              Exit Test Creation
            </button>
            <div className="flex gap-4">
              <button
                onClick={handleNextQuestion}
                disabled={
                  currentQuestionIndex + 1 >=
                  (currentTest?.total_questions || 50)
                }
                className={`px-16 py-4 rounded-xl text-white transition-colors ${
                  currentQuestionIndex + 1 >=
                  (currentTest?.total_questions || 50)
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#6D80F7] hover:bg-[#5a6de3]"
                }`}
              >
                Next
              </button>
            </div>
            {/* <div className="flex gap-4">
              <button
                onClick={handleSaveQuestion}
                className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Save Question
              </button>
              <button
                onClick={handleSaveAndContinue}
                disabled={loading}
                className="px-16 py-4 bg-[#6D80F7] text-white rounded-xl hover:bg-[#5a6de3] transition-colors disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save & Continue"}
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
