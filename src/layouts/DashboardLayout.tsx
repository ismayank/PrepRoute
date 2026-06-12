import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiBell,
  FiTrendingUp,
  FiEdit3,
  FiSearch,
  FiChevronDown,
} from "react-icons/fi";

import logo from "../assets/logo.svg";
import avatar from "../assets/avatar.svg";

interface Props {
  children: ReactNode;
  innerSidebar?: ReactNode;
}


export default function DashboardLayout({ children, innerSidebar }: Props) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (paths: string[]) => {
    return paths.some(path => location.pathname.startsWith(path));
  };

  const navItems = [
    {
      label: "Dashboard",
      icon: FiTrendingUp,
      path: "/dashboard",
      paths: ["/dashboard"]
    },
    {
      label: "Test Creation",
      icon: FiEdit3,
      path: "/create-test",
      paths: ["/create-test", "/edit-test", "/add-questions", "/preview-publish"]
    },
    {
      label: "Test Tracking",
      icon: FiSearch,
      path: "/test-tracking",
      paths: ["/test-tracking"]
    }
  ];

  const isIconOnly = !!innerSidebar;
  return (
    <div className="h-screen flex bg-white">
      {/* Main Sidebar (Always there with icons) */}
      <aside className={`${isIconOnly ? 'w-[0px]' : 'w-[250px]'} border-r border-[#E5E7EB] flex flex-col`}>
        <div className="h-[90px] px-6 flex items-center">
          <img src={logo} alt="logo" className="h-10" />
        </div>

        <nav className="px-4 mt-4 space-y-2 flex-1">
          {navItems.map((item) => {
            const active = isActive(item.paths);
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center justify-start px-6 py-4 rounded-xl transition-colors ${
                  active
                    ? "bg-[#F3F6FF] border-l-4 border-[#5D7BF7] text-[#3559E0]"
                    : "text-[#667085] hover:bg-gray-50"
                }`}
              >
                <Icon size={24} />
                {!isIconOnly && <span className="ml-3">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Inner Sidebar (for question pages) */}
      {innerSidebar}

      {/* Content */}

      <div className="flex-1 flex flex-col">
        <header className="h-[90px] border-b border-[#E5E7EB] px-8 flex justify-end items-center gap-8">
          <button className="relative">
            <FiBell size={24} />
            <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-green-500" />
          </button>

          <div className="flex items-center gap-3">
            <img
              src={avatar}
              alt=""
              className="h-12 w-12 rounded-full border"
            />

            <div>
              <h4 className="font-semibold text-lg">
                Alex Wando
              </h4>

              <p className="text-sm text-[#667085]">
                Admin
              </p>
            </div>

            <FiChevronDown />
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}