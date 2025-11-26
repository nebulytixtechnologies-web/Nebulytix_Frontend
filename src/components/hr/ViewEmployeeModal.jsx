// src/components/hr/ViewEmployeeModal.jsx
import React, { useState, useEffect } from "react";
import EditEmployeeForm from "./EditEmployeeForm";

export default function ViewEmployeeModal({ employee, onClose, onUpdated }) {
  const [activeTab, setActiveTab] = useState("general");
  const [showEdit, setShowEdit] = useState(false);
  const [revealSensitive, setRevealSensitive] = useState(false);

  // 🚫 Disable background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  if (!employee) return null;

  const {
    firstName,
    lastName,
    email,
    mobile,
    cardNumber,
    jobRole,
    domain,
    gender,
    joiningDate,
    salary,
    daysPresent,
    paidLeaves,
    bankAccountNumber,
    ifscCode,
    bankName,
    pfNumber,
    panNumber,
    uanNumber,
    epsNumber,
    esiNumber,
    id,
    _id,
  } = employee;

  const empId = id ?? _id;

  // Masking function
  const mask = (value, visible = 4) => {
    if (!value) return "-";
    const s = String(value);
    if (revealSensitive) return s;
    if (s.length <= visible) return s;
    return "*".repeat(s.length - visible) + s.slice(-visible);
  };

  // Date formatting
  const fmtDate = (d) => {
    if (!d) return "-";
    try {
      const dt = new Date(d);
      return isNaN(dt) ? String(d) : dt.toLocaleDateString();
    } catch {
      return String(d);
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-[9999]
        flex items-center justify-center
        bg-black/50 backdrop-blur-sm
        px-4
      "
    >
      <div
        className="
          bg-white rounded-xl shadow-2xl
          w-full max-w-3xl 
          max-h-[90vh] overflow-y-auto
          p-6 relative
          border border-gray-200
        "
      >
        {/* Edit Overlay */}
        {showEdit && (
          <div className="absolute inset-0 bg-white z-50 overflow-auto p-4">
            <EditEmployeeForm
              employeeId={empId}
              employeeData={employee}
              onClose={() => setShowEdit(false)}
              onUpdated={(updatedEmployee) => {
                setShowEdit(false);
                onUpdated?.(updatedEmployee);
              }}
            />
          </div>
        )}

        {/* Title */}
        <h2 className="text-2xl font-bold text-sky-700 text-center mb-6">
          Employee Details
        </h2>

        {/* Tabs */}
        <div className="border-b mb-6">
          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab("general")}
              className={`px-5 py-2 font-medium rounded-t-md ${
                activeTab === "general"
                  ? "bg-white border border-b-0 shadow text-sky-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              General
            </button>

            <button
              onClick={() => setActiveTab("bank")}
              className={`px-5 py-2 font-medium rounded-t-md ${
                activeTab === "bank"
                  ? "bg-white border border-b-0 shadow text-indigo-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Bank
            </button>
          </div>
        </div>

        {/* TAB CONTENT */}
        <div className="min-h-[220px]">

          {/* ⭐ GENERAL TAB */}
          {activeTab === "general" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-gray-800">

              <div>
                <strong className="text-gray-600">Name:</strong>
                <div>{firstName} {lastName}</div>
              </div>

              <div>
                <strong className="text-gray-600">Email:</strong>
                <div>{email}</div>
              </div>

              <div>
                <strong className="text-gray-600">Mobile:</strong>
                <div>{mobile}</div>
              </div>

              <div>
                <strong className="text-gray-600">Card Number:</strong>
                <div>{cardNumber || "-"}</div>
              </div>

              <div>
                <strong className="text-gray-600">Job Role:</strong>
                <div>{jobRole || "-"}</div>
              </div>

              <div>
                <strong className="text-gray-600">Domain:</strong>
                <div>{domain || "-"}</div>
              </div>

              <div>
                <strong className="text-gray-600">Gender:</strong>
                <div>{gender || "-"}</div>
              </div>

              <div>
                <strong className="text-gray-600">Joining Date:</strong>
                <div>{fmtDate(joiningDate)}</div>
              </div>

              <div>
                <strong className="text-gray-600">Salary:</strong>
                <div>{salary != null ? `₹${salary}` : "-"}</div>
              </div>

              <div>
                <strong className="text-gray-600">Days Present:</strong>
                <div>{daysPresent}</div>
              </div>

              <div>
                <strong className="text-gray-600">Paid Leaves:</strong>
                <div>{paidLeaves}</div>
              </div>
            </div>
          )}

          {/* ⭐ BANK TAB */}
          {activeTab === "bank" && (
            <div className="space-y-3 text-gray-800">

              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Bank & Statutory Details</h3>

                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={revealSensitive}
                    onChange={() => setRevealSensitive((s) => !s)}
                    className="accent-sky-600"
                  />
                  Show Sensitive
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">

                <div>
                  <strong className="text-gray-600">Bank Name:</strong>
                  <div>{bankName || "-"}</div>
                </div>

                <div>
                  <strong className="text-gray-600">Account Number:</strong>
                  <div>{mask(bankAccountNumber)}</div>
                </div>

                <div>
                  <strong className="text-gray-600">IFSC Code:</strong>
                  <div>{ifscCode || "-"}</div>
                </div>

                <div>
                  <strong className="text-gray-600">PF Number:</strong>
                  <div>{pfNumber || "-"}</div>
                </div>

                <div>
                  <strong className="text-gray-600">UAN Number:</strong>
                  <div>{uanNumber || "-"}</div>
                </div>

                <div>
                  <strong className="text-gray-600">EPS Number:</strong>
                  <div>{epsNumber || "-"}</div>
                </div>

                <div>
                  <strong className="text-gray-600">ESI Number:</strong>
                  <div>{esiNumber || "-"}</div>
                </div>

                <div>
                  <strong className="text-gray-600">PAN Number:</strong>
                  <div>{mask(panNumber, 3)}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            className="px-5 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 shadow"
            onClick={() => setShowEdit(true)}
          >
            Edit
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 shadow"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
