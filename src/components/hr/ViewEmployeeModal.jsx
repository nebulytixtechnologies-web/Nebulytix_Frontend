// src/components/hr/ViewEmployeeModal.jsx
import React, { useState } from "react";
import EditEmployeeForm from "./EditEmployeeForm";

export default function ViewEmployeeModal({ employee, onClose, onUpdated }) {
  const [activeTab, setActiveTab] = useState("general"); // "general" | "bank"
  const [showEdit, setShowEdit] = useState(false);
  const [revealSensitive, setRevealSensitive] = useState(false);

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

  const mask = (value, visible = 4) => {
    if (!value) return "-";
    const s = String(value);
    if (revealSensitive) return s;
    if (s.length <= visible) return s;
    return "*".repeat(s.length - visible) + s.slice(-visible);
  };

  const fmtDate = (d) => {
    if (!d) return "-";
    try {
      const dt = new Date(d);
      if (isNaN(dt)) return String(d);
      return dt.toLocaleDateString();
    } catch {
      return String(d);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
          {/* Edit overlay (full modal overlay inside modal) */}
          {showEdit && (
            <div className="absolute inset-0 bg-white z-40 p-4 overflow-auto">
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

          <h2 className="text-xl font-bold text-sky-700 mb-4 text-center">
            Employee Details
          </h2>

          {/* Tabs */}
          <div className="mb-4 border-b">
            <nav className="-mb-px flex gap-2" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("general")}
                className={`px-4 py-2 rounded-t-md ${
                  activeTab === "general"
                    ? "bg-white border border-b-0 shadow-sm text-sky-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                General
              </button>

              <button
                onClick={() => setActiveTab("bank")}
                className={`px-4 py-2 rounded-t-md ${
                  activeTab === "bank"
                    ? "bg-white border border-b-0 shadow-sm text-indigo-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                Bank
              </button>
            </nav>
          </div>

          {/* Tab contents */}
          <div className="min-h-[160px]">
            {activeTab === "general" && (
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>Name:</strong> {firstName} {lastName}
                </p>
                <p>
                  <strong>Email:</strong> {email}
                </p>
                <p>
                  <strong>Mobile:</strong> {mobile}
                </p>
                <p>
                  <strong>Card Number:</strong> {cardNumber || "-"}
                </p>
                <p>
                  <strong>Job Role:</strong> {jobRole || "-"}
                </p>
                <p>
                  <strong>Domain:</strong> {domain || "-"}
                </p>
                <p>
                  <strong>Gender:</strong> {gender || "-"}
                </p>
                <p>
                  <strong>Joining Date:</strong> {fmtDate(joiningDate)}
                </p>
                <p>
                  <strong>Salary:</strong> {salary != null ? `₹${salary}` : "-"}

                </p>
                <p>
                  <strong>Days Present:</strong> {daysPresent}
                </p>
                <p>
                  <strong>Paid Leaves:</strong> {paidLeaves}
                </p>
              </div>
            )}

            {activeTab === "bank" && (
              <div className="space-y-2 text-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">
                    Bank & Statutory Details
                  </h3>

                  <div className="flex items-center gap-2 text-sm">
                    <label className="flex items-center gap-1 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={revealSensitive}
                        onChange={() => setRevealSensitive((s) => !s)}
                        className="inline-block accent-sky-600"
                      />
                      <span>Show sensitive</span>
                    </label>
                  </div>
                </div>

                <p>
                  <strong>Bank Name:</strong> {bankName || "-"}
                </p>
                <p>
                  <strong>Account Number:</strong> {mask(bankAccountNumber)}
                </p>
                <p>
                  <strong>IFSC Code:</strong> {ifscCode || "-"}
                </p>
                <hr className="my-2" />
                <p>
                  <strong>PF Number:</strong> {pfNumber || "-"}
                </p>
                <p>
                  <strong>UAN Number:</strong> {uanNumber || "-"}
                </p>
                <p>
                  <strong>EPS Number:</strong> {epsNumber || "-"}
                </p>
                <p>
                  <strong>ESI Number:</strong> {esiNumber || "-"}
                </p>
                <hr className="my-2" />
                <p>
                  <strong>PAN Number:</strong> {mask(panNumber, 3)}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              onClick={() => setShowEdit(true)}
            >
              Edit
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}