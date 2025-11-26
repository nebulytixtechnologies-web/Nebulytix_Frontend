// src/pages/hr/JobApplications.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_BASE_URL, BASE_URL } from "../api/config";

export default function JobApplications() {
  const { id: jobId } = useParams();
  const navigate = useNavigate();

  // Data
  const [applications, setApplications] = useState([]);
  const [jobDetails, setJobDetails] = useState(null);

  // UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null); // slide-in panel
  const [confirmAction, setConfirmAction] = useState(null); // { app, shortlist: true|false }
  const [updatingAppId, setUpdatingAppId] = useState(null);

  // Filters
  const [filter, setFilter] = useState("ALL");
  const [searchInput, setSearchInput] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState("NEWEST");

  const mountedRef = useRef(true);
  const searchTimer = useRef(null);

  useEffect(() => {
    mountedRef.current = true;
    setLoading(true);
    setError(null);

    const rApps = axios.get(`${BACKEND_BASE_URL}/career/job/${jobId}/applications`);
    const rJob = axios.get(`${BACKEND_BASE_URL}/career/job/${jobId}`);

    Promise.all([rApps, rJob])
      .then(([appsRes, jobRes]) => {
        if (!mountedRef.current) return;
        setApplications(Array.isArray(appsRes.data?.data) ? appsRes.data.data : []);
        setJobDetails(jobRes.data?.data || null);
      })
      .catch((e) => {
        console.error("Failed to load job/applications:", e);
        if (!mountedRef.current) return;
        setError("Failed to load data. Check console.");
      })
      .finally(() => mountedRef.current && setLoading(false));

    return () => {
      mountedRef.current = false;
      clearTimeout(searchTimer.current);
    };
  }, [jobId]);

  // debounce search
  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setSearchValue(searchInput.trim().toLowerCase()), 250);
    return () => clearTimeout(searchTimer.current);
  }, [searchInput]);

  // Helpers
  const resolveUrl = (p) => {
    if (!p) return "";
    if (/^https?:\/\//i.test(p)) return p;
    return `${BASE_URL}${p.startsWith("/") ? p : "/" + p}`;
  };

  const downloadFile = async (path, name) => {
    try {
      const u = resolveUrl(path);
      const res = await fetch(u);
      if (!res.ok) throw new Error("Network error");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Download failed", e);
      alert("Failed to download file.");
    }
  };

  const updateLocal = (id, patch) => {
    setApplications((prev) => prev.map((a) => (String(a.id) === String(id) ? { ...a, ...patch } : a)));
    if (selectedApp?.id === id) setSelectedApp((s) => ({ ...s, ...patch }));
  };

  // Shortlist/Reject — optimistic update
  const updateStatus = async (app, shortlist) => {
    setConfirmAction(null);
    setUpdatingAppId(app.id);

    const original = applications.find((x) => String(x.id) === String(app.id)) || {};
    const newStatus = shortlist ? "SHORTLISTED" : "REJECTED";

    // Prevent re-finalizing
    const currentUpper = String(original.status || "").toUpperCase();
    if (currentUpper.includes("SHORT") || currentUpper.includes("REJECT")) {
      setUpdatingAppId(null);
      return;
    }

    // optimistic
    updateLocal(app.id, { status: newStatus });

    try {
      await axios.put(`${BACKEND_BASE_URL}/hr/job/updateStatus/${app.id}/${shortlist}`);
    } catch (e) {
      console.error("Status update failed", e);
      // revert
      updateLocal(app.id, { status: original.status });
      alert("Failed to update status. See console.");
    } finally {
      setUpdatingAppId(null);
    }
  };

  // formatting and badges
  const fmtDate = (d) => {
    if (!d) return "-";
    const dt = new Date(d);
    if (isNaN(dt)) return d;
    return dt.toLocaleString();
  };

  const statusBadge = (status) => {
    if (!status) return null;
    const s = String(status).toUpperCase();
    if (s.includes("SHORT")) return <span className="px-3 py-1 bg-green-100 text-green-700 rounded font-semibold">SHORTLISTED</span>;
    if (s.includes("REJECT")) return <span className="px-3 py-1 bg-red-100 text-red-700 rounded font-semibold">REJECTED</span>;
    return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded">{status}</span>;
  };

  // final list (filter, search, sort)
  const finalList = useMemo(() => {
    let list = [...applications];

    if (filter === "SHORTLISTED") list = list.filter((a) => (a.status || "").toUpperCase().includes("SHORT"));
    else if (filter === "REJECTED") list = list.filter((a) => (a.status || "").toUpperCase().includes("REJECT"));

    if (searchValue) {
      list = list.filter((a) => (`${a.fullName || ""} ${a.email || ""} ${a.phoneNumber || ""}`).toLowerCase().includes(searchValue));
    }

    list.sort((a, b) => {
      if (sortBy === "NEWEST") return new Date(b.applicationDate || b.createdAt || 0) - new Date(a.applicationDate || a.createdAt || 0);
      if (sortBy === "OLDEST") return new Date(a.applicationDate || a.createdAt || 0) - new Date(b.applicationDate || b.createdAt || 0);
      if (sortBy === "AZ") return (a.fullName || "").localeCompare(b.fullName || "");
      if (sortBy === "ZA") return (b.fullName || "").localeCompare(a.fullName || "");
      return 0;
    });

    return list;
  }, [applications, filter, searchValue, sortBy]);

  if (loading) return <div className="p-6 text-gray-600">Loading applications...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">
            Applications for: <span className="text-sky-700">{jobDetails?.title || "—"}</span>
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Job ID: {jobId} · Total Applicants: <span className="font-semibold text-indigo-600">{applications.length}</span>
          </p>

          {/* Tabs */}
          <div className="mt-4 flex gap-3">
            <button onClick={() => setFilter("ALL")} className={`px-4 py-2 rounded ${filter === "ALL" ? "bg-sky-600 text-white" : "bg-gray-200"}`}>All ({applications.length})</button>
            <button onClick={() => setFilter("SHORTLISTED")} className={`px-4 py-2 rounded ${filter === "SHORTLISTED" ? "bg-green-600 text-white" : "bg-gray-200"}`}>Shortlisted ({applications.filter(a => (a.status||"").toUpperCase().includes("SHORT")).length})</button>
            <button onClick={() => setFilter("REJECTED")} className={`px-4 py-2 rounded ${filter === "REJECTED" ? "bg-red-600 text-white" : "bg-gray-200"}`}>Rejected ({applications.filter(a => (a.status||"").toUpperCase().includes("REJECT")).length})</button>
          </div>
        </div>

        {/* Controls (no export CSV now) */}
        <div className="flex items-center gap-3">
          <select className="border px-3 py-2 rounded" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="NEWEST">Newest</option>
            <option value="OLDEST">Oldest</option>
            <option value="AZ">A–Z</option>
            <option value="ZA">Z–A</option>
          </select>

          <input
            type="text"
            className="border px-3 py-2 rounded w-64"
            placeholder="Search name, email, phone"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />

          <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-200 rounded">Back</button>
        </div>
      </div>

      {/* Minimal List: NAME / EMAIL / PHONE / DATE / VIEW */}
      {finalList.length === 0 ? (
        <div className="p-6 border rounded text-gray-600">No applications found.</div>
      ) : (
        <div className="space-y-3">
          {finalList.map((app) => (
            <div key={app.id} className="p-4 border bg-white rounded shadow-sm flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-4">
                  <div className="font-medium truncate">{app.fullName || "Unknown"}</div>
                  <div className="text-sm text-gray-500 truncate">{app.email}</div>
                  <div className="text-sm text-gray-500 truncate">· {app.phoneNumber}</div>
                </div>

                <div className="text-xs text-gray-500 mt-1">{fmtDate(app.applicationDate)}</div>
              </div>

              <div>
                <button onClick={() => setSelectedApp(app)} className="px-3 py-1 bg-sky-600 text-white rounded">View</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PROFESSIONAL SLIDE-IN VIEW PANEL */}
      {selectedApp && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setSelectedApp(null)} />

          <aside className="fixed right-0 top-0 h-full w-full md:w-[44%] lg:w-[36%] p-6 z-50 glass-panel overflow-auto" style={{ animation: "slideInRight .18s ease-out" }}>
            {/* Header (avatar + name + status) */}
            <div className="view-header mb-4">
              <div className="view-avatar">
                {((selectedApp.fullName || "U").split(" ").map(n => n[0] || "").slice(0,2).join("").toUpperCase())}
              </div>

              <div style={{ flex: 1 }}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold">{selectedApp.fullName || "Unknown"}</h2>
                    <div className="text-sm text-gray-600">{selectedApp.email} · {selectedApp.phoneNumber}</div>
                    <div className="text-sm text-gray-500 mt-1">Applied: {fmtDate(selectedApp.applicationDate)}</div>
                  </div>

                  <div>
                    {/* status badge (final only) */}
                    {statusBadge(selectedApp.status)}
                  </div>
                </div>

                <div className="text-sm text-gray-500 mt-3">Position: <strong>{jobDetails?.title || "-"}</strong></div>
              </div>
            </div>

            {/* Action area */}
            <div className="view-section mb-4">
              <div className="flex items-center justify-between">
                <h4>Decision</h4>
                <div className="text-sm text-gray-500">Make final selection</div>
              </div>

              <div className="mt-3 flex items-center gap-3">
                {/* If already finalized, hide buttons and show badge */}
                {(!selectedApp.status || (!String(selectedApp.status).toUpperCase().includes("SHORT") && !String(selectedApp.status).toUpperCase().includes("REJECT"))) ? (
                  <>
                    <button
                      onClick={() => setConfirmAction({ app: selectedApp, shortlist: true })}
                      className="view-action-btn bg-green-600 text-white"
                    >
                      Shortlist
                    </button>

                    <button
                      onClick={() => setConfirmAction({ app: selectedApp, shortlist: false })}
                      className="view-action-btn bg-red-600 text-white"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <div>{statusBadge(selectedApp.status)}</div>
                )}
              </div>
            </div>

            {/* Resume card */}
            <div className="view-section mb-4">
              <h4>Resume</h4>
              <div className="mt-2 flex flex-col gap-3">
                {selectedApp.resumeUrl ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="view-meta">Uploaded resume</div>
                      <div className="flex gap-2">
                        <a className="px-3 py-2 bg-indigo-600 text-white rounded" href={resolveUrl(selectedApp.resumeUrl)} target="_blank" rel="noreferrer">Open</a>
                        <button className="px-3 py-2 bg-gray-100 rounded" onClick={() => downloadFile(selectedApp.resumeUrl, `${(selectedApp.fullName||"resume").replace(/\s+/g,"_")}.pdf`)}>Download</button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Tip: opens in a new tab for quick review.</div>
                  </>
                ) : (
                  <div className="text-gray-600">No resume uploaded.</div>
                )}
              </div>
            </div>

            


            {/* Close */}
            <div className="flex justify-end gap-3">
              <button onClick={() => setSelectedApp(null)} className="px-4 py-2 bg-gray-100 rounded">Close</button>
            </div>
          </aside>
        </>
      )}

      {/* Confirm modal */}
      {confirmAction && (
        <>
          <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setConfirmAction(null)} />

          <div className="fixed top-[25%] left-1/2 -translate-x-1/2 bg-white shadow-xl rounded p-6 z-50 w-full max-w-md">
            <h3 className="text-lg font-semibold">{confirmAction.shortlist ? "Shortlist Applicant" : "Reject Applicant"}</h3>
            <p className="mt-2 text-gray-700">
              Are you sure you want to <strong>{confirmAction.shortlist ? "shortlist" : "reject"}</strong> <strong>{confirmAction.app.fullName}</strong>?
            </p>

            <div className="flex justify-end gap-3 mt-4">
              <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => setConfirmAction(null)}>Cancel</button>
              <button
                className="px-3 py-1 bg-blue-600 text-white rounded"
                onClick={() => updateStatus(confirmAction.app, confirmAction.shortlist)}
              >
                Confirm
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
