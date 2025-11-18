import { useState } from "react";
import EditEmployeeForm from "./EditEmployeeForm";

export default function ViewEmployeeModal({ employee, onClose, onUpdated }) {
  const [showEdit, setShowEdit] = useState(false);

  if (!employee) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-3 relative">

        {/* Edit Popup */}
        {showEdit && (
          <EditEmployeeForm
            employeeId={employee.id ?? employee._id}
            employeeData={employee}
            onClose={() => setShowEdit(false)}
            onUpdated={(updatedEmployee) => {
              setShowEdit(false);
              onUpdated?.(updatedEmployee); // send updated record to parent
            }}
          />
        )}

        <h2 className="text-xl font-bold text-sky-700 mb-2 text-center">
          Employee Details
        </h2>

        <div className="space-y-2 text-gray-700">
          <p><strong>Name:</strong> {employee.firstName} {employee.lastName}</p>
          <p><strong>Email:</strong> {employee.email}</p>
          <p><strong>Mobile:</strong> {employee.mobile}</p>
          <p><strong>Card Number:</strong> {employee.cardNumber}</p>
          <p><strong>Job Role:</strong> {employee.jobRole}</p>
          <p><strong>Domain:</strong> {employee.domain}</p>
          <p><strong>Gender:</strong> {employee.gender}</p>
          <p><strong>Joining Date:</strong> {employee.joiningDate}</p>
          <p><strong>Salary:</strong> ₹{employee.salary}</p>
          <p><strong>Days Present:</strong> {employee.daysPresent}</p>
          <p><strong>Paid Leaves:</strong> {employee.paidLeaves}</p>
        </div>

        <div className="flex justify-end gap-3 mt-4">
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
  );
}
