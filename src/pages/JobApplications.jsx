// src/pages/hr/JobApplications.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_BASE_URL, BASE_URL } from "../api/config";
// BACKEND_BASE_URL -> your API root, e.g. "http://192.168.1.103:5054/api"
// BASE_URL -> server root for static files, e.g. "http://192.168.1.103:5054"

export default function JobApplications() {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [selectedApp, setSelectedApp] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [updatingAppId, setUpdatingAppId] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    axios
      .get(`${BACKEND_BASE_URL}/career/job/${jobId}/applications`)
      .then((res) => {
        if (!mounted) return;
        const data = Array.isArray(res.data?.data) ? res.data.data : [];
        setApplications(data);
      })
      .catch((err) => {
        console.error("Failed to fetch applications:", err);
        if (!mounted) return;
        setError("Could not load applications. See console for details.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => (mounted = false);
  }, [jobId]);

  // ---------- Helpers for URLs & download ----------
  function resolveBackendUrl(pathOrUrl) {
    if (!pathOrUrl) return "";
    if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
      return pathOrUrl;
    }
    const p = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
    return `${BASE_URL}${p}`; // use BASE_URL for static files
  }

  async function downloadFileFromBackend(pathOrUrl, filename) {
    const url = resolveBackendUrl(pathOrUrl);
    try {
      // fetch as blob so download works cross-origin
      const res = await fetch(url, { mode: "cors" });
      if (!res.ok) throw new Error(`Network error: ${res.status}`);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename || "file";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed", err);
      alert(
        "Could not download file. See console for details (check console)."
      );
    }
  }

  // Helper: update one application locally (optimistic UI)
  function updateApplicationLocally(appId, patch) {
    setApplications((prev) =>
      prev.map((a) => (String(a.id) === String(appId) ? { ...a, ...patch } : a))
    );
  }

  // Confirmed action handler (select or reject)
  // NOTE: backend expects PUT /job/updateStatus/{applicationId}/{status} where status is boolean (true = shortlisted)
  async function performStatusChange(app, action) {
    setConfirmAction(null);
    setUpdatingAppId(app.id);

    const isSelect =
      action === "SELECTED" || action === "SELECT" || action === "SHORTLIST";
    // Map to backend boolean path value
    const boolStatus = isSelect ? true : false;
    // Local optimistic status string that matches backend values
    const optimisticStatus = isSelect ? "SHORTLISTED" : "REJECTED";

    // Save previous status to restore on error
    const previous = applications.find((a) => String(a.id) === String(app.id));

    // Optimistically update UI
    updateApplicationLocally(app.id, { status: optimisticStatus });

    try {
      // Construct URL carefully: remove trailing slash on BACKEND_BASE_URL if present
      const url = `${BACKEND_BASE_URL}/hr/job/updateStatus/${app.id}/${boolStatus}`;

      // Call backend with PUT (no body expected per your backend controller)
      await axios.put(url);
    } catch (err) {
      console.error("Status update failed:", err);
      // restore previous status
      updateApplicationLocally(app.id, { status: previous?.status });
      alert("Could not update application status. See console for details.");
    } finally {
      setUpdatingAppId(null);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-4 border rounded">Loading applications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-4 border rounded text-red-600">{error}</div>
        <div className="mt-4">
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-1 bg-gray-100 rounded"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">
          Applications for Job ID: {jobId}
        </h1>
        <div>
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-1 bg-gray-100 rounded"
          >
            Back
          </button>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="p-4 border rounded text-gray-600">
          No applications yet.
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <ApplicationRow
              key={app.id}
              app={app}
              onViewDetails={() => setSelectedApp(app)}
              onViewResume={() =>
                window.open(resolveBackendUrl(app.resumeUrl), "_blank")
              }
              onDownloadResume={() => {
                const filename = `resume_${(app.fullName || app.id)
                  .toString()
                  .replace(/\s+/g, "_")}.pdf`;
                downloadFileFromBackend(app.resumeUrl, filename);
              }}
              onShortlist={() => setConfirmAction({ app, action: "SELECTED" })}
              onReject={() => setConfirmAction({ app, action: "REJECTED" })}
              updating={updatingAppId === app.id}
            />
          ))}
        </div>
      )}

      {selectedApp && (
        <DetailsModal app={selectedApp} onClose={() => setSelectedApp(null)} />
      )}

      {confirmAction && (
        <ConfirmModal
          app={confirmAction.app}
          action={confirmAction.action}
          onCancel={() => setConfirmAction(null)}
          onConfirm={() =>
            performStatusChange(confirmAction.app, confirmAction.action)
          }
        />
      )}
    </div>
  );
}

