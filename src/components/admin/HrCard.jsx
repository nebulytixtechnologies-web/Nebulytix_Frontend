// Nebulytix_Frontend/src/components/hr/HrCard.jsx
import { useState, useRef, useEffect } from "react";
import ViewEmployeeModal from "../hr/ViewEmployeeModal";
import AttendanceForm from "../hr/AttendanceForm";
import PayslipListModalHR from "../hr/PayslipListModalHR";
import GeneratePayslipModal from "../hr/GeneratePayslipModal";
import axios from "axios";
import { BACKEND_BASE_URL } from "../../api/config";

// Lucide Icons
import { MoreVertical, Eye, Trash2, ClipboardList, CalendarCheck, FilePlus2 } from "lucide-react";

export default function HrCard({ hr, onActionComplete, deleteUrl }) {
  const hrId = hr.id;

  const [showView, setShowView] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  const [showPayslips, setShowPayslips] = useState(false);
  const [showPayslipGenerator, setShowPayslipGenerator] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const menuRef = useRef();


  // Close menu if clicked outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this HR?")) return;

    setDeleting(true);
    try {
      await axios.delete(deleteUrl || `${BACKEND_BASE_URL}/admin/deleteHr/${hrId}`);
      onActionComplete?.();
    } catch (err) {
      console.error(err);
      alert("Failed to delete HR.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="p-4 border rounded-xl bg-white flex flex-col md:flex-row md:items-center justify-between shadow-sm hover:shadow-md transition-shadow duration-200">
        {/* HR Info */}
        <div className="flex flex-col">
          <div className="font-semibold text-lg text-gray-900">
            {hr.firstName} {hr.lastName}
          </div>
          <div className="text-sm text-gray-600">{hr.email}</div>
          {hr.cardNumber && <div className="text-sm text-gray-500">Card No: {hr.cardNumber}</div>}
        </div>

        {/* Hamburger Menu */}
        <div className="relative mt-3 md:mt-0" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition shadow-sm"
          >
            <MoreVertical className="w-5 h-5 text-gray-700" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-3 w-60 bg-white border border-gray-200 shadow-xl rounded-xl py-2 z-50 animate-fade-in">
              {/* VIEW DETAILS */}
              <button
                onClick={() => { setShowView(true); setMenuOpen(false); }}
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-gray-800 w-full text-left"
              >
                <Eye className="w-5 h-5 text-sky-600" />
                View Details
              </button>

              {/* ADD ATTENDANCE */}
              <button
                onClick={() => { setShowAttendance(true); setMenuOpen(false); }}
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-gray-800 w-full text-left"
              >
                <CalendarCheck className="w-5 h-5 text-emerald-600" />
                Add Attendance
              </button>

              {/* PAYSLIPS LIST */}
              <button
                onClick={() => { setShowPayslips(true); setMenuOpen(false); }}
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-gray-800 w-full text-left"
              >
                <ClipboardList className="w-5 h-5 text-gray-700" />
                Payslips
              </button>

              {/* GENERATE PAYSLIP */}
              <button
                onClick={() => { setShowPayslipGenerator(true); setMenuOpen(false); }}
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-gray-800 w-full text-left"
              >
                <FilePlus2 className="w-5 h-5 text-orange-500" />
                Generate Payslip
              </button>

              {/* DELETE HR */}
              <button
                onClick={handleDelete}
                className="flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-red-600 w-full text-left"
              >
                <Trash2 className="w-5 h-5" />
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}
      {showView && (
        <ViewEmployeeModal
          employee={hr}
          onClose={() => setShowView(false)}
          onUpdated={onActionComplete}
        />
      )}

      {showAttendance && (
        <AttendanceForm
          employee={hr}
          onClose={() => setShowAttendance(false)}
          onAdded={onActionComplete}
        />
      )}

      {showPayslips && (
        <PayslipListModalHR
          employee={hr}
          onClose={() => setShowPayslips(false)}
        />
      )}

      {showPayslipGenerator && (
        <GeneratePayslipModal
          employeeId={hr.id}
          onClose={() => setShowPayslipGenerator(false)}
          onGenerated={onActionComplete}
        />
      )}
    </>
  );
}
