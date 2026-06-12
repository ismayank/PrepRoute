import type{ ReactNode } from "react";
import {
  FiBell,
  FiBarChart2,
  FiEdit3,
  FiSearch,
  FiChevronDown,
} from "react-icons/fi";

import logo from "../assets/logo.svg";
import avatar from "../assets/avatar.svg";

interface Props {
  children: ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="h-screen flex bg-white">
      {/* Sidebar */}

      <aside className="w-[250px] border-r border-[#E5E7EB]">
        <div className="h-[90px] px-6 flex items-center">
          <img src={logo} alt="logo" className="h-10" />
        </div>

        <nav className="px-4 mt-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-4 rounded-xl bg-[#F3F6FF] border-l-4 border-[#5D7BF7] text-[#3559E0]">
            <FiBarChart2 />
            Dashboard
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-4 text-[#667085]">
            <FiEdit3 />
            Test Creation
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-4 text-[#667085]">
            <FiSearch />
            Test Tracking
          </button>
        </nav>
      </aside>

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