import { useNavigate } from "react-router-dom";
import { useTestStore } from "../store/testStore";
import { 
  FiChevronLeft, 
  FiEdit2, 
  FiTrash2, 
  FiTrendingUp,
  FiAlertCircle,
  FiFileText,
  FiUsers,
  FiFile,
  FiUser,
  FiAward,
  FiMessageCircle,
  FiBell,
  FiSettings,
  FiChevronRight,
  FiBarChart2,
  FiEdit3,
  FiSearch
} from "react-icons/fi";
import logo from "../assets/logo.svg";

interface Props {
  backPath?: string;
  currentQuestionIndex?: number;
  onEditQuestion?: (index: number) => void;
  onDeleteQuestion?: (index: number) => void;
  onAddQuestion?: () => void;
  title?: string;
}

export default function QuestionSidebar({ 
  backPath = "/create-test", 
  currentQuestionIndex = 0, 
  onEditQuestion, 
  onDeleteQuestion, 
  onAddQuestion,
  title = "Question creation"
}: Props) {
  const navigate = useNavigate();
  const { currentTest, questions } = useTestStore();
  const totalQuestions = currentTest?.total_questions || 50;

  const sidebarIcons = [
    { icon: FiTrendingUp },
    { icon: FiEdit2 },
    { icon: FiAlertCircle },
    { icon: FiFileText },
    { icon: FiUsers },
    { icon: FiFile },
    { icon: FiUser },
    { icon: FiTrash2 },
    { icon: FiAward },
    { icon: FiMessageCircle },
    { icon: FiBell },
    { icon: FiSettings },
  ];

  return (
  <div className="flex h-full bg-white">
    <aside className="w-[350px] border-r border-[#E5E7EB] flex flex-col">
      {/* Logo */}
     <div className="relative h-[90px] px-6 flex items-center">
        <img src={logo} alt="logo" className="h-10" />

        <div className="absolute bottom-0 mt-7 left-0 right-0 border-b border-[#E5E7EB]" />
      </div>

      {/* Icons + Questions */}
      <div className="flex flex-1 overflow-hidden">
        {/* Icons Sidebar */}
        <div className="w-[70px] border-r border-gray-200 flex flex-col items-center py-6 space-y-5">
          {sidebarIcons.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                className="text-gray-600 hover:text-[#5D7BF7] transition-colors"
              >
                <Icon size={22} />
              </button>
            );
          })}
        </div>

        {/* Questions Panel */}
        <div className="flex-1 p-5 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-gray-600 text-lg font-medium">
              {title}
            </h2>

            <button
              onClick={() => navigate(backPath)}
              className="text-gray-500 hover:text-[#5D7BF7]"
            >
              <FiChevronLeft size={22} />
            </button>
          </div>

          <div className="mb-5 text-gray-600">
            Total Questions . {totalQuestions}
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar mb-5">
            {questions.map((q, i) => (
              <div
                key={i}
                className={`h-[52px] rounded-xl border px-4 flex items-center justify-between cursor-pointer transition-colors ${
                  i === currentQuestionIndex
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => onEditQuestion && onEditQuestion(i)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <span className="font-medium">
                    Question {i + 1}
                  </span>
                </div>

                <FiChevronRight size={18} />
              </div>
            ))}

            {Array.from({
              length: Math.max(
                0,
                totalQuestions - questions.length
              ),
            }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="h-[52px] rounded-xl border border-gray-200 px-4 flex items-center justify-between text-gray-400"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-gray-300" />
                  </div>

                  <span>
                    Question {questions.length + i + 1}
                  </span>
                </div>

                <FiChevronRight size={18} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  </div>
);
}
