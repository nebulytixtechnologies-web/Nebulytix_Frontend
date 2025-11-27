// src/components/career/ApplicationForm.jsx
import { useState } from "react";
import axios from "axios";
import { BACKEND_BASE_URL } from "../../api/config";
import SuccessMessage from "./SuccessMessage";

export default function ApplicationForm({ job, onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [file, setFile] = useState(null);
  const [stage, setStage] = useState("form");
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleFile = (e) => setFile(e.target.files?.[0] || null);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);

    try {
      const jobId = job?.id ?? job?._id ?? null;

      const dto = {
        jobId,
        fullName: form.name,
        email: form.email,
        phoneNumber: form.phone,
      };

      const fd = new FormData();
      fd.append("data", new Blob([JSON.stringify(dto)], { type: "application/json" }));
      if (file) fd.append("resume", file);

      const url = `${BACKEND_BASE_URL}/career/applyJob`;
      const res = await axios.post(url, fd, { timeout: 30000 });

      if (
        res.status === 201 ||
        res.data?.code === 201 ||
        res.data?.status === "CREATED"
      ) {
        setStage("success");
      } else {
        setMessage({
          type: "error",
          text: res.data?.message || "Failed to submit application.",
        });
      }
    } catch (err) {
      const backendMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.response?.data?.msg ||
        err?.message ||
        "Failed to apply.";
      setMessage({ type: "error", text: backendMsg });
    } finally {
      setSubmitting(false);
    }
  }

  if (stage === "success") {
    return <SuccessMessage onClose={onClose} />;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border">

      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Apply for "{job?.jobTitle || "Selected Role"}"
      </h2>

      {message && (
        <div
          className={`p-3 mb-4 rounded ${
            message.type === "error"
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* FORM (SIDE-BY-SIDE SAFE LAYOUT) */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Full Name */}
        <div>
          <label className="block font-medium mb-1">Full Name *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded focus:border-blue-600"
            placeholder="Enter your full name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium mb-1">Email *</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded focus:border-blue-600"
            placeholder="Enter your email"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block font-medium mb-1">Mobile Number</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:border-blue-600"
            placeholder="Enter mobile number"
          />
        </div>

        {/* Resume */}
        <div>
          <label className="block font-medium mb-1">Resume *</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFile}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white w-full py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
}
