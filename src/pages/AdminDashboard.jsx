
// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import HrInfo from "../components/hr/HrInfo";
import AddHrForm from "../components/admin/AddHrForm";
import EmployeeList from "../components/admin/EmployeeList";
import HrList from "../components/admin/HrList";


import profileLogo from "../assets/images/profileLogo.png";
import { BACKEND_BASE_URL } from "../api/config";
import axios from "axios";

import {
  UserPlus,
  Users,
  FileStack,
  LogOut,
  Menu,
  X,
  Loader2,
  FileText,
  FilePlus
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
const [showDailyReport, setShowDailyReport] = useState(false);

  const [admin, setAdmin] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAddHr, setShowAddHr] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const [dailyReportOpen, setDailyReportOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState("ALL");

  const triggerRefresh = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    const stored = localStorage.getItem("neb_admin_info");
    if (!stored) return navigate("/admin-login");
    setAdmin(JSON.parse(stored));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("neb_token");
    localStorage.removeItem("neb_role");
    localStorage.removeItem("neb_admin_info");
    navigate("/");
  };

  const handleGenerateReport = async () => {
    setLoadingReport(true);
    try {
      const res = await axios.get(`${BACKEND_BASE_URL}/admin/reports/daily`);
      alert(res.data?.message || "Report generation success!");
    } catch (err) {
      alert("Failed to generate report");
    }
    setLoadingReport(false);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full ${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white border-r shadow-md transition-all duration-300 p-4`}
      >
        <div className="flex items-center justify-between">
          {sidebarOpen && (
            <h2 className="text-xl font-semibold text-sky-700">Admin Panel</h2>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X /> : <Menu />}
          </button>
        </div>

        <nav className="mt-6 space-y-3">

          {/* Add HR */}
          <button className="nav-btn" onClick={() => setShowAddHr(true)}>
            <UserPlus className="icon text-green-600" />
            {sidebarOpen && "Add HR"}
          </button>

          {/* View Employees */}
          <button className="nav-btn">
            <Users className="icon text-purple-600" />
            {sidebarOpen && "Employees"}
          </button>

          {/* Daily Reports
          <button className="nav-btn" onClick={handleGenerateReport}>
            {loadingReport ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              <FileStack className="icon text-blue-600" />
            )}
            {sidebarOpen && "Generate Report"}
          </button>

          {/* View Reports */}
          {/* <button className="nav-btn" onClick={() => navigate("/admin/view-report")}>
            <FileText className="icon text-sky-600" />
            {sidebarOpen && "View Reports"}
          </button> */} 

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
      <button onClick={handleGenerateReport} disabled={loadingReport} className="sub-nav-btn">
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

      {/* Main content */}
      <main
        className={`flex-1 min-h-screen transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <div className="max-w-7xl mx-auto p-10">
          <h1 className="text-3xl font-bold text-sky-700 mb-10">
            Admin Dashboard
          </h1>

          {/* Admin Info Section */}
          <div className="card mb-10">
            <HrInfo role="admin" refreshKey={refreshKey} />
          </div>

<div className="card mb-10">
  <h2 className="text-xl font-semibold mb-3 text-sky-800">
    HR List
  </h2>

  <HrList onActionComplete={triggerRefresh} />
</div>

          {/* Employee List */}
          <div className="card mb-10">
            <h2 className="text-xl font-semibold mb-3 text-sky-800">Employee List</h2>

            <EmployeeList 
            refreshKey={refreshKey} 
            onActionComplete={triggerRefresh}
            roleFilter={roleFilter} //passing filter to employeeList
             />
          </div>

        </div>
      </main>

      {/* Add HR Popup */}
      {showAddHr && (
        <AddHrForm
          mode="admin"
          onClose={() => setShowAddHr(false)}
          onAdded={() => {
            setShowAddHr(false);
            triggerRefresh();
          }}
        />
      )}
    </div>
  );
}
