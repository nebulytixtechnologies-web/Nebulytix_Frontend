// src/components/admin/AddHrForm.jsx
import { useState } from "react";
import axios from "axios";
import { BACKEND_BASE_URL } from "../../api/config";

export default function AddHrForm({ mode = "admin", onClose, onAdded }) {
  const [form, setForm] = useState({
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
    ifscCode: "", // ADDED
    pfNumber: "",
    panNumber: "",
    uanNumber: "",
    epsNumber: "",
    esiNumber: "",
  });

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const isAdmin = mode === "admin";
  const title = isAdmin ? "Add HR" : "Add Employee";
  const submitButtonText = isAdmin ? "Add HR" : "Add Employee";

  function handleInput(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  // ENTER KEY BEHAVIOR - move to next input instead of submitting
  function handleEnterKey(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      const formEl = e.target.form;
      const index = Array.prototype.indexOf.call(formEl, e.target);
      formEl.elements[index + 1]?.focus();
    }
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
        ifscCode: form.ifscCode, // ADDED
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
        ifscCode: "",
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
          >
            ✕
          </button>
        </div>

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
          {/* PAGE 1 */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded">

              <div className="space-y-3">
                <label className="block">
                  <span className="text-sm">First Name *</span>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleInput}
                    onKeyDown={handleEnterKey}
                    required
                    className="mt-1 block w-full px-3 py-2 border rounded"
                  />
                </label>

                <label className="block">
                  <span className="text-sm">Email *</span>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleInput}
                    onKeyDown={handleEnterKey}
                    required
                    className="mt-1 block w-full px-3 py-2 border rounded"
                  />
                </label>

                <label className="block">
                  <span className="text-sm">Card Number</span>
                  <input
                    name="cardNumber"
                    value={form.cardNumber}
                    onChange={handleInput}
                    onKeyDown={handleEnterKey}
                    className="mt-1 block w-full px-3 py-2 border rounded"
                  />
                </label>

                <label className="block">
                  <span className="text-sm">Domain</span>
                  <input
                    name="domain"
                    value={form.domain}
                    onChange={handleInput}
                    onKeyDown={handleEnterKey}
                    className="mt-1 block w-full px-3 py-2 border rounded"
                  />
                </label>

                <label className="block">
                  <span className="text-sm">Salary</span>
                  <input
                    name="salary"
                    type="number"
                    step="0.01"
                    value={form.salary}
                    onChange={handleInput}
                    onKeyDown={handleEnterKey}
                    className="mt-1 block w-full px-3 py-2 border rounded"
                  />
                </label>
              </div>

              <div className="space-y-3">
                <label className="block">
                  <span className="text-sm">Last Name</span>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleInput}
                    onKeyDown={handleEnterKey}
                    className="mt-1 block w-full px-3 py-2 border rounded"
                  />
                </label>

                <label className="block">
                  <span className="text-sm">Mobile</span>
                  <input
                    name="mobile"
                    value={form.mobile}
                    onChange={handleInput}
                    onKeyDown={handleEnterKey}
                    className="mt-1 block w-full px-3 py-2 border rounded"
                  />
                </label>

                <label className="block">
                  <span className="text-sm">Job Role</span>
                  <input
                    name="jobRole"
                    value={form.jobRole}
                    onChange={handleInput}
                    onKeyDown={handleEnterKey}
                    className="mt-1 block w-full px-3 py-2 border rounded"
                  />
                </label>

                <label className="block">
                  <span className="text-sm">Gender</span>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleInput}
                    onKeyDown={handleEnterKey}
                    className="mt-1 block w-full px-3 py-2 border rounded"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm">Joining Date</span>
                  <input
                    name="joiningDate"
                    type="date"
                    value={form.joiningDate}
                    onChange={handleInput}
                    onKeyDown={handleEnterKey}
                    className="mt-1 block w-full px-3 py-2 border rounded"
                  />
                </label>
              </div>

              <div className="md:col-span-2 flex justify-between mt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => validateStep1() && setStep(2)}
                  className="px-5 py-2 bg-indigo-600 text-white rounded"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* PAGE 2 */}
          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded">

              {/* LEFT COLUMN */}
              <div className="space-y-3">

                {/* Bank Name */}
                <label className="block">
                  <span className="text-sm">Bank Name</span>
                  <input
                    name="bankName"
                    value={form.bankName}
                    onChange={handleInput}
                    onKeyDown={handleEnterKey}
                    className="mt-1 block w-full px-3 py-2 border rounded"
                  />
                </label>

                {/* Account Number */}
                <label className="block">
                  <span className="text-sm">Bank Account Number</span>
                  <input
                    name="bankAccountNumber"
                    value={form.bankAccountNumber}
                    onChange={handleInput}
                    onKeyDown={handleEnterKey}
                    className="mt-1 block w-full px-3 py-2 border rounded"
                  />
                </label>

                {/* IFSC Code */}
                <label className="block">
                  <span className="text-sm">IFSC Code</span>
                  <input
                    name="ifscCode"
                    value={form.ifscCode}
                    onChange={handleInput}
                    onKeyDown={handleEnterKey}
                    className="mt-1 block w-full px-3 py-2 border rounded"
                  />
                </label>

                {/* PF */}
                <label className="block">
                  <span className="text-sm">PF Number</span>
                  <input
                    name="pfNumber"
                    value={form.pfNumber}
                    onChange={handleInput}
                    onKeyDown={handleEnterKey}
                    className="mt-1 block w-full px-3 py-2 border rounded"
                  />
                </label>

                {/* EPS */}
                <label className="block">
                  <span className="text-sm">EPS Number</span>
                  <input
                    name="epsNumber"
                    value={form.epsNumber}
                    onChange={handleInput}
                    onKeyDown={handleEnterKey}
                    className="mt-1 block w-full px-3 py-2 border rounded"
                  />
                </label>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-3">

                <label className="block">
                  <span className="text-sm">Password *</span>
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleInput}
                    onKeyDown={handleEnterKey}
                    required
                    className="mt-1 block w-full px-3 py-2 border rounded"
                  />
                </label>

                <label className="block">
                  <span className="text-sm">PAN Number</span>
                  <input
                    name="panNumber"
                    value={form.panNumber}
                    onChange={handleInput}
                    onKeyDown={handleEnterKey}
                    className="mt-1 block w-full px-3 py-2 border rounded"
                  />
                </label>

                <label className="block">
                  <span className="text-sm">UAN Number</span>
                  <input
                    name="uanNumber"
                    value={form.uanNumber}
                    onChange={handleInput}
                    onKeyDown={handleEnterKey}
                    className="mt-1 block w-full px-3 py-2 border rounded"
                  />
                </label>

                <label className="block">
                  <span className="text-sm">ESI Number</span>
                  <input
                    name="esiNumber"
                    value={form.esiNumber}
                    onChange={handleInput}
                    onKeyDown={handleEnterKey}
                    className="mt-1 block w-full px-3 py-2 border rounded"
                  />
                </label>
              </div>

              <div className="md:col-span-2 flex justify-between mt-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-5 py-2 bg-gray-200 rounded"
                  >
                    ← Previous
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2 bg-gray-200 rounded"
                  >
                    Cancel
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
                >
                  {submitting ? "Submitting…" : submitButtonText}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
