// src/components/hr/JobCard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_BASE_URL } from "../../api/config";
import JobDetails from "../../pages/JobDetails"; // relative path may vary

export default function JobCard({ job, onJobDeleted }) {
  const navigate = useNavigate();
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const id = job.id ?? job._id ?? "unknown";
  const title = job.jobTitle || job.title || "Untitled Role";
  const description = job.description || job.desc || "No description provided.";
  const experience = job.experienceLevel || job.experience || "Not specified";
  const domain = job.domain || "Not specified";

  async function handleDelete() {
    if (!confirm(`Delete job "${title}" (ID: ${id})? This cannot be undone.`)) {
      return;
    }
    try {
      setDeleting(true);
      // Adjust endpoint if your backend uses different path for HR delete
      await axios.delete(`${BACKEND_BASE_URL}/hr/job/delete/${id}`);
      // inform parent to remove from list
      if (typeof onJobDeleted === "function") onJobDeleted(id);
    } catch (err) {
      console.error("Delete job error:", err);
      alert("Could not delete job. Check console for details.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="p-4 border rounded bg-white flex items-center justify-between">
        <div>
          <div className="font-semibold">{title}</div>
          <div className="text-sm text-gray-600 mt-1">{description}</div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDetailsModal(true)}
            className="px-3 py-1 bg-sky-600 text-white rounded hover:bg-sky-700"
            aria-label={`View ${title}`}
          >
            View Job
          </button>

          <button
            onClick={() => navigate(`/hr/job/${id}/applications`)}
            className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            title="View applications for this job"
          >
            View Applications
          </button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            title="Delete job"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {showDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowDetailsModal(false)}
          />
          <div className="relative max-w-3xl w-full bg-white rounded shadow-lg p-4 z-10">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-2 py-1 rounded bg-gray-100"
              >
                Close
              </button>
            </div>

            {/* Reuse JobDetails by passing job prop. hideApply prevents showing Apply button.
                embed=true tells JobDetails not to render Navbar/Footer */}
            <JobDetails
              job={job}
              hideApply={true}
              embed={true}
              onClose={() => setShowDetailsModal(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
