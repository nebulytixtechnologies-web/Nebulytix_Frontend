import { useState } from "react";
import axios from "axios";
import { BACKEND_BASE_URL } from "../../api/config";

export default function AddJobForm({ onClose, onAdded }) {
  const [form, setForm] = useState({
    jobTitle: "",
    domain: "",
    jobType: "",
    experienceLevel: "",
    description: "",
    requirements: "",
    responsibilities: "",
    salaryRange: "",
    postedDate: "",
    closingDate: "",
  });
  const [submitting, setSubmitting] = useState(false);

  function handleInput(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.jobTitle.trim() || !form.domain.trim()) {
      alert("Please fill all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(`${BACKEND_BASE_URL}/hr/addJob`, form);
      alert(response.data?.message || "Job added successfully.");
      onAdded?.();
      onClose?.();
    } catch (err) {
      console.error("Add job error:", err);
      alert(err.response?.data?.message || "Failed to add job. Check backend.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 z-10 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b pb-2">
          <h2 className="text-xl font-bold text-indigo-700">Add New Job</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-lg"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">
                Job Title
              </span>
              <input
                name="jobTitle"
                value={form.jobTitle}
                onChange={handleInput}
                required
                className="mt-1 w-full border rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Domain</span>
              <input
                name="domain"
                value={form.domain}
                onChange={handleInput}
                required
                placeholder="e.g., Java, Python"
                className="mt-1 w-full border rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </label>

{/* JOB TYPE (left) */}
<label className="block">
  <span className="text-sm font-medium text-gray-700">Job Type</span>
  <select
    name="jobType"
    value={form.jobType}
    onChange={handleInput}
    className="mt-1 w-full border rounded-md px-3 py-2"
  >
    <option value="">Select</option>
    <option value="FULL_TIME">Full Time</option>
    <option value="PART_TIME">Part Time</option>
    <option value="CONTRACT">Contract</option>
  </select>
</label>

{/* ⭐ NEW JOB LOCATION (right side of job type) */}
<label className="block">
  <span className="text-sm font-medium text-gray-700">Job Location</span>
  <input
    name="location"
    value={form.location}
    onChange={handleInput}
    placeholder="e.g., Pune, Bangalore, Remote"
    className="mt-1 w-full border rounded-md px-3 py-2"
  />
</label>

{/* EXPERIENCE LEVEL moved BELOW and FULL WIDTH */}
<label className="block md:col-span-2">
  <span className="text-sm font-medium text-gray-700">Experience Level</span>
  <select
    name="experienceLevel"
    value={form.experienceLevel}
    onChange={handleInput}
    className="mt-1 w-full border rounded-md px-3 py-2"
  >
    <option value="">Select</option>
    <option value="ENTRY">Entry</option>
    <option value="MID">Mid</option>
    <option value="SENIOR">Senior</option>
  </select>
</label>


            <label className="block md:col-span-2">
              <span className="text-sm font-medium text-gray-700">
                Salary Range
              </span>
              <input
                name="salaryRange"
                value={form.salaryRange}
                onChange={handleInput}
                placeholder="e.g., 5 LPA - 10 LPA"
                className="mt-1 w-full border rounded-md px-3 py-2"
              />
            </label>

            <div className="grid grid-cols-2 gap-4 md:col-span-2">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">
                  Posted Date
                </span>
                <input
                  type="date"
                  name="postedDate"
                  value={form.postedDate}
                  onChange={handleInput}
                  className="mt-1 w-full border rounded-md px-3 py-2"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">
                  Closing Date
                </span>
                <input
                  type="date"
                  name="closingDate"
                  value={form.closingDate}
                  onChange={handleInput}
                  className="mt-1 w-full border rounded-md px-3 py-2"
                />
              </label>
            </div>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">
              Description
            </span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleInput}
              rows={2}
              className="mt-1 w-full border rounded-md px-3 py-2"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">
              Requirements
            </span>
            <textarea
              name="requirements"
              value={form.requirements}
              onChange={handleInput}
              rows={2}
              className="mt-1 w-full border rounded-md px-3 py-2"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">
              Responsibilities
            </span>
            <textarea
              name="responsibilities"
              value={form.responsibilities}
              onChange={handleInput}
              rows={2}
              className="mt-1 w-full border rounded-md px-3 py-2"
            />
          </label>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Add Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
