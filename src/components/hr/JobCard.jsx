// src/components/hr/JobCard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_BASE_URL } from "../../api/config";

export default function JobCard({ job, onJobDeleted }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const id = job.id ?? job._id ?? "unknown";
  const title = job.jobTitle || job.title || "Untitled Role";
  const experience = job.experienceLevel || job.experience || "Not specified";
  const domain = job.domain || "General";

  async function handleDelete() {
    if (!confirm(`Delete job "${title}" (ID: ${id})?`)) return;
    try {
      setDeleting(true);
      await axios.delete(`${BACKEND_BASE_URL}/hr/job/delete/${id}`);
      onJobDeleted?.(id);
    } catch (err) {
      alert("Failed to delete job.");
      console.error(err);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      {/* CARD */}
      <div className="p-5 bg-white rounded-xl shadow-sm border flex items-center justify-between hover:shadow-md transition">
        
        {/* LEFT */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {experience} · {domain}
          </p>
        </div>

        {/* RIGHT BUTTONS */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-1.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
          >
            View Job
          </button>

          <button
            onClick={() => navigate(`/hr/job/${id}/applications`)}
            className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Applications
          </button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600 mt-2">
              Experience: <strong>{experience}</strong>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Domain: <strong>{domain}</strong>
            </p>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => navigate(`/career/job/${id}`)}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
              >
                Open Full Job Page
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
