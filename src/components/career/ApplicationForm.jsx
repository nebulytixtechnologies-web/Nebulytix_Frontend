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
  const [stage, setStage] = useState("form"); // form | success
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
        mobileNumber: form.phone,
      };

      const fd = new FormData();
      // Send DTO as JSON blob named "data" — matches Spring's @RequestPart("data")
      fd.append(
        "data",
        new Blob([JSON.stringify(dto)], { type: "application/json" })
      );
      if (file) fd.append("resume", file);

      // Explicit API path: ensure it matches your Spring controller mapping
      const url = `${BACKEND_BASE_URL}/career/applyJob`;

      const res = await axios.post(url, fd, {
        // DO NOT set Content-Type manually; let browser set boundary
        timeout: 30000,
      });

      // success when backend returns 201 or has success payload
      if (
        res.status === 201 ||
        res.data?.code === 201 ||
        res.data?.status === "CREATED"
      ) {
        setStage("success");
      } else {
        const backendMsg =
          res.data?.message || res.data?.msg || "Failed to submit application.";
        setMessage({ type: "error", text: backendMsg });
      }
    } catch (err) {
      const backendMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.response?.data?.msg ||
        err?.message ||
        "Failed to apply. Check server logs / network.";
      setMessage({ type: "error", text: backendMsg });
    } finally {
      setSubmitting(false);
    }
  }

  if (stage === "success") {
    return <SuccessMessage onClose={onClose} />;
  }

  return (
    <div className="fixed inset-0 flex items-start justify-center pt-28 bg-black/40 z-50">

      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          Apply for "{job?.jobTitle || "Selected Role"}"
        </h2>

        {message && (
          <div
            className={`p-2 mb-2 rounded ${
              message.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div className="relative">
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder=" "
              required
              className="peer w-full border-b-2 border-gray-300 py-2 px-0 text-gray-900 focus:outline-none focus:border-green-600"
            />
            <label
              htmlFor="name"
              className="absolute left-0 px-0 text-gray-500 duration-200 transform -translate-y-3 scale-75 top-3 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-green-600"
            >
              Full Name
            </label>
          </div>

          {/* Email */}
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder=" "
              required
              className="peer w-full border-b-2 border-gray-300 py-2 px-0 text-gray-900 focus:outline-none focus:border-green-600"
            />
            <label
              htmlFor="email"
              className="absolute left-0 px-0 text-gray-500 duration-200 transform -translate-y-3 scale-75 top-3 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-green-600"
            >
              Email
            </label>
          </div>

          {/* Mobile Number */}
          <div className="relative">
            <input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder=" "
              className="peer w-full border-b-2 border-gray-300 py-2 px-0 text-gray-900 focus:outline-none focus:border-green-600"
            />
            <label
              htmlFor="phone"
              className="absolute left-0 px-0 text-gray-500 duration-200 transform -translate-y-3 scale-75 top-3 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-green-600"
            >
              Mobile Number
            </label>
          </div>

          {/* Resume File Upload */}
          <div className="relative pt-4">
            <label
              htmlFor="resume"
              className="block mb-1 font-medium text-gray-700"
            >
              Resume
            </label>
            <input
              id="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFile}
              className="w-full"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700 transition disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}
