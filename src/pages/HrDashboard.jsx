import { useState } from "react";
import { useNavigate } from "react-router-dom";

import HrInfo from "../components/hr/HrInfo";
import AddHrForm from "../components/admin/AddHrForm";
import AddJobForm from "../components/hr/AddJobForm";
import JobList from "../components/hr/JobList";
import EmployeeList from "../components/hr/EmployeeList";

import axios from "axios";
import { BACKEND_BASE_URL } from "../api/config";

import {
  UserPlus,
  Briefcase,
  LogOut,
  FilePlus,
  FileText,
  Loader2,
  FileStack,
  Menu,
  X,
} from "lucide-react";

export default function HrDashboard() {
  const navigate = useNavigate();

  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showAddJob, setShowAddJob] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dailyReportOpen, setDailyReportOpen] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);

  const triggerRefresh = () => setRefreshKey((k) => k + 1);

  const handleLogout = () => {
    localStorage.removeItem("neb_hr_info");
    localStorage.removeItem("neb_token");
    localStorage.removeItem("neb_role");
    navigate("/");
  };

  const handleGenerateDailyReport = async () => {
    setLoadingReport(true);
    try {
      const res = await axios.post(`${BACKEND_BASE_URL}/hr/dailyReport/generate`);
      alert(res.data?.data ? "Daily report generated!" : "Failed to generate.");
    } catch (err) {
      alert("Error generating report: " + err.message);
    }
    setLoadingReport(false);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 h-full
          ${sidebarOpen ? "w-64" : "w-20"}
          bg-white border-r shadow-md
          transition-all duration-300
          overflow-y-auto
          z-20
        `}
      >
        <div className="flex items-center justify-between p-5 border-b">
          {sidebarOpen && <h2 className="text-xl font-semibold text-gray-800">HR Panel</h2>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded hover:bg-gray-100">
            {sidebarOpen ? <X /> : <Menu />}
          </button>
        </div>

        <nav className="p-4 space-y-2">

  {/* Add Employee */}
  <button onClick={() => setShowAddEmployee(true)} className="nav-btn">
    <UserPlus className="icon text-sky-600" />
    {sidebarOpen && "Add Employee"}
  </button>

  {/* Add Job */}
  <button onClick={() => setShowAddJob(true)} className="nav-btn">
    <Briefcase className="icon text-purple-600" />
    {sidebarOpen && "Add Job"}
  </button>

  {/* Daily Report */}
  <button onClick={() => setDailyReportOpen(!dailyReportOpen)} className="nav-btn justify-between">
    <span className="flex items-center gap-3">
      <FileStack className="icon text-blue-600" />
      {sidebarOpen && "Daily Report"}
    </span>
    {sidebarOpen && (
      <span className="text-xs text-gray-600">{dailyReportOpen ? "▲" : "▼"}</span>
    )}
  </button>

  {sidebarOpen && dailyReportOpen && (
    <div className="ml-10 mt-2 space-y-2">
      <button onClick={handleGenerateDailyReport} disabled={loadingReport} className="sub-nav-btn">
        {loadingReport ? (
          <Loader2 className="animate-spin w-4 h-4 text-green-600" />
        ) : (
          <FilePlus className="w-4 h-4 text-green-600" />
        )}
        {loadingReport ? "Generating..." : "Generate"}
      </button>

      <button onClick={() => navigate("/view-daily-report")} className="sub-nav-btn">
        <FileText className="w-4 h-4 text-purple-600" />
        View Reports
      </button>
    </div>
  )}

  {/* Logout */}
  <button onClick={handleLogout} className="nav-btn text-red-600 hover:bg-red-50">
    <LogOut className="icon text-red-600" />
    {sidebarOpen && "Logout"}
  </button>

</nav>

      </aside>

      {/* MAIN CONTENT */}
      <main
        className={`
          flex-1 min-h-screen
          transition-all duration-300
          ${sidebarOpen ? "ml-64" : "ml-20"}
        `}
      >
        <div className="max-w-6xl mx-auto p-10">

          <h1 className="text-3xl font-bold text-sky-700 mb-10">HR Dashboard</h1>

          {/* HR Info */}
          <div className="card mb-10">
            <HrInfo role="hr" refreshKey={refreshKey} />
          </div>

          {/* Employees */}
          <div className="card mb-10">
            <h2 className="section-title"></h2>
            <EmployeeList refreshKey={refreshKey} onActionComplete={triggerRefresh} />
          </div>

          {/* Jobs */}
          <div className="card mb-10">
            <h2 className="section-title">Job Posts</h2>
            <JobList refreshKey={refreshKey} />
          </div>
        </div>
      </main>

      {/* MODALS */}
      {showAddEmployee && (
        <AddHrForm
          mode="hr"
          onClose={() => setShowAddEmployee(false)}
          onAdded={() => {
            setShowAddEmployee(false);
            triggerRefresh();
          }}
        />
      )}

      {showAddJob && (
        <AddJobForm
          onClose={() => setShowAddJob(false)}
          onAdded={() => {
            setShowAddJob(false);
            triggerRefresh();
          }}
        />
      )}
    </div>
  );
}
