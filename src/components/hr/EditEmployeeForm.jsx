import { useState } from "react";
import { BACKEND_BASE_URL } from "../../api/config";

export default function EditEmployeeForm({
  employeeId,
  employeeData,
  onClose,
  onUpdated,
}) {
  const [form, setForm] = useState({
    firstName: employeeData.firstName || "",
    lastName: employeeData.lastName || "",
    email: employeeData.email || "",
    mobile: employeeData.mobile || "",
    cardNumber: employeeData.cardNumber || "",
    jobRole: employeeData.jobRole || "",
    domain: employeeData.domain || "",
    gender: employeeData.gender || "",
    salary: employeeData.salary || "",
    paidLeaves: employeeData.paidLeaves || "",

    // 🆕 Bank Details
    bankName: employeeData.bankName || "",
    bankAccountNumber: employeeData.bankAccountNumber || "",
    ifscCode: employeeData.ifscCode || "",

    // 🆕 Statutory Details
    pfNumber: employeeData.pfNumber || "",
    uanNumber: employeeData.uanNumber || "",
    epsNumber: employeeData.epsNumber || "",
    esiNumber: employeeData.esiNumber || "",
    panNumber: employeeData.panNumber || "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/hr/update/${employeeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await res.json();
      if (!res.ok) {
        alert(result.message || "Update failed");
        return;
      }

      alert("Employee updated successfully");
      onUpdated?.(result.data);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg relative">
        <div className="max-h-[85vh] overflow-y-auto p-6">

          <h2 className="text-2xl font-semibold text-center text-sky-700 mb-6">
            Edit Employee Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input name="firstName" value={form.firstName} onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-400 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input name="lastName" value={form.lastName} onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-400 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-400 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <input name="mobile" value={form.mobile} onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-400 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
              <input name="cardNumber" value={form.cardNumber} onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-400 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Role</label>
              <input name="jobRole" value={form.jobRole} onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-400 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
              <input name="domain" value={form.domain} onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-400 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-400 outline-none">
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary (₹)</label>
              <input type="number" name="salary" value={form.salary} onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-400 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Paid Leaves</label>
              <input type="number" name="paidLeaves" value={form.paidLeaves} onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-400 outline-none" />
            </div>

            {/* ---------------- BANK DETAILS ---------------- */}
            <h3 className="text-lg font-semibold text-sky-700 pt-4">Bank Details</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
              <input name="bankName" value={form.bankName} onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-400 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
              <input name="bankAccountNumber" value={form.bankAccountNumber} onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-400 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
              <input name="ifscCode" value={form.ifscCode} onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-400 outline-none" />
            </div>

            {/* ---------------- STATUTORY DETAILS ---------------- */}
            <h3 className="text-lg font-semibold text-sky-700 pt-4">Statutory Details</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PF Number</label>
              <input name="pfNumber" value={form.pfNumber} onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-400 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">UAN Number</label>
              <input name="uanNumber" value={form.uanNumber} onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-400 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">EPS Number</label>
              <input name="epsNumber" value={form.epsNumber} onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-400 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ESI Number</label>
              <input name="esiNumber" value={form.esiNumber} onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-400 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
              <input name="panNumber" value={form.panNumber} onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-400 outline-none" />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={onClose}
                type="button"
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-md"
              >
                Save Changes
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
