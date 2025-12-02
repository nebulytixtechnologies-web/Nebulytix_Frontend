// src/components/hr/job-applications/JobApplicationsHeader.jsx
import React from "react";
import { Mail } from "lucide-react";

export default function JobApplicationsHeader({
  jobDetails,
  jobId,
  applicationsCount,
  filter,
  setFilter,
  totals,
  sortBy,
  setSortBy,
  searchInput,
  setSearchInput,
  onBack,
  onBulkMailClick,
}) {
  const {
    totalShortlisted = 0,
    totalRejected = 0,
    totalPending = 0,
    totalInvited = 0,
    totalTerminated = 0,
  } = totals || {};

  return (
    <header className="space-y-4">
      {/* Job Info & Stat Pills */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Applications for{" "}
            <span className="text-sky-700">
              {jobDetails?.jobTitle || jobDetails?.title || "—"}
            </span>
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Job ID: {jobId} · Total applicants:{" "}
            <span className="font-semibold text-indigo-600">
              {applicationsCount}
            </span>
          </p>
        </div>

       
      </div>

      {/* Filters + Controls */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2">
          <TabButton
            active={filter === "ALL"}
            label={`All (${applicationsCount})`}
            onClick={() => setFilter("ALL")}
          />
          <TabButton
            active={filter === "PENDING"}
            label={`Pending (${totalPending})`}
            color="yellow"
            onClick={() => setFilter("PENDING")}
          />
          <TabButton
            active={filter === "SHORTLISTED"}
            label={`Shortlisted (${totalShortlisted})`}
            color="green"
            onClick={() => setFilter("SHORTLISTED")}
          />
          <TabButton
            active={filter === "INVITED"}
            label={`Invited (${totalInvited})`}
            color="blue"
            onClick={() => setFilter("INVITED")}
          />
          <TabButton
            active={filter === "REJECTED"}
            label={`Rejected (${totalRejected})`}
            color="red"
            onClick={() => setFilter("REJECTED")}
          />
          <TabButton
            active={filter === "TERMINATED"}
            label={`Terminated (${totalTerminated})`}
            color="redDark"
            onClick={() => setFilter("TERMINATED")}
          />
        </div>

        {/* Search / Sort / Actions */}
        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-end">
          <div className="flex items-center gap-2">
            <select
              className="border border-gray-300 px-3 py-2 rounded text-sm bg-white"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="NEWEST">Newest</option>
              <option value="OLDEST">Oldest</option>
              <option value="AZ">Name A–Z</option>
              <option value="ZA">Name Z–A</option>
            </select>

            <input
              type="text"
              className="border border-gray-300 px-3 py-2 rounded text-sm w-64"
              placeholder="Search name, email, phone"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 justify-end">
            {(filter === "SHORTLISTED" || filter === "REJECTED") && (
              <button
                onClick={() => onBulkMailClick(filter)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded text-white text-sm ${
                  filter === "SHORTLISTED"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                <Mail className="w-4 h-4" />
                {filter === "SHORTLISTED"
                  ? "Email"
                  : "Email"}
              </button>
            )}

            <button
              onClick={onBack}
              className="px-4 py-2 bg-gray-100 rounded text-sm hover:bg-gray-200"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function TabButton({ active, label, onClick, color }) {
  const base =
    "px-3 py-1.5 rounded-full text-xs font-medium transition-colors border";
  const inactive =
    "bg-white text-gray-700 border-gray-200 hover:bg-gray-50";

  const map = {
    green: "bg-green-50 text-green-700 border-green-200",
    red: "bg-red-50 text-red-700 border-red-200",
    redDark: "bg-red-100 text-red-800 border-red-300",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
  };

  const activeClass =
    color && map[color]
      ? map[color]
      : "bg-sky-50 text-sky-700 border-sky-200";

  return (
    <button
      onClick={onClick}
      className={base + " " + (active ? activeClass : inactive)}
    >
      {label}
    </button>
  );
}

function StatPill({ label, value, color }) {
  const map = {
    green: "bg-green-50 text-green-700",
    red: "bg-red-50 text-red-700",
    redDark: "bg-red-100 text-red-800",
    yellow: "bg-yellow-50 text-yellow-700",
    blue: "bg-blue-50 text-blue-700",
  };
  const cls = map[color] || "bg-gray-50 text-gray-700";

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full ${cls}`}>
      <span className="text-[11px] font-medium">{label}</span>
      <span className="text-[11px] font-semibold">{value}</span>
    </span>
  );
}
