import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { testService, subjectService } from "../api/testService";
import { useTestStore } from "../store/testStore";
import { FiPlus, FiEdit, FiEye, FiTrash2 } from "react-icons/fi";
import EditTestModal from "../components/EditTestModal";
import { toast } from "sonner";

export default function Dashboard() {
  const navigate = useNavigate();
  const { tests, setTests, deleteTest } = useTestStore();
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingTest, setEditingTest] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [subjects, setSubjects] = useState<any[]>([]);
  const [subjectNameMap, setSubjectNameMap] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  useEffect(() => {
    fetchSubjects();
    fetchTests();
  }, []);

  const fetchSubjects = async () => {
    try {
      console.log("Dashboard: fetching subjects...");
      const result = await subjectService.getAllSubjects();
      console.log("Dashboard: fetchSubjects result", result);
      const subjectsData = result.data || [];
      console.log("Dashboard: subjectsData", subjectsData);
      setSubjects(subjectsData);
      
      // Create a map of subject ID to name for both ID and name keys
      const nameMap: Record<string, string> = {};
      subjectsData.forEach((subject: any) => {
        console.log("Dashboard: processing subject", subject);
        nameMap[subject.id] = subject.name;
        nameMap[subject.name] = subject.name;
      });
      console.log("Dashboard: nameMap", nameMap);
      setSubjectNameMap(nameMap);
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
    }
  };

  const fetchTests = async () => {
    try {
      setLoading(true);
      const result = await testService.getAllTests();
      console.log("Fetched tests:", result);
      console.log("Fetched tests data:", result.data);
      if (result.data && result.data.length > 0) {
        console.log("First test structure (API):", JSON.stringify(result.data[0], null, 2));
      }
      setTests(result.data || []);
      toast.success(`Fetched ${(result.data || []).length} tests!`);
    } catch (error) {
      console.error("Failed to fetch tests:", error);
      toast.error("Failed to fetch tests");
    } finally {
      setLoading(false);
    }
  };

  console.log("Current tests in store:", tests);
  console.log("Subject name map:", subjectNameMap);
  
  const filteredTests = tests.filter((test) => {
    const matchesSearch =
      test.name?.toLowerCase().includes(searchTerm.toLowerCase());

    // Get subject name from test subject (could be ID or name)
    const testSubjectName = subjectNameMap[test.subject] || test.subject;
    const matchesSubject =
      !subjectFilter || testSubjectName === subjectFilter;

    const matchesStatus =
      !statusFilter ||
      (test.status === "live" ? "Published" : "Draft") === statusFilter;

    const matchesDate =
      !dateFilter ||
      new Date(test.created_at || test.createdAt || new Date().toISOString())
        .toISOString()
        .split("T")[0] === dateFilter;

    return (
      matchesSearch &&
      matchesSubject &&
      matchesStatus &&
      matchesDate
    );
  });
  
  console.log("Filtered tests:", filteredTests);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, subjectFilter, statusFilter, dateFilter]);

  // Calculate paginated tests
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTests = filteredTests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTests.length / itemsPerPage);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this test?")) return;
    
    try {
      setDeletingId(id);
      await testService.deleteTest(id);
      deleteTest(id);
    } catch (error) {
      console.error("Failed to delete test:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-[28px] font-semibold text-[#1D2939]">Tests</h1>
          <p className="text-[#667085] mt-1">Manage and create your tests</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              console.log("🔄 Manual fetch of tests...");
              await fetchTests();
            }}
            className="flex items-center gap-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
          >
            Refresh
          </button>
          <button
            onClick={() => navigate("/create-test")}
            className="flex items-center gap-2 px-6 py-3 bg-[#5D7BF7] text-white rounded-xl hover:bg-[#4a66d4] transition-colors"
          >
            <FiPlus size={18} />
            Create New Test
          </button>
        </div>
      </div>
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 mb-6">
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

    <input
      type="text"
      placeholder="Search Test Name"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="h-11 border border-gray-200 rounded-lg px-4 outline-none focus:border-[#5D7BF7]"
    />

    <select
      value={subjectFilter}
      onChange={(e) => setSubjectFilter(e.target.value)}
      className="h-11 border border-gray-200 rounded-lg px-4 outline-none focus:border-[#5D7BF7]"
    >
      <option value="">All Subjects</option>
      {subjects.map((subject) => (
        <option key={subject.id} value={subject.name}>
          {subject.name}
        </option>
      ))}
    </select>

    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      className="h-11 border border-gray-200 rounded-lg px-4 outline-none focus:border-[#5D7BF7]"
    >
      <option value="">All Status</option>
      <option value="Published">Published</option>
      <option value="Draft">Draft</option>
    </select>

    <input
      type="date"
      value={dateFilter}
      onChange={(e) => setDateFilter(e.target.value)}
      className="h-11 border border-gray-200 rounded-lg px-4 outline-none focus:border-[#5D7BF7]"
    />

  </div>
