//src/components/career/JobCard.jsx
import React from "react";
import { MapPin } from "lucide-react";   // 👈 ADD THIS

export default function JobCard({ job, onView }) {
  const id = job.id ?? job._id ?? "unknown";
  const title = job.jobTitle || job.title || "Untitled Role";
  const experience = job.experienceLevel || job.experience || "Not specified";
  const domain = job.domain || "Not specified";

  // Job location
  const location = job.location || job.jobLocation || "Not specified";

  return (
    <div className="p-4 border rounded shadow-sm bg-white hover:shadow-md transition">
      <div className="flex items-start justify-between">
        
        <div className="flex-1">
          {/* Job Title */}
          <h3 className="text-lg font-semibold text-gray-900">
            {title}
          </h3>

          {/* Domain + Location */}
          <div className="text-sm text-gray-500 mt-1 flex items-center gap-3">

            <span>{domain}</span>

            <span className="flex items-center gap-1">
              <MapPin size={14} className="text-gray-500" /> 
              {location}
            </span>

          </div>

          {/* Experience + ID */}
          <div className="text-xs text-gray-500 mt-3 flex gap-4">
            <span>💼 {experience}</span>
            <span>ID: {id}</span>
          </div>

        </div>

        {/* View Button */}
        <button
          onClick={onView}
          className="ml-4 px-3 py-1.5 bg-sky-600 text-white rounded text-sm hover:bg-sky-700"
        >
          View
        </button>
      </div>
    </div>
  );
}
