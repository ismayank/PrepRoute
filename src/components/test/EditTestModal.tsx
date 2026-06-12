import { FiX } from "react-icons/fi";
import TestForm from "./TestForm";

interface EditTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditTestModal({
  isOpen,
  onClose,
}: EditTestModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="w-[900px] bg-white rounded-2xl shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-lg font-medium text-[#344054]">
            Edit Test Creation
          </h2>

          <button onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <TestForm />
        </div>
      </div>
    </div>
  );
}