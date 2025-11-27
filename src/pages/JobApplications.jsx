// src/pages/hr/JobApplications.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_BASE_URL, BASE_URL } from "../api/config";

export default function JobApplications() {
  const { id: jobId } = useParams();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [jobDetails, setJobDetails] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [updatingAppId, setUpdatingAppId] = useState(null);

  const [filter, setFilter] = useState("ALL");
  const [searchInput, setSearchInput] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState("NEWEST");

  const mountedRef = useRef(true);
  const searchTimer = useRef(null);

  // NEW: email popup states
  const [openMailBox, setOpenMailBox] = useState(false);
  const [mailType, setMailType] = useState(""); // "SHORTLISTED" or "REJECTED"
  const [mailSubject, setMailSubject] = useState("");
  const [mailMessage, setMailMessage] = useState("");
  const [sendingMail, setSendingMail] = useState(false);

  useEffect(() => {
    mountedRef.current = true;
    setLoading(true);
    setError(null);

    const rApps = axios.get(
      `${BACKEND_BASE_URL}/career/job/${jobId}/applications`
    );
    const rJob = axios.get(`${BACKEND_BASE_URL}/career/job/${jobId}`);

    Promise.all([rApps, rJob])
      .then(([appsRes, jobRes]) => {
        if (!mountedRef.current) return;
        setApplications(
          Array.isArray(appsRes.data?.data) ? appsRes.data.data : []
        );
        setJobDetails(jobRes.data?.data || null);
      })
      .catch((e) => {
        console.error("Failed to load job/applications:", e);
        if (!mountedRef.current) return;
        setError("Failed to load data.");
      })
      .finally(() => mountedRef.current && setLoading(false));

    return () => {
      mountedRef.current = false;
      clearTimeout(searchTimer.current);
    };
  }, [jobId]);

  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setSearchValue(searchInput.trim().toLowerCase());
    }, 250);

    return () => clearTimeout(searchTimer.current);
  }, [searchInput]);

  const resolveUrl = (p) => {
    if (!p) return "";
    if (/^https?:\/\//i.test(p)) return p;
    return `${BASE_URL}${p.startsWith("/") ? p : "/" + p}`;
  };

  const downloadFile = async (path, name) => {
    try {
      const u = resolveUrl(path);
      const res = await fetch(u);
      if (!res.ok) throw new Error("File download failed.");

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
    setApplications((prev) =>
      prev.map((a) => (String(a.id) === String(id) ? { ...a, ...patch } : a))
    );
    if (selectedApp?.id === id) {
      setSelectedApp((s) => ({ ...s, ...patch }));
    }
  };

  const updateStatus = async (app, shortlist) => {
    setConfirmAction(null);
    setUpdatingAppId(app.id);

    const original =
      applications.find((x) => String(x.id) === String(app.id)) || {};
    const newStatus = shortlist ? "SHORTLISTED" : "REJECTED";

    const statusUpper = String(original.status || "").toUpperCase();
    if (statusUpper.includes("SHORT") || statusUpper.includes("REJECT")) {
      setUpdatingAppId(null);
      return;
    }

    updateLocal(app.id, { status: newStatus });

    try {
      await axios.put(
        `${BACKEND_BASE_URL}/hr/job/updateStatus/${app.id}/${shortlist}`
      );
    } catch (e) {
      console.error("Status update failed", e);
      updateLocal(app.id, { status: original.status });
      alert("Failed to update status.");
    } finally {
      setUpdatingAppId(null);
    }
  };

  // NEW: send mail function
  const sendMail = async () => {
    if (!mailSubject.trim() || !mailMessage.trim()) {
      alert("Subject and message are required.");
      return;
    }

    setSendingMail(true);

    try {
      const body = { subject: mailSubject, message: mailMessage };

      if (mailType === "SHORTLISTED") {
        await axios.post(
          `${BACKEND_BASE_URL}/hr/job/sendShortlistedEmails`,
          body
        );
      } else if (mailType === "REJECTED") {
        await axios.post(
          `${BACKEND_BASE_URL}/hr/job/sendRejectedEmails`,
          body
        );
      }

      alert("Email sent successfully!");
      setOpenMailBox(false);
      setMailSubject("");
      setMailMessage("");
      setMailType("");
    } catch (e) {
      console.error("Failed to send email", e);
      alert("Failed to send email.");
    } finally {
      setSendingMail(false);
    }
  };

  const fmtDate = (d) => {
    if (!d) return "-";
    const dt = new Date(d);
    return dt.toLocaleString();
  };

  const statusBadge = (status) => {
    if (!status) return null;
    const s = String(status).toUpperCase();

    if (s.includes("SHORT"))
      return (
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded font-semibold">
          SHORTLISTED
        </span>
      );

    if (s.includes("REJECT"))
      return (
        <span className="px-3 py-1 bg-red-100 text-red-700 rounded font-semibold">
          REJECTED
        </span>
      );

    return (
      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded">
        {status}
      </span>
    );
  };

  const finalList = useMemo(() => {
    let list = [...applications];

    if (filter === "SHORTLISTED")
      list = list.filter((a) =>
        (a.status || "").toUpperCase().includes("SHORT")
      );
    else if (filter === "REJECTED")
      list = list.filter((a) =>
        (a.status || "").toUpperCase().includes("REJECT")
      );

    if (searchValue) {
      list = list.filter((a) =>
        `${a.fullName || ""} ${a.email || ""} ${a.phoneNumber || ""}`
          .toLowerCase()
          .includes(searchValue)
      );
    }

    list.sort((a, b) => {
      if (sortBy === "NEWEST")
        return new Date(b.applicationDate || 0) - new Date(a.applicationDate || 0);

      if (sortBy === "OLDEST")
        return new Date(a.applicationDate || 0) - new Date(b.applicationDate || 0);

      if (sortBy === "AZ")
        return (a.fullName || "").localeCompare(b.fullName || "");

      if (sortBy === "ZA")
        return (b.fullName || "").localeCompare(a.fullName || "");

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
            Applications for:{" "}
            <span className="text-sky-700">{jobDetails?.title || "—"}</span>
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Job ID: {jobId} · Total Applicants:
            <span className="font-semibold text-indigo-600">
              {" "}
              {applications.length}
            </span>
          </p>

          {/* Tabs */}
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-4 py-2 rounded ${
                filter === "ALL" ? "bg-sky-600 text-white" : "bg-gray-200"
              }`}
            >
              All ({applications.length})
            </button>
            <button
              onClick={() => setFilter("SHORTLISTED")}
              className={`px-4 py-2 rounded ${
                filter === "SHORTLISTED"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              Shortlisted (
              {
                applications.filter((a) =>
                  (a.status || "").toUpperCase().includes("SHORT")
                ).length
              }
              )
            </button>
            <button
              onClick={() => setFilter("REJECTED")}
              className={`px-4 py-2 rounded ${
                filter === "REJECTED"
                  ? "bg-red-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              Rejected (
              {
                applications.filter((a) =>
                  (a.status || "").toUpperCase().includes("REJECT")
                ).length
              }
              )
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <select
            className="border px-3 py-2 rounded"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
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

          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Back
          </button>
        </div>
      </div>

      {/* List + bottom mail button (Option B) */}
      {finalList.length === 0 ? (
        <div className="p-6 border rounded text-gray-600">
          No applications found.
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {finalList.map((app) => (
              <div
                key={app.id}
                className="p-4 border bg-white rounded shadow-sm flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-4">
                    <div className="font-medium">{app.fullName}</div>
                    <div className="text-sm text-gray-500">{app.email}</div>
                    <div className="text-sm text-gray-500">
                      · {app.phoneNumber}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {fmtDate(app.applicationDate)}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedApp(app)}
                  className="px-3 py-1 bg-sky-600 text-white rounded"
                >
                  View
                </button>
              </div>
            ))}
          </div>

          {(filter === "SHORTLISTED" || filter === "REJECTED") && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setMailType(filter); // "SHORTLISTED" or "REJECTED"
                  setOpenMailBox(true);
                }}
                className={`px-4 py-2 rounded text-white ${
                  filter === "SHORTLISTED"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {filter === "SHORTLISTED"
                  ? "Send Mail to All Shortlisted"
                  : "Send Mail to All Rejected"}
              </button>
            </div>
          )}
        </>
      )}

      {/* --- PROFESSIONAL SLIDE-IN PANEL --- */}
      {selectedApp && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSelectedApp(null)}
          />

          <aside className="fixed right-0 top-0 h-full w-full md:w-[46%] lg:w-[34%] bg-white shadow-2xl z-50 overflow-y-auto rounded-l-2xl transform animate-slideIn">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-sky-600 to-indigo-600 text-white rounded-tl-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-lg font-bold backdrop-blur-md">
                  {(selectedApp.fullName || "U")
                    .split(" ")
                    .map((x) => x[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </div>

                <div className="flex-1">
                  <h2 className="text-xl font-semibold">
                    {selectedApp.fullName}
                  </h2>
                  <p className="text-xs text-white/90">{selectedApp.email}</p>
                  <p className="text-xs text-white/90">
                    {selectedApp.phoneNumber}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedApp(null)}
                  className="text-white text-xl hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs mt-2 opacity-90">
                Applied: {fmtDate(selectedApp.applicationDate)}
              </p>
              <p className="text-xs opacity-90">
                Position: <strong>{jobDetails?.title}</strong>
              </p>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="bg-gray-50 p-4 rounded-xl border">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Application Status</h3>
                  {statusBadge(selectedApp.status)}
                </div>

                {!String(selectedApp.status)
                  .toUpperCase()
                  .includes("SHORT") &&
                !String(selectedApp.status)
                  .toUpperCase()
                  .includes("REJECT") ? (
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() =>
                        setConfirmAction({
                          app: selectedApp,
                          shortlist: true,
                        })
                      }
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                    >
                      Shortlist
                    </button>
                    <button
                      onClick={() =>
                        setConfirmAction({
                          app: selectedApp,
                          shortlist: false,
                        })
                      }
                      className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                ) : null}
              </div>

              {/* Resume */}
              <div className="bg-gray-50 p-5 rounded-xl border">
                <h3 className="text-lg font-semibold mb-3">Resume</h3>

                {selectedApp.resumeUrl ? (
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm border">
                    <div className="font-medium text-gray-700">
                      {selectedApp.fullName}'s Resume
                    </div>

                    <div className="flex gap-2">
                      <a
                        href={resolveUrl(selectedApp.resumeUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700"
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
                        className="px-3 py-1.5 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600">No resume uploaded.</p>
                )}
              </div>

              {/* Additional Info */}
              <div className="bg-gray-50 p-5 rounded-xl border">
                <h3 className="text-lg font-semibold mb-2">Additional Info</h3>
                <p className="text-sm text-gray-600">
                  Email: <strong>{selectedApp.email}</strong>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Mobile: <strong>{selectedApp.phoneNumber}</strong>
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Confirm Modal */}
      {confirmAction && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-50"
            onClick={() => setConfirmAction(null)}
          />

          <div className="fixed top-[25%] left-1/2 -translate-x-1/2 bg-white shadow-xl rounded p-6 z-50 w-full max-w-md">
            <h3 className="text-lg font-semibold">
              {confirmAction.shortlist
                ? "Shortlist Applicant"
                : "Reject Applicant"}
            </h3>

            <p className="mt-2 text-gray-700">
              Are you sure you want to{" "}
              <strong>
                {confirmAction.shortlist ? "shortlist" : "reject"}
              </strong>{" "}
              <strong>{confirmAction.app.fullName}</strong>?
            </p>

            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-3 py-1 bg-gray-200 rounded"
                onClick={() => setConfirmAction(null)}
              >
                Cancel
              </button>

              <button
                className="px-3 py-1 bg-blue-600 text-white rounded"
                onClick={() =>
                  updateStatus(confirmAction.app, confirmAction.shortlist)
                }
              >
                Confirm
              </button>
            </div>
          </div>
        </>
      )}

      {/* Email Modal */}
      {openMailBox && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-50"
            onClick={() => setOpenMailBox(false)}
          />

          <div className="fixed top-[20%] left-1/2 -translate-x-1/2 bg-white shadow-xl rounded p-6 z-50 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-2">
              Send Email to All{" "}
              {mailType === "SHORTLISTED" ? "Shortlisted" : "Rejected"}{" "}
              Applicants
            </h3>

            <input
              type="text"
              placeholder="Email Subject"
              value={mailSubject}
              onChange={(e) => setMailSubject(e.target.value)}
              className="w-full border p-2 mt-2 rounded"
            />

            <textarea
              placeholder="Type your message..."
              value={mailMessage}
              onChange={(e) => setMailMessage(e.target.value)}
              className="w-full border p-2 mt-3 rounded h-32"
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setOpenMailBox(false)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                Cancel
              </button>

              <button
                onClick={sendMail}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
                disabled={sendingMail}
              >
                {sendingMail ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
