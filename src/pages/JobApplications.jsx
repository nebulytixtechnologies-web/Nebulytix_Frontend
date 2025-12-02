// src/pages/hr/JobApplications.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_BASE_URL, BASE_URL } from "../api/config";

import JobApplicationsHeader from "../components/job-applications/JobApplicationsHeader";
import ApplicationsTable from "../components/job-applications/ApplicationsTable";
import ApplicantDrawer from "../components/job-applications/ApplicantDrawer";
import ConfirmDialog from "../components/job-applications/ConfirmDialog";
import EmailModal from "../components/job-applications/EmailModal";

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

  const [openMailBox, setOpenMailBox] = useState(false);
  const [mailType, setMailType] = useState(""); // "SHORTLISTED" | "REJECTED" | "INVITED_SINGLE" | "TERMINATED_SINGLE"
  const [mailSubject, setMailSubject] = useState("");
  const [mailMessage, setMailMessage] = useState("");
  const [sendingMail, setSendingMail] = useState(false);
  const [mailTargetApp, setMailTargetApp] = useState(null); // null => bulk, object => single

  const mountedRef = useRef(true);
  const searchTimer = useRef(null);

  // ---------- DATA FETCH ----------
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

  // ---------- SEARCH DEBOUNCE ----------
  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setSearchValue(searchInput.trim().toLowerCase());
    }, 250);

    return () => clearTimeout(searchTimer.current);
  }, [searchInput]);

  // ---------- HELPERS ----------
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

  const fmtDate = (d) => {
    if (!d) return "-";
    const dt = new Date(d);
    return dt.toLocaleString();
  };

  const statusBadge = (status) => {
    if (!status) {
      return (
        <span className="inline-flex px-2.5 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-medium">
          Pending
        </span>
      );
    }

    const s = String(status).toUpperCase();

    if (s.includes("INVITED"))
      return (
        <span className="inline-flex px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
          Invited
        </span>
      );

    if (s.includes("TERMINATED"))
      return (
        <span className="inline-flex px-2.5 py-1 bg-red-50 text-red-700 rounded-full text-xs font-semibold">
          Terminated
        </span>
      );

    if (s.includes("SHORT"))
      return (
        <span className="inline-flex px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
          Shortlisted
        </span>
      );

    if (s.includes("REJECT"))
      return (
        <span className="inline-flex px-2.5 py-1 bg-red-50 text-red-700 rounded-full text-xs font-semibold">
          Rejected
        </span>
      );

    return (
      <span className="inline-flex px-2.5 py-1 bg-gray-50 text-gray-700 rounded-full text-xs">
        {status}
      </span>
    );
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
    if (
      statusUpper.includes("SHORT") ||
      statusUpper.includes("REJECT") ||
      statusUpper.includes("INVITED") ||
      statusUpper.includes("TERMINATED")
    ) {
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

  // ---------- EMAIL SENDER ----------
  const sendMail = async () => {
    if (!mailSubject.trim() || !mailMessage.trim()) {
      alert("Subject and message are required.");
      return;
    }

    setSendingMail(true);

    try {
      const body = { subject: mailSubject, message: mailMessage };

      if (mailTargetApp) {
        // Individual mail
        if (mailType === "INVITED_SINGLE") {
          await axios.post(
            `${BACKEND_BASE_URL}/hr/job/sendInvitedEmail/${mailTargetApp.id}`,
            body
          );
          updateLocal(mailTargetApp.id, { status: "INVITED" });
        } else if (mailType === "TERMINATED_SINGLE") {
          await axios.post(
            `${BACKEND_BASE_URL}/hr/job/sendRejectedEmail/${mailTargetApp.id}`,
            body
          );
          updateLocal(mailTargetApp.id, { status: "TERMINATED" });
        } else {
          await axios.post(
            `${BACKEND_BASE_URL}/hr/job/sendInvitedEmail/${mailTargetApp.id}`,
            body
          );
          updateLocal(mailTargetApp.id, { status: "INVITED" });
        }
      } else {
        // Bulk mail
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
      }

      alert("Email sent successfully!");
      setOpenMailBox(false);
      setMailSubject("");
      setMailMessage("");
      setMailType("");
      setMailTargetApp(null);
    } catch (e) {
      console.error("Failed to send email", e);
      alert("Failed to send email.");
    } finally {
      setSendingMail(false);
    }
  };

  // ---------- DERIVED DATA ----------
  const finalList = useMemo(() => {
    let list = [...applications];

    const byStatus = (a) => (a.status || "").toUpperCase();

    if (filter === "SHORTLISTED")
      list = list.filter((a) => byStatus(a).includes("SHORT"));
    else if (filter === "REJECTED")
      list = list.filter((a) => byStatus(a).includes("REJECT"));
    else if (filter === "PENDING")
      list = list.filter((a) => {
        const s = byStatus(a);
        return (
          !s.includes("SHORT") &&
          !s.includes("REJECT") &&
          !s.includes("INVITED") &&
          !s.includes("TERMINATED")
        );
      });
    else if (filter === "INVITED")
      list = list.filter((a) => byStatus(a).includes("INVITED"));
    else if (filter === "TERMINATED")
      list = list.filter((a) => byStatus(a).includes("TERMINATED"));

    if (searchValue) {
      list = list.filter((a) =>
        `${a.fullName || ""} ${a.email || ""} ${a.phoneNumber || ""}`
          .toLowerCase()
          .includes(searchValue)
      );
    }

    list.sort((a, b) => {
      if (sortBy === "NEWEST")
        return (
          new Date(b.applicationDate || 0) -
          new Date(a.applicationDate || 0)
        );

      if (sortBy === "OLDEST")
        return (
          new Date(a.applicationDate || 0) -
          new Date(b.applicationDate || 0)
        );

      if (sortBy === "AZ")
        return (a.fullName || "").localeCompare(b.fullName || "");

      if (sortBy === "ZA")
        return (b.fullName || "").localeCompare(a.fullName || "");

      return 0;
    });

    return list;
  }, [applications, filter, searchValue, sortBy]);

  const totals = useMemo(() => {
    const upper = (s) => (s || "").toUpperCase();

    const totalShortlisted = applications.filter((a) =>
      upper(a.status).includes("SHORT")
    ).length;

    const totalRejected = applications.filter((a) =>
      upper(a.status).includes("REJECT")
    ).length;

    const totalPending = applications.filter((a) => {
      const s = upper(a.status);
      return (
        !s.includes("SHORT") &&
        !s.includes("REJECT") &&
        !s.includes("INVITED") &&
        !s.includes("TERMINATED")
      );
    }).length;

    const totalInvited = applications.filter((a) =>
      upper(a.status).includes("INVITED")
    ).length;

    const totalTerminated = applications.filter((a) =>
      upper(a.status).includes("TERMINATED")
    ).length;

    return {
      totalShortlisted,
      totalRejected,
      totalPending,
      totalInvited,
      totalTerminated,
    };
  }, [applications]);

  // ---------- SIMPLE STATES ----------
  if (loading)
    return (
      <div className="p-8 text-gray-600 text-sm">
        Loading applications…
      </div>
    );

  if (error)
    return (
      <div className="p-8 text-red-600 text-sm">
        {error}
      </div>
    );

  // ---------- RENDER ----------
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <JobApplicationsHeader
        jobDetails={jobDetails}
        jobId={jobId}
        applicationsCount={applications.length}
        filter={filter}
        setFilter={setFilter}
        totals={totals}
        sortBy={sortBy}
        setSortBy={setSortBy}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        onBack={() => navigate(-1)}
        onBulkMailClick={(type) => {
          setMailType(type); // "SHORTLISTED" or "REJECTED"
          setMailTargetApp(null);
          setOpenMailBox(true);
        }}
      />

      <ApplicationsTable
        applications={finalList}
        filter={filter}
        statusBadge={statusBadge}
        fmtDate={fmtDate}
        onSelectApp={setSelectedApp}
        onOpenMailForApp={(app, type) => {
          setMailType(type); // "INVITED_SINGLE" | "TERMINATED_SINGLE"
          setMailTargetApp(app);
          setOpenMailBox(true);
        }}
      />

      {/* Drawer - Applicant details */}
      {selectedApp && (
        <ApplicantDrawer
          selectedApp={selectedApp}
          jobDetails={jobDetails}
          fmtDate={fmtDate}
          statusBadge={statusBadge}
          resolveUrl={resolveUrl}
          downloadFile={downloadFile}
          onClose={() => setSelectedApp(null)}
          onShortlist={() =>
            setConfirmAction({ app: selectedApp, shortlist: true })
          }
          onReject={() =>
            setConfirmAction({ app: selectedApp, shortlist: false })
          }
        />
      )}

      {/* Confirm Shortlist / Reject */}
      {confirmAction && (
        <ConfirmDialog
          confirmAction={confirmAction}
          onCancel={() => setConfirmAction(null)}
          onConfirm={(action) => updateStatus(action.app, action.shortlist)}
          loadingId={updatingAppId}
        />
      )}

      {/* Email modal */}
      {openMailBox && (
        <EmailModal
          mailType={mailType}
          mailTargetApp={mailTargetApp}
          mailSubject={mailSubject}
          setMailSubject={setMailSubject}
          mailMessage={mailMessage}
          setMailMessage={setMailMessage}
          sendingMail={sendingMail}
          onClose={() => {
            setOpenMailBox(false);
            setMailTargetApp(null);
            setMailType("");
          }}
          onSend={sendMail}
        />
      )}
    </div>
  );
}
