// src/components/hr/job-applications/ApplicationRow.jsx
import React from "react";
import { Mail, Eye } from "lucide-react";

export default function ApplicationRow({
  app,
  filter,
  statusBadge,
  fmtDate,
  onSelect,
  onSendMail,
}) {
  const statusUpper = (app.status || "").toUpperCase();

  const canSendIndividual =
    (filter === "SHORTLISTED" && statusUpper.includes("SHORT")) ||
    (filter === "REJECTED" && statusUpper.includes("REJECT"));

  const mailType = statusUpper.includes("SHORT")
    ? "INVITED_SINGLE"
    : statusUpper.includes("REJECT")
    ? "TERMINATED_SINGLE"
    : "";

  return (
    <tr className="hover:bg-gray-50">
      {/* Candidate */}
      <td className="px-5 py-4 align-top">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center text-xs font-semibold text-sky-700">
            {(app.fullName || "U")
              .split(" ")
              .map((x) => x[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {app.fullName || "-"}
            </div>
          </div>
        </div>
      </td>

      {/* Contact */}
      <td className="px-5 py-4 align-top">
        <div className="text-sm text-gray-800">{app.email}</div>
        <div className="text-xs text-gray-500">{app.phoneNumber}</div>
      </td>

      {/* Applied */}
      <td className="px-5 py-4 align-top text-sm text-gray-700">
        {fmtDate(app.applicationDate)}
      </td>

      {/* Status */}
      <td className="px-5 py-4 align-top">
        {statusBadge(app.status)}
      </td>

      {/* Actions */}
      <td className="px-5 py-4 align-top">
        <div className="flex justify-end gap-2">
          {canSendIndividual && mailType && (
            <button
              onClick={() => onSendMail(mailType)}
              className="inline-flex items-center gap-1 px-3 py-1.5 border border-sky-600 text-sky-700 rounded-full hover:bg-sky-50 text-xs font-medium"
            >
              <Mail className="w-3 h-3" />
              Email
            </button>
          )}

          <button
            onClick={onSelect}
            className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 text-xs font-medium"
          >
            <Eye className="w-3 h-3" />
            View
          </button>
        </div>
      </td>
    </tr>
  );
}
