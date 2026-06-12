import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

export default function TestTracking() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="p-8 flex flex-col items-center justify-center h-full">
        <div className="text-center">
          <div className="text-8xl mb-6">🚧</div>
          <h1 className="text-3xl font-bold text-[#1D2939] mb-4">Page in Progress</h1>
          <p className="text-[#667085] mb-8">This feature is currently under development. Please check back later!</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 bg-[#5D7BF7] text-white rounded-xl hover:bg-[#4a66d4] transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}