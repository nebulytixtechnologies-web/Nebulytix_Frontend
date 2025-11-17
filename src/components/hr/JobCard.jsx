// src/components/hr/JobCard.jsx
import React from "react";

export default function JobCard({ job }) {
  console.log("Job data:", job);
  return (
    <div className="p-4 border rounded bg-white flex items-center justify-between">
      <div>
        <div className="font-semibold">{job.jobTitle}</div>
        <div className="text-sm text-gray-600 mt-1">
          {job.description || job.desc}
        </div>
      </div>
      <div>
        <button className="px-3 py-1 bg-sky-600 text-white rounded">
          View Job
        </button>
      </div>
    </div>
  );
}