/* ---------- ApplicationRow component (unchanged apart from using passed props) ---------- */
function ApplicationRow({
  app,
  onViewDetails,
  onViewResume,
  onDownloadResume,
  onShortlist,
  onReject,
  updating,
}) {
  return (
    <div className="p-4 border rounded bg-white flex items-center justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-4">
          <div className="font-medium">{app.fullName ?? "Unknown"}</div>
          <div className="text-sm text-gray-500">{app.email}</div>
          <div className="text-sm text-gray-500">· {app.phoneNumber}</div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Applied: {app.applicationDate ?? "N/A"} · Status:{" "}
          <span className={`font-semibold ${statusColorClass(app.status)}`}>
            {app.status ?? "N/A"}
          </span>
        </div>
      </div>

      <div className="ml-4 flex gap-2">
        <button
          onClick={onViewDetails}
          className="px-3 py-1 bg-sky-600 text-white rounded"
        >
          View details
        </button>

        <button
          onClick={onViewResume}
          className="px-3 py-1 bg-indigo-600 text-white rounded"
        >
          View resume
        </button>

        <button
          onClick={onDownloadResume}
          className="px-3 py-1 bg-gray-100 rounded"
        >
          Download
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={onShortlist}
            disabled={updating}
            className="px-3 py-1 bg-green-600 text-white rounded"
          >
            Shortlist
          </button>
          <button
            onClick={onReject}
            disabled={updating}
            className="px-3 py-1 bg-red-600 text-white rounded"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- DetailsModal component ---------- */
function DetailsModal({ app, onClose }) {
  function resolveBackendUrlLocal(p) {
    if (!p) return "";
    if (p.startsWith("http://") || p.startsWith("https://")) return p;
    return `${BASE_URL}${p.startsWith("/") ? p : `/${p}`}`;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded shadow-lg p-6 z-10">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold">{app.fullName}</h2>
            <div className="text-sm text-gray-500">
              {app.email} · {app.phoneNumber}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Applied: {app.applicationDate ?? "N/A"}
            </div>
          </div>
          <div>
            <button onClick={onClose} className="px-2 py-1 bg-gray-100 rounded">
              Close
            </button>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold">Application details</h3>
          <div className="mt-2 text-gray-700">
            <p>
              <strong>Status:</strong> {app.status ?? "N/A"}
            </p>
            <p className="mt-2">
              <strong>Resume URL:</strong>{" "}
              {app.resumeUrl ? (
                <a
                  className="text-indigo-600"
                  href={resolveBackendUrlLocal(app.resumeUrl)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open resume
                </a>
              ) : (
                "N/A"
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- ConfirmModal component ---------- */
function ConfirmModal({ app, action, onCancel, onConfirm }) {
  const verb =
    action === "SELECTED" || action === "SELECT" ? "Select" : "Reject";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative w-full max-w-md bg-white rounded shadow-lg p-6 z-10">
        <h3 className="text-lg font-semibold">{verb} application</h3>
        <p className="mt-2 text-gray-600">
          Are you sure you want to <strong>{verb.toLowerCase()}</strong> the
          application from <strong>{app.fullName}</strong>?
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onCancel} className="px-3 py-1 bg-gray-100 rounded">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            {verb}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- small helper ---------- */
function statusColorClass(status) {
  if (!status) return "text-gray-700";
  const s = String(status).toLowerCase();
  if (s.includes("select") || s.includes("accepted") || s.includes("shortlist"))
    return "text-green-600";
  if (s.includes("reject")) return "text-red-600";
  if (s.includes("pending")) return "text-yellow-600";
  return "text-gray-700";
}
