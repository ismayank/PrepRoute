import { FiEdit2, FiChevronLeft } from "react-icons/fi";
import { useTestStore } from "../../store/testStore";
import { useNavigate } from "react-router-dom";

interface QuestionSidebarProps {
  onEditQuestion?: (index: number) => void;
  onDeleteQuestion?: (index: number) => void;
  onAddQuestion?: () => void;
}

export default function QuestionSidebar({ onEditQuestion, onDeleteQuestion: _onDeleteQuestion, onAddQuestion }: QuestionSidebarProps) {
  const navigate = useNavigate();
  const { questions, currentTest } = useTestStore();

  return (
    <aside className="w-[240px] border-r border-[#E4E7EB] bg-white h-full overflow-y-auto">
      <div className="p-5">
        <div className="flex justify-between items-center mb-10">
          <button onClick={() => navigate("/create-test")} className="text-[#667085] hover:text-[#5D7BF7]">
            <FiChevronLeft size={18} />
          </button>
          <span className="text-[#667085] text-sm">
            Question creation
          </span>
        </div>

        <div className="mb-6 text-[#667085] text-sm">
          Total Questions : {currentTest?.total_questions || 50}
        </div>

        <div className="space-y-3 mb-6">
          {questions.map((_q, i) => (
            <div
              key={i}
              className="h-[42px] rounded-lg border border-[#4CC38A] bg-green-50 px-4 flex items-center justify-between text-[#27AE60] text-sm cursor-pointer"
              onClick={() => onEditQuestion?.(i)}
            >
              Question {i + 1}
              <div className="flex items-center gap-2">
                {onEditQuestion && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditQuestion(i);
                    }}
                    className="text-[#27AE60] hover:text-[#1d8a4a]"
                  >
                    <FiEdit2 size={14} />
                  </button>
                )}
                <span>›</span>
              </div>
            </div>
          ))}
          {Array.from({ length: Math.max(0, (currentTest?.total_questions || 50) - questions.length) }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="h-[42px] rounded-lg border border-gray-200 px-4 flex items-center text-gray-400 text-sm"
            >
              Question {questions.length + i + 1}
            </div>
          ))}
        </div>
        
        {onAddQuestion && (
          <button
            onClick={onAddQuestion}
            className="w-full py-3 bg-[#6D80F7] text-white rounded-xl hover:bg-[#5a6de3] transition-colors"
          >
            + Add Another Question
          </button>
        )}
      </div>
    </aside>
  );
}
