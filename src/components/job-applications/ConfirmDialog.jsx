// src/components/hr/job-applications/ConfirmDialog.jsx
import React from "react";

export default function ConfirmDialog({
  confirmAction,
  onCancel,
  onConfirm,
  loadingId,
}) {
  if (!confirmAction) return null;

  const { app, shortlist } = confirmAction;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-50"
        onClick={onCancel}
      />

      <div className="fixed top-[24%] left-1/2 -translate-x-1/2 bg-white shadow-2xl rounded-lg p-6 z-50 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900">
          {shortlist ? "Shortlist applicant" : "Reject applicant"}
        </h3>

        <p className="mt-3 text-sm text-gray-700 leading-relaxed">
          Are you sure you want to{" "}
          <strong>{shortlist ? "shortlist" : "reject"}</strong>{" "}
          <strong>{app.fullName}</strong>?
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-3 py-1.5 bg-gray-100 rounded text-sm hover:bg-gray-200"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-60"
            onClick={() => onConfirm(confirmAction)}
            disabled={loadingId === app.id}
          >
            {loadingId === app.id ? "Updating..." : "Confirm"}
          </button>
        </div>
      </div>
    </>
  );
}