</div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-[#667085] text-lg">Loading tests...</p>
        </div>
      ) : filteredTests.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-[#667085] text-lg mb-4">No tests created yet</p>
          <button
            onClick={() => navigate("/create-test")}
            className="px-6 py-2 bg-[#5D7BF7] text-white rounded-lg hover:bg-[#4a66d4] transition-colors"
          >
            Create Your First Test
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#F9FAFB]">
                  <th className="text-left px-6 py-4 text-[#667085] font-medium text-sm border-b border-[#E5E7EB]">Test Name</th>
                  <th className="text-left px-6 py-4 text-[#667085] font-medium text-sm border-b border-[#E5E7EB]">Subject</th>
                  <th className="text-left px-6 py-4 text-[#667085] font-medium text-sm border-b border-[#E5E7EB]">Status</th>
                  <th className="text-left px-6 py-4 text-[#667085] font-medium text-sm border-b border-[#E5E7EB]">Created Date</th>
                  <th className="text-left px-6 py-4 text-[#667085] font-medium text-sm border-b border-[#E5E7EB]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentTests.map((test) => (
                  <tr key={test.id} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="px-6 py-4 border-b border-[#E5E7EB]">
                      <p className="font-medium text-[#1D2939]">{test.name}</p>
                    </td>
                    <td className="px-6 py-4 border-b border-[#E5E7EB]">
                      <p className="text-[#344054]">{subjectNameMap[test.subject] || test.subject}</p>
                    </td>
                    <td className="px-6 py-4 border-b border-[#E5E7EB]">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        test.status === 'live' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {test.status === 'live' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-b border-[#E5E7EB]">
                      <p className="text-[#344054]">{formatDate(test.created_at || test.created_at || new Date().toISOString())}</p>
                    </td>
                    <td className="px-6 py-4 border-b border-[#E5E7EB]">
                      <div className="flex items-center gap-3">
                        <button 
                          className="p-2 text-[#667085] hover:text-[#5D7BF7] hover:bg-[#F3F6FF] rounded-lg transition-colors"
                          onClick={() => setEditingTest(test)}
                        >
                          <FiEdit size={18} />
                        </button>
                        <button 
                          className="p-2 text-[#667085] hover:text-[#5D7BF7] hover:bg-[#F3F6FF] rounded-lg transition-colors"
                          onClick={() => navigate(`/preview-publish/${test.id}`)}
                        >
                          <FiEye size={18} />
                        </button>
                        <button 
                          className="p-2 text-[#667085] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          onClick={() => handleDelete(test.id)}
                          disabled={deletingId === test.id}
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-[#667085]">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredTests.length)} of {filteredTests.length} tests
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-[#E5E7EB] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F9FAFB] transition-colors"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      currentPage === page
                        ? "bg-[#5D7BF7] text-white"
                        : "border border-[#E5E7EB] hover:bg-[#F9FAFB]"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-[#E5E7EB] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F9FAFB] transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {editingTest && (
        <EditTestModal
          test={editingTest}
          isOpen={!!editingTest}
          onClose={() => setEditingTest(null)}
        />
      )}
    </DashboardLayout>
  );
}
