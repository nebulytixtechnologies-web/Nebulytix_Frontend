// src/pages/EmployeeDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import HrInfo from "../components/hr/HrInfo";
import TaskList from "../components/admin/TaskList";
import ViewTasksModal from "../components/admin/ViewTasksModal";
import PayslipListModal from "../components/hr/PayslipListModal";
import HolidayModal from "../components/hr/HolidayModal";

import axios from "axios";
import { BACKEND_BASE_URL } from "../api/config";

import {
  FileText,
  Menu,
  X,
  LogOut,
  Calendar,
} from "lucide-react";

export default function EmployeeDashboard() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedTaskAllowSubmit, setSelectedTaskAllowSubmit] = useState(false);
  const [employee, setEmployee] = useState(null);

  // Daily report popup
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [reportText, setReportText] = useState("");
  const [reportDate, setReportDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [showPayslips, setShowPayslips] = useState(false);
  const [showHolidays, setShowHolidays] = useState(false);

  useEffect(() => {
    const stored =
      localStorage.getItem("neb_employee_info") ||
      localStorage.getItem("neb_user_info") ||
      localStorage.getItem("neb_user");

    if (stored) {
      try {
        setEmployee(JSON.parse(stored));
      } catch {
        setEmployee(null);
      }
    }
  }, []);

  function handleViewTask(task, options) {
    setSelectedTask(task);
    setSelectedTaskAllowSubmit(!!options?.allowSubmit);
  }

  function closeTaskModal() {
    setSelectedTask(null);
    setSelectedTaskAllowSubmit(false);
  }

  async function handleSubmitTodayReport() {
    if (!reportText.trim()) {
      alert("Please write your report before submitting.");
      return;
    }

    if (!employee || !employee.id) {
      alert("Employee information not found!");
      return;
    }

    try {
      const payload = {
        employee_id: employee.id,
        reportDate,
        summary: reportText.trim(),
      };

      const response = await axios.post(
        `${BACKEND_BASE_URL}/employee/dailyReport/submit`,
        payload
      );

      alert(response?.data?.data || "Report submitted successfully!");

      setReportText("");
      setShowReportPopup(false);
      setRefreshKey((k) => k + 1);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit report.");
    }
  }

  function handleLogout() {
    localStorage.clear();
    navigate("/login/employee");
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-full ${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white border-r shadow-md transition-all duration-300 z-20`}
      >
        <div className="flex items-center justify-between p-5 border-b">
          {sidebarOpen && (
            <h2 className="text-xl font-semibold text-gray-800">
              Employee Panel
            </h2>
          )}

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded hover:bg-gray-100"
          >
            {sidebarOpen ? <X /> : <Menu />}
          </button>
        </div>

        <nav className="p-4 space-y-2">

          {/* Daily Report */}
          <button
            onClick={() => setShowReportPopup(true)}
            className="nav-btn"
          >
            <FileText className="icon text-blue-600" />
            {sidebarOpen && "Daily Report"}
          </button>

          {/* Payslips */}
          <button
            onClick={() => setShowPayslips(true)}
            className="nav-btn"
          >
            <FileText className="icon text-purple-600" />
            {sidebarOpen && "View Payslips"}
          </button>

          {/* Holidays */}
          <button
            onClick={() => setShowHolidays(true)}
            className="nav-btn"
          >
            <Calendar className="icon text-green-600" />
            {sidebarOpen && "Holidays"}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="nav-btn text-red-600 hover:bg-red-50"
          >
            <LogOut className="icon text-red-600" />
            {sidebarOpen && "Logout"}
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main
        className={`flex-1 min-h-screen transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <div className="max-w-6xl mx-auto p-10">

          <h1 className="text-3xl font-bold text-sky-700 mb-10">
            Employee Dashboard
          </h1>

          {/* Employee Info */}
          <div className="card mb-10">
            <HrInfo role="employee" refreshKey={refreshKey} />
          </div>

          {/* Task List */}
          <div className="card mb-10 p-6">
            <h2 className="text-2xl font-semibold mb-4">
              Task List
            </h2>

            <TaskList
              employeeId={employee?.id ?? employee?._id}
              onViewTask={handleViewTask}
              onError={(msg) => console.error(msg)}
            />
          </div>
        </div>
      </main>

      {/* TASK MODAL */}
      {selectedTask && (
        <ViewTasksModal
          task={selectedTask}
          onClose={closeTaskModal}
          allowSubmit={selectedTaskAllowSubmit}
          onReportSubmitted={() => setRefreshKey((k) => k + 1)}
        />
      )}

      {/* PAYSLIP MODAL */}
      {showPayslips && (
        <PayslipListModal
          employee={employee}
          onClose={() => setShowPayslips(false)}
        />
      )}

      {/* HOLIDAY MODAL */}
      {showHolidays && (
        <HolidayModal onClose={() => setShowHolidays(false)} />
      )}

      {/* DAILY REPORT POPUP */}
     {showReportPopup && (
  <div
    className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm"
    onClick={() => setShowReportPopup(false)}  // CLOSE WHEN CLICKED OUTSIDE
  >
    <div
      className="bg-white w-[600px] rounded-xl shadow-xl p-7 animate-fadeIn"
      onClick={(e) => e.stopPropagation()}  // PREVENT INNER CLICK FROM CLOSING
    >

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Submit Daily Report</h2>
              <X className="cursor-pointer" onClick={() => setShowReportPopup(false)} />
            </div>

            {/* Date */}
            <label className="font-semibold text-gray-700">Select Date:</label>
            <input
              type="date"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              className="w-full mt-1 mb-4 p-2 border rounded-lg"
            />

            {/* Textarea */}
            <textarea
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              placeholder="Write your daily report..."
              className="w-full h-48 p-4 border rounded-lg"
            />

            {/* Submit */}
            <button
              className="mt-5 w-full py-3 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700"
              onClick={handleSubmitTodayReport}
            >
              Submit Report
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
