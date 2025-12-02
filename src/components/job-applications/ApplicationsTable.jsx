// src/components/hr/job-applications/ApplicationsTable.jsx
import React from "react";
import ApplicationRow from "./ApplicationRow";

export default function ApplicationsTable({
  applications,
  filter,
  statusBadge,
  fmtDate,
  onSelectApp,
  onOpenMailForApp,
}) {
  if (!applications.length) {
    return (
      <div className="border border-dashed rounded-lg bg-white p-10 text-center text-gray-500 text-sm">
        No applications found for this filter.
      </div>
    );
  }

  return (
    <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr className="text-left text-xs font-semibold text-gray-600">
              <th className="px-5 py-3">Candidate</th>
              <th className="px-5 py-3">Contact</th>
              <th className="px-5 py-3">Applied</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {applications.map((app) => (
              <ApplicationRow
                key={app.id}
                app={app}
                filter={filter}
                statusBadge={statusBadge}
                fmtDate={fmtDate}
                onSelect={() => onSelectApp(app)}
                onSendMail={(type) => onOpenMailForApp(app, type)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
