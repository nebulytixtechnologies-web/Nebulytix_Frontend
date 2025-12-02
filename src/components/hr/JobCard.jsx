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
  const location = job.location || "Not specified";

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
      {/* JOB CARD */}
      <div className="p-5 bg-white rounded-xl shadow-sm border flex items-center justify-between hover:shadow-md transition">
        
        {/* LEFT */}
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500">
            {domain} • {experience} • {location}
          </p>
        </div>

        {/* RIGHT BUTTONS */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-1.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
          >
            View
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

      {/* JOB DETAILS MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-xl relative max-h-[90vh] overflow-y-auto p-6">

            {/* CLOSE BUTTON */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 w-8 h-8 flex items-center justify-center 
                         bg-white border border-gray-300 text-red-600 hover:text-red-700 
                         rounded-md shadow-sm"
            >
              ✕
            </button>

            {/* HEADER */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>

              <p className="text-gray-500 mt-1 text-sm">
                {domain} • {experience} • {location}
              </p>
            </div>

            {/* DESCRIPTION */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Job Description</h3>
              <p className="text-gray-700 whitespace-pre-line mt-2">
                {job.description || "No description provided."}
              </p>
            </div>

            {/* REQUIREMENTS + RESPONSIBILITIES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

              {/* Requirements */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Requirements</h3>
                <p className="text-gray-700 whitespace-pre-line mt-2">
                  {job.requirements || "No requirements listed."}
                </p>
              </div>

              {/* Responsibilities */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Responsibilities</h3>
                <p className="text-gray-700 whitespace-pre-line mt-2">
                  {job.responsibilities || "No responsibilities provided."}
                </p>
              </div>
            </div>

            {/* FOOTER INFO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm border-t pt-4">

              <div>
                <strong className="text-gray-800">Salary: </strong>
                {job.salaryRange || "Not specified"}
              </div>

              <div>
                <strong className="text-gray-800">Location: </strong>
                {location}
              </div>

              <div>
                <strong className="text-gray-800">Active: </strong>
                {String(job.isActive)}
              </div>

            </div>

            {/* CLOSE BUTTON */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
