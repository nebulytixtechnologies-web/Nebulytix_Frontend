import {useState } from "react";
import ViewEmployeeModal from "./ViewEmployeeModal";
import AttendanceForm from "./AttendanceForm";
import PayslipListModal from "./PayslipListModal";
import GeneratePayslipModal from "./GeneratePayslipModal"; // ⬅ added
import axios from "axios";
import { BACKEND_BASE_URL } from "../../api/config";
import { Menu, X } from "lucide-react";

export default function EmployeeCard({ employee, onActionComplete }) {
  const empId = employee.id;
  const [showView, setShowView] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  const [showPayslips, setShowPayslips] = useState(false);
  const [showPayslipGenerator, setShowPayslipGenerator] = useState(false); // ⬅ added
  const [deleting, setDeleting] = useState(false);
  const [menuOpen, setmenuOpen] = useState(false);

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;
    setDeleting(true);
    try {
      await axios.delete(`${BACKEND_BASE_URL}/hr/delete/${empId}`);
      onActionComplete?.();
    } catch (err) {
      console.error(err);
      alert("Failed to delete employee.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="p-4 border rounded bg-white flex flex-col md:flex-row md:items-center justify-between shadow-sm">

        {/* Employee Info */}
        <div className="flex flex-col">
          <div className="font-semibold text-lg text-gray-800">
            {employee.firstName} {employee.lastName}
          </div>
          <div className="text-sm text-gray-600">{employee.email}</div>
          <div className="text-sm text-gray-500">
            Card No: {employee.cardNumber}
          </div>
        </div>

        {/* Hamburger menu */}
        <div className="relative mt-3 md:mt-0">
          <button
            onClick={() => setmenuOpen((prev => !prev))}
            className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition shadow"
            >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" /> }
            </button>
        

        {/* Dropdown */}
        {menuOpen &&(
        <div className="absolute right-0 mt-3 w-56 bg-white border-gray-200 shadow-lg rounded-lg p-3 flex flex-col gap-3 z-50">
          {/* ✅ Generate Payslip Button Updated */}
          <button 
            onClick={() => setShowPayslipGenerator(true)}
            className="px-3 py-1 bg-orange-300 text-white rounded"
          >
            Generate Payslips
          </button>

          <button
            onClick={() => setShowView(true)}
            className="px-3 py-1 bg-sky-600 text-white rounded"
          >
            View Details
          </button>

          <button
            onClick={() => setShowAttendance(true)}
            className="px-3 py-1 bg-emerald-600 text-white rounded"
          >
            Add Attendance
          </button>

          <button
            onClick={() => setShowPayslips(true)}
            className="px-3 py-1 bg-gray-700 text-white rounded"
          >
            Payslips
          </button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-3 py-1 bg-red-600 text-white rounded"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>

        </div>
        )}
      </div>
      </div>

      {showView && (
        <ViewEmployeeModal
          employee={employee}
          onClose={() => setShowView(false)}
          onUpdated={onActionComplete}
        />
      )}

      {showAttendance && (
        <AttendanceForm
          employee={employee}
          onClose={() => setShowAttendance(false)}
          onAdded={onActionComplete}
        />
      )}

      {showPayslips && (
        <PayslipListModal
          employee={employee}
          onClose={() => setShowPayslips(false)}
        />
      )}

      {/* ✅ NEW PAYSILP MODAL */}
      {showPayslipGenerator && (
        <GeneratePayslipModal
          employeeId={employee.id}
          onClose={() => setShowPayslipGenerator(false)}
          onGenerated={onActionComplete}
        />
      )}
    </>
  );
}
