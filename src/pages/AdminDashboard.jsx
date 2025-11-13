// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import EmployeeList from "../components/admin/EmployeeList";
import AddHrForm from "../components/admin/AddHrForm";
import TaskList from "../components/admin/TaskList";
import ViewTasksModal from "../components/admin/ViewTasksModal";
import profileLogo from "../assets/images/profileLogo.png";
import { Menu, UserPlus, FileText, LogOut } from "lucide-react";



export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
const [menuOpen, setMenuOpen] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [showAddHr, setShowAddHr] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedEmployeeForTasks, setSelectedEmployeeForTasks] =
    useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedTaskAllowSubmit, setSelectedTaskAllowSubmit] = useState(false);

  useEffect(() => {
    // Prefer admin passed via location.state (after login). Fallback to localStorage.
    if (location.state?.admin) {
      setAdmin(location.state.admin);
      try {
        localStorage.setItem(
          "neb_admin_info",
          JSON.stringify(location.state.admin)
        );
      } catch (e) {
        console.warn("Could not persist admin info to localStorage", e);
      }
    } else {
      const stored = localStorage.getItem("neb_admin_info");
      if (stored) {
        try {
          setAdmin(JSON.parse(stored));
        } catch (e) {
          console.warn("Failed to parse admin info from localStorage", e);
        }
      } else {
        // not logged in as admin -> redirect to admin login
        navigate("/login/admin");
      }
    }
  }, [location.state, navigate]);

  function triggerRefresh() {
    setRefreshKey((k) => k + 1);
  }

  function handleViewEmployeeTasks(employee) {
    setSelectedEmployeeForTasks(employee);
    setSelectedTask(null);
  }

  // Accept optional options param so TaskList can signal allowSubmit.
  // Backwards compatible: callers that pass only task still work.
  function handleViewTask(task, options = {}) {
    setSelectedTask(task);
    setSelectedTaskAllowSubmit(!!options.allowSubmit);
  }

  function closeTaskModal() {
    setSelectedTask(null);
    setSelectedTaskAllowSubmit(false);
  }

  function closeEmployeeTaskList() {
    setSelectedEmployeeForTasks(null);
  }

  function onClickAddHr() {
    setShowAddHr(true);
  }

  function onCloseAddHrForm() {
    setShowAddHr(false);
  }

  function onAddedHr() {
    setShowAddHr(false);
    triggerRefresh();
  }

  function handleLogout() {
    // clear auth and role info
    localStorage.removeItem("neb_token");
    localStorage.removeItem("neb_role");
    localStorage.removeItem("neb_admin_info");
    navigate("/");
  }

  return (
    <div className="container mx-auto px-4 py-8">
     {/* Header: Title + Profile + Actions */}
<div className="flex flex-col md:flex-row items-center justify-between mb-8 bg-sky-50 p-6 rounded-lg shadow-sm relative">

  {/* Left: Profile */}
  <div className="flex items-center gap-4 mb-4 md:mb-0">
    <img
      src={profileLogo || "/default-avatar.png"}
      alt="Admin avatar"
      className="w-14 h-14 rounded-full border-2 border-sky-300"
    />
    <div>
      <h1 className="text-2xl font-bold text-sky-700">Admin Dashboard</h1>
      <h2 className="text-xl font-semibold mt-1">
        {admin?.firstName || admin?.name || "Admin Name"}
      </h2>
      <p className="text-gray-600">{admin?.email || "admin@example.com"}</p>
      <p className="text-sm text-gray-500">
        Role: {admin?.loginRole || "admin"}
      </p>
    </div>
  </div>

  {/* Right: Hamburger Menu */}
<div className="relative">
  <button
    className="p-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
    onClick={() => setMenuOpen(prev => !prev)}
  >
    <Menu className="w-6 h-6" />
  </button>

  {/* Dropdown */}
  {menuOpen && (
    <div className="absolute right-0 mt-3 bg-white shadow-lg rounded-lg w-48 p-2 z-50">

      <button
        onClick={onClickAddHr}
        className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-sky-100 rounded"
      >
        <UserPlus size={18} className="text-sky-700" />
        Add HR
      </button>

      <button
        onClick={() => navigate('/admin/view-report')}
        className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-sky-100 rounded"
      >
        <FileText size={18} className="text-blue-700" />
        View Report
      </button>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-red-100 rounded text-red-600"
      >
        <LogOut size={18} />
        Logout
      </button>

    </div>
  )}
</div>

</div>


      {/* Employee List Section with distinct background */}
      {!selectedEmployeeForTasks && (
        <section className="mt-8 bg-teal-50 p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-sky-700 mb-4">
            Employee List
          </h3>
          <EmployeeList
            key={refreshKey}
            refreshKey={refreshKey}
            onActionComplete={triggerRefresh}
            onViewEmployeeTasks={handleViewEmployeeTasks}
          />
        </section>
      )}

      {/* Employee’s Tasks section with its own background */}
      {selectedEmployeeForTasks && (
        <section className="mt-10 bg-purple-50 p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-sky-700 mb-4">
            Tasks for{" "}
            {selectedEmployeeForTasks.firstName ||
              selectedEmployeeForTasks.email ||
              "Employee"}
          </h3>

          <button
            onClick={closeEmployeeTaskList}
            className="mb-4 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
          >
            ← Back to Employees
          </button>

          <TaskList
            employeeId={
              selectedEmployeeForTasks.id ?? selectedEmployeeForTasks._id
            }
            onViewTask={handleViewTask}
            onError={(msg) => {
              console.error("TaskList onError:", msg);
              alert(msg);
            }}
          />
        </section>
      )}

      {/* View Task Modal */}
      {selectedTask && (
        <ViewTasksModal
          task={selectedTask}
          onClose={closeTaskModal}
          allowSubmit={selectedTaskAllowSubmit}
          onReportSubmitted={() => {
            // refresh current task list or employee list as needed
            triggerRefresh();
          }}
        />
      )}

      {/* Add HR Modal */}
      {showAddHr && (
        <AddHrForm
          mode="admin"
          onClose={onCloseAddHrForm}
          onAdded={onAddedHr}
        />
      )}
    </div>
  );
}
