// src/components/admin/AddHrForm.jsx
import { useState } from "react";
import axios from "axios";
import { BACKEND_BASE_URL } from "../../api/config";

/**
 * Two-page modal form (5 fields left / 5 fields right per page)
 *
 * Props:
 * - mode: "admin" | "hr" (defaults to "admin")
 * - onClose()
 * - onAdded()
 */
export default function AddHrForm({ mode = "admin", onClose, onAdded }) {
  const [form, setForm] = useState({
    // Page 1 (first 10 fields)
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    cardNumber: "",
    jobRole: "",
    domain: "",
    gender: "",
    joiningDate: "",
    salary: "",
    // Page 2 (next 10 fields)
    daysPresent: "",
    paidLeaves: "",
    password: "",
    bankAccountNumber: "",
    bankName: "",
    pfNumber: "",
    panNumber: "",
    uanNumber: "",
    epsNumber: "",
    esiNumber: "",
  });

  const [step, setStep] = useState(1); // 1 or 2
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const isAdmin = mode === "admin";
  const title = isAdmin ? "Add HR" : "Add Employee";
  const submitButtonText = isAdmin ? "Add HR" : "Add Employee";

  function handleInput(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function validateStep1() {
    if (!form.firstName.trim()) {
      setMessage({ type: "error", text: "First Name is required." });
      return false;
    }
    if (!form.email.trim()) {
      setMessage({ type: "error", text: "Email is required." });
      return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.email && !emailPattern.test(form.email)) {
      setMessage({ type: "error", text: "Please enter a valid email." });
      return false;
    }
    setMessage(null);
    return true;
  }

  function validateAll() {
    if (!form.firstName.trim() || !form.email.trim() || !form.password.trim()) {
      setMessage({
        type: "error",
        text: "Please fill required fields: First Name, Email, Password.",
      });
      return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email)) {
      setMessage({ type: "error", text: "Please enter a valid email." });
      return false;
    }
    setMessage(null);
    return true;
  }

  async function handleSubmit(e) {
    e?.preventDefault?.();
    if (!validateAll()) return;

    setSubmitting(true);
    setMessage(null);

    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        mobile: form.mobile,
        cardNumber: form.cardNumber,
        jobRole: form.jobRole,
        domain: form.domain,
        gender: form.gender,
        joiningDate: form.joiningDate || null,
        salary: form.salary ? parseFloat(form.salary) : null,
        daysPresent: form.daysPresent ? parseInt(form.daysPresent, 10) : 0,
        paidLeaves: form.paidLeaves ? parseInt(form.paidLeaves, 10) : 0,
        password: form.password,
        bankAccountNumber: form.bankAccountNumber,
        bankName: form.bankName,
        pfNumber: form.pfNumber,
        panNumber: form.panNumber,
        uanNumber: form.uanNumber,
        epsNumber: form.epsNumber,
        esiNumber: form.esiNumber,
      };

      const endpoint = isAdmin
        ? `${BACKEND_BASE_URL}/admin/addhr`
        : `${BACKEND_BASE_URL}/hr/add`;

      const response = await axios.post(endpoint, payload);

      const successMsg =
        response.data?.message ||
        (isAdmin ? "HR added successfully." : "Employee added successfully.");

      setMessage({ type: "success", text: successMsg });

      // reset form
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        cardNumber: "",
        jobRole: "",
        domain: "",
        gender: "",
        joiningDate: "",
        salary: "",
        daysPresent: "",
        paidLeaves: "",
        password: "",
        bankAccountNumber: "",
        bankName: "",
        pfNumber: "",
        panNumber: "",
        uanNumber: "",
        epsNumber: "",
        esiNumber: "",
      });

      setStep(1);
      onAdded?.();
    } catch (error) {
      console.error("Add form error:", error);
      const errMsg =
        error.response?.data?.message ||
        (isAdmin
          ? "Failed to add HR. Please check details."
          : "Failed to add Employee. Please check details.");
      setMessage({ type: "error", text: errMsg });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative max-w-5xl w-full bg-white rounded-lg shadow-lg p-6 z-10 overflow-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-sky-700">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-lg"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* progress */}
        <div className="mb-4">
          <div className="flex items-center gap-4">
            <div
              className={`flex-1 text-sm ${
                step === 1 ? "font-semibold" : "text-gray-500"
              }`}
            >
              Step 1 — Basic
            </div>
            <div
              className={`flex-1 text-sm ${
                step === 2 ? "font-semibold" : "text-gray-500"
              }`}
            >
              Step 2 — Payroll & IDs
            </div>
          </div>
          <div className="mt-2 bg-gray-200 h-2 rounded overflow-hidden">
            <div
              className="h-2 rounded bg-sky-600"
              style={{ width: step === 1 ? "45%" : "100%" }}
            />
          </div>
        </div>

        {message && (
          <div
            className={`mb-4 p-3 rounded border-l-4 ${
              message.type === "success"
                ? "bg-green-50 border-green-400 text-green-700"
                : "bg-red-50 border-red-400 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* PAGE 1 - five left / five right */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded">
              {/* LEFT column (5 fields) */}
              <div className="space-y-3">
                <label className="block">
                  <span className="text-sm text-gray-700">First Name *</span>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleInput}
                    required
                    className="mt-1 block w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-sky-200"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-gray-700">Email *</span>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleInput}
                    required
                    className="mt-1 block w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-sky-200"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-gray-700">Card Number</span>
                  <input
                    name="cardNumber"
                    value={form.cardNumber}
                    onChange={handleInput}
                    className="mt-1 block w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-sky-200"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-gray-700">Domain</span>
                  <input
                    name="domain"
                    value={form.domain}
                    onChange={handleInput}
                    placeholder="e.g., Java, .Net, Python"
                    className="mt-1 block w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-sky-200"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-gray-700">Salary</span>
                  <input
                    name="salary"
                    type="number"
                    step="0.01"
                    value={form.salary}
                    onChange={handleInput}
                    className="mt-1 block w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-sky-200"
                  />
                </label>
              </div>

              {/* RIGHT column (5 fields) */}
              <div className="space-y-3">
                <label className="block">
                  <span className="text-sm text-gray-700">Last Name</span>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleInput}
                    className="mt-1 block w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-sky-200"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-gray-700">Mobile</span>
                  <input
                    name="mobile"
                    value={form.mobile}
                    onChange={handleInput}
                    className="mt-1 block w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-sky-200"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-gray-700">Job Role</span>
                  <input
                    name="jobRole"
                    value={form.jobRole}
                    onChange={handleInput}
                    placeholder="e.g., Developer, Intern"
                    className="mt-1 block w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-sky-200"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-gray-700">Gender</span>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleInput}
                    className="mt-1 block w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-sky-200"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm text-gray-700">Joining Date</span>
                  <input
                    name="joiningDate"
                    type="date"
                    value={form.joiningDate}
                    onChange={handleInput}
                    className="mt-1 block w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-sky-200"
                  />
                </label>
              </div>

              {/* Buttons full-width */}
              <div className="md:col-span-2 flex justify-between mt-2">
                <div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => {
                      if (validateStep1()) setStep(2);
                    }}
                    className="px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PAGE 2 - five left / five right */}
          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded">
              {/* LEFT column (5 fields) */}
              <div className="space-y-3">
                {/* <label className="block">
                  <span className="text-sm text-gray-700">Days Present</span>
                  <input
                    name="daysPresent"
                    type="number"
                    value={form.daysPresent}
                    onChange={handleInput}
                    className="mt-1 block w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-sky-200"
                  />
                </label> */}

                <label className="block">
                  <span className="text-sm text-gray-700">Paid Leaves</span>
                  <input
                    name="paidLeaves"
                    type="number"
                    value={form.paidLeaves}
                    onChange={handleInput}
                    className="mt-1 block w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-sky-200"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-gray-700">
                    Bank Account Number
                  </span>
                  <input
                    name="bankAccountNumber"
                    value={form.bankAccountNumber}
                    onChange={handleInput}
                    className="mt-1 block w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-sky-200"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-gray-700">PF Number</span>
                  <input
                    name="pfNumber"
                    value={form.pfNumber}
                    onChange={handleInput}
                    className="mt-1 block w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-sky-200"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-gray-700">EPS Number</span>
                  <input
                    name="epsNumber"
                    value={form.epsNumber}
                    onChange={handleInput}
                    className="mt-1 block w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-sky-200"
                  />
                </label>
              </div>

              {/* RIGHT column (5 fields) */}
              <div className="space-y-3">
                <label className="block">
                  <span className="text-sm text-gray-700">Password *</span>
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleInput}
                    required
                    className="mt-1 block w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-sky-200"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-gray-700">Bank Name</span>
                  <input
                    name="bankName"
                    value={form.bankName}
                    onChange={handleInput}
                    className="mt-1 block w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-sky-200"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-gray-700">PAN Number</span>
                  <input
                    name="panNumber"
                    value={form.panNumber}
                    onChange={handleInput}
                    className="mt-1 block w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-sky-200"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-gray-700">UAN Number</span>
                  <input
                    name="uanNumber"
                    value={form.uanNumber}
                    onChange={handleInput}
                    className="mt-1 block w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-sky-200"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-gray-700">ESI Number</span>
                  <input
                    name="esiNumber"
                    value={form.esiNumber}
                    onChange={handleInput}
                    className="mt-1 block w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-sky-200"
                  />
                </label>
              </div>

              {/* Buttons full-width */}
              <div className="md:col-span-2 flex justify-between mt-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-5 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    ← Previous
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {submitting
                      ? isAdmin
                        ? "Adding HR…"
                        : "Adding Employee…"
                      : submitButtonText}
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
