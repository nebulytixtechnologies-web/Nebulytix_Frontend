import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import HrInfo from "../components/hr/HrInfo";
import AddHrForm from "../components/admin/AddHrForm";
import AddJobForm from "../components/hr/AddJobForm";
import JobList from "../components/hr/JobList";
import EmployeeList from "../components/hr/EmployeeList";

import axios from "axios";
import { BACKEND_BASE_URL } from "../api/config";

// Icons
import {
  Menu,
  UserPlus,
  Briefcase,
  LogOut,
  FilePlus,
  FileText,
  Loader2,
  FileStack,
} from "lucide-react";

export default function HrDashboard() {
  const navigate = useNavigate();

  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showAddJob, setShowAddJob] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dailyReportOpen, setDailyReportOpen] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);

  const menuRef = useRef(); // for outside click

  const triggerRefresh = () => setRefreshKey((k) => k + 1);

  const handleLogout = () => {
    localStorage.removeItem("neb_hr_info");
    localStorage.removeItem("neb_token");
    localStorage.removeItem("neb_role");
    navigate("/");
  };

  // ⭐ Close BOTH menu & report accordion when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
        setDailyReportOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // ⭐ Generate Daily Report
  const handleGenerateDailyReport = async () => {
    setLoadingReport(true);

    try {
      const res = await axios.post(
        `${BACKEND_BASE_URL}/hr/dailyReport/generate`
      );

      if (res.data?.data) {
        alert("Daily report generated successfully!");
      } else {
        alert(res.data.message || "Failed to generate report.");
      }
    } catch (err) {
      alert("Error generating report: " + err.message);
    }

    setLoadingReport(false);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold text-center text-sky-700 mb-4">
        HR Dashboard
      </h1>

      {/* TOP SECTION */}
      <div className="bg-sky-100 rounded-lg p-6 shadow relative">
        <div className="flex items-start justify-between w-full">
          {/* HR INFO */}
          <div className="flex-1 whitespace-pre-line">
            <HrInfo role="hr" refreshKey={refreshKey} />
          </div>

          {/* HAMBURGER MENU */}
          <div className="relative ml-4" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="p-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition shadow"
            >
              <Menu className="w-6 h-6" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-200 shadow-xl rounded-xl p-2 z-50 animate-fade-in">
                {/* ADD EMPLOYEE */}
                <button
                  onClick={() => {
                    setShowAddEmployee(true);
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-sky-50 rounded-lg transition"
                >
                  <UserPlus size={18} className="text-sky-700" />
                  Add Employee
                </button>

                {/* ADD JOB */}
                <button
                  onClick={() => {
                    setShowAddJob(true);
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-sky-50 rounded-lg transition"
                >
                  <Briefcase size={18} className="text-purple-700" />
                  Add Job
                </button>

                {/* DAILY REPORT ACCORDION */}
                <button
                  onClick={() => setDailyReportOpen((prev) => !prev)}
                  className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-100 rounded-lg transition"
                >
                  <span className="flex items-center gap-3">
                    <FileStack size={18} className="text-blue-700" />
                    Daily Report
                  </span>
                  <span className="text-sm">{dailyReportOpen ? "▲" : "▼"}</span>
                </button>

                {/* ACCORDION CONTENT */}
                {dailyReportOpen && (
                  <div className="ml-6 mt-2 space-y-2">
                    {/* Generate Report */}
                    <button
                      onClick={handleGenerateDailyReport}
                      disabled={loadingReport}
                      className="flex items-center gap-3 w-full px-3 py-2 text-left rounded-lg hover:bg-gray-50 transition text-sm"
                    >
                      {loadingReport ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <FilePlus size={16} className="text-green-600" />
                      )}
                      {loadingReport ? "Generating..." : "Generate Report"}
                    </button>

                    {/* View Reports */}
                    <button
                      onClick={() => {
                        navigate("/view-daily-report");
                        setMenuOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2 text-left rounded-lg hover:bg-gray-50 transition text-sm"
                    >
                      <FileText size={16} className="text-purple-600" />
                      View Reports
                    </button>
                  </div>
                )}

                {/* LOGOUT */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-red-50 rounded-lg text-red-600 transition mt-2"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* EMPLOYEE LIST */}
      <div className="bg-green-50 rounded-lg p-6 shadow">
        <h2 className="text-2xl font-bold text-green-700 mb-4">Employee List</h2>
        <EmployeeList
          refreshKey={refreshKey}
          onActionComplete={triggerRefresh}
        />
      </div>

      {/* JOB LIST */}
      <div className="bg-purple-50 rounded-lg p-6 shadow">
        <h2 className="text-2xl font-bold text-purple-700 mb-4">
          Posted Job List
        </h2>
        <JobList refreshKey={refreshKey} />
      </div>

      {/* ADD EMPLOYEE MODAL */}
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

      {/* ADD JOB MODAL */}
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
