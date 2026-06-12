import {
  FiEdit,
  FiFileText,
  FiUsers,
  FiHome,
  FiUser,
  FiArchive,
  FiDollarSign,
  FiAward,
  FiMessageCircle,
  FiBell,
  FiSettings,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function LeftToolbar() {
  const navigate = useNavigate();

  const icons = [
    { Icon: FiEdit, onClick: () => navigate("/create-test") },
    { Icon: FiFileText, onClick: () => navigate("/dashboard") },
    { Icon: FiUsers, onClick: () => {} },
    { Icon: FiHome, onClick: () => navigate("/dashboard") },
    { Icon: FiUser, onClick: () => {} },
    { Icon: FiArchive, onClick: () => {} },
    { Icon: FiDollarSign, onClick: () => {} },
    { Icon: FiAward, onClick: () => {} },
    { Icon: FiMessageCircle, onClick: () => {} },
    { Icon: FiBell, onClick: () => {} },
    { Icon: FiSettings, onClick: () => {} },
  ];

  return (
    <div
      className="
        w-[48px]
        border-r
        border-[#E4E7EC]
        bg-white
        flex
        flex-col
        items-center
        pt-40
        gap-6
      "
    >
      {icons.map(({ Icon, onClick }, index) => (
        <button
          key={index}
          onClick={onClick}
          className="
            text-[#667085]
            hover:text-[#6D80F7]
            transition-colors
            cursor-pointer
          "
        >
          <Icon size={20} />
        </button>
      ))}
    </div>
  );
}