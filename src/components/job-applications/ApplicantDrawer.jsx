// src/components/hr/job-applications/ApplicantDrawer.jsx
import React from "react";

export default function ApplicantDrawer({
  selectedApp,
  jobDetails,
  fmtDate,
  statusBadge,
  resolveUrl,
  downloadFile,
  onClose,
  onShortlist,
  onReject,
}) {
  const initials = (selectedApp.fullName || "U")
    .split(" ")
    .map((x) => x[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const statusUpper = String(selectedApp.status || "").toUpperCase();
  const isFinal =
    statusUpper.includes("SHORT") ||
    statusUpper.includes("REJECT") ||
    statusUpper.includes("INVITED") ||
    statusUpper.includes("TERMINATED");

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      <aside className="fixed right-0 top-0 h-full w-full md:w-[46%] lg:w-[34%] bg-white shadow-2xl z-50 overflow-y-auto rounded-l-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sm font-semibold text-sky-700">
              {initials}
            </div>

            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedApp.fullName}
              </h2>
              <p className="text-xs text-gray-600">{selectedApp.email}</p>
              <p className="text-xs text-gray-600">
                {selectedApp.phoneNumber}
              </p>
            </div>

            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
          </div>

          <div className="mt-2 text-xs text-gray-500 space-y-1">
            <p>Applied: {fmtDate(selectedApp.applicationDate)}</p>
            <p>
              Position:{" "}
              <strong>
                {jobDetails?.jobTitle || jobDetails?.title || "—"}
              </strong>
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-6">
          {/* Status */}
          <section className="bg-gray-50 p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                Application status
              </h3>
              {statusBadge(selectedApp.status)}
            </div>

            {!isFinal && (
              <div className="mt-4 flex gap-3">
                <button
                  onClick={onShortlist}
                  className="flex-1 bg-green-600 text-white py-2 rounded text-sm hover:bg-green-700"
                >
                  Shortlist
                </button>
                <button
                  onClick={onReject}
                  className="flex-1 bg-red-600 text-white py-2 rounded text-sm hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            )}
          </section>

          {/* Resume */}
          <section className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Resume
            </h3>

            {selectedApp.resumeUrl ? (
              <div className="flex items-center justify-between bg-white p-3 rounded border">
                <div className="text-sm font-medium text-gray-800">
                  {selectedApp.fullName}'s resume
                </div>
                <div className="flex gap-2">
                  <a
                    href={resolveUrl(selectedApp.resumeUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700"
                  >
                    Open
                  </a>
                  <button
                    onClick={() =>
                      downloadFile(
                        selectedApp.resumeUrl,
                        `${selectedApp.fullName}_resume.pdf`
                      )
                    }
                    className="px-3 py-1.5 bg-gray-100 rounded text-xs hover:bg-gray-200"
                  >
                    Download
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-600">
                No resume uploaded.
              </p>
            )}
          </section>

          {/* Additional Info */}
          <section className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Additional info
            </h3>
            <p className="text-xs text-gray-600">
              Email: <strong>{selectedApp.email}</strong>
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Phone: <strong>{selectedApp.phoneNumber}</strong>
            </p>
          </section>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 rounded text-sm hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
