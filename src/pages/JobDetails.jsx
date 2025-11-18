// src/pages/JobDetails.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ApplicationForm from "../components/career/ApplicationForm";
import { BACKEND_BASE_URL } from "../api/config";

export default function JobDetails({
  job: jobProp = null,
  hideApply = false,
  embed = false,
  onClose = null,
}) {
  // If embedded (HR modal), jobProp will be passed and we skip fetch.
  const params = useParams();
  const idFromParams = params?.id;
  const navigate = useNavigate();

  const [job, setJob] = useState(jobProp);
  const [loading, setLoading] = useState(!Boolean(jobProp));
  const [error, setError] = useState(null);
  const [showApply, setShowApply] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (jobProp) {
      // already have job — no fetch
      setJob(jobProp);
      setLoading(false);
      return () => (mounted = false);
    }
    if (!idFromParams) {
      setLoading(false);
      setError("No job id provided.");
      return;
    }

    setLoading(true);
    axios
      .get(`${BACKEND_BASE_URL}/career/job/${idFromParams}`)
      .then((res) => {
        if (!mounted) return;
        setJob(res.data?.data ?? null);
      })
      .catch((err) => {
        console.error("Job fetch error:", err);
        setError("Could not fetch job details.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [idFromParams, jobProp]);

  // Helper to normalize string/object/array to string[]
  function normalizeList(value) {
    if (!value && value !== 0) return [];
    if (Array.isArray(value)) {
      return value
        .map(String)
        .map((s) => s.trim())
        .filter(Boolean);
    }
    if (typeof value === "string") {
      return value
        .split(/\r?\n|;|•|·|,/)
        .map((s) => s.trim())
        .filter(Boolean);
    }
    if (typeof value === "object") {
      try {
        return Object.values(value)
          .flat(Infinity)
          .map(String)
          .map((s) => s.trim())
          .filter(Boolean);
      } catch {
        return [String(value)];
      }
    }
    return [String(value)];
  }

  if (!embed) {
    // When used as standalone page, render Navbar/Footer (unchanged)
    return (
      <>
        <Navbar />
        <JobDetailsBody
          loading={loading}
          job={job}
          error={error}
          normalizeList={normalizeList}
          showApply={showApply}
          setShowApply={setShowApply}
          hideApply={hideApply}
          onClose={onClose}
        />
        <Footer />
      </>
    );
  }

  // Embedded mode (HR modal) — no Navbar/Footer
  return (
    <JobDetailsBody
      loading={loading}
      job={job}
      error={error}
      normalizeList={normalizeList}
      showApply={showApply}
      setShowApply={setShowApply}
      hideApply={hideApply}
      onClose={onClose}
    />
  );
}

/* Extracted presentational body so we can reuse logic for embed vs page */
function JobDetailsBody({
  loading,
  job,
  error,
  normalizeList,
  showApply,
  setShowApply,
  hideApply,
  onClose,
}) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="p-4 border rounded">Loading job details...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="p-6 border rounded bg-white">
          <div className="text-xl font-semibold">Job not found</div>
          <p className="mt-2 text-gray-600">
            {error || "No job data available."}
          </p>
          <div className="mt-4">
            <button
              onClick={() =>
                typeof onClose === "function" ? onClose() : navigate(-1)
              }
              className="px-3 py-1 bg-sky-600 text-white rounded"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const id = job.id ?? job._id ?? "unknown";
  const requirements = normalizeList(job.requirements);
  const responsibilities = normalizeList(job.responsibilities);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {job.jobTitle || "Untitled Role"}
            </h1>
            <div className="text-sm text-gray-500 mt-1">
              {job.domain || "Domain not specified"} · {job.jobType || "N/A"} ·{" "}
              {job.experienceLevel || "Experience not specified"}
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-600">
              Posted: {job.postedDate ?? "N/A"}
            </div>
            <div className="text-sm text-gray-600">
              Closes: {job.closingDate ?? "N/A"}
            </div>
          </div>
        </div>

        <div className="mt-4 text-gray-700">
          <h3 className="font-semibold">Description</h3>
          <p className="mt-2">
            {job.description || "No description provided."}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold">Requirements</h4>
            {requirements?.length ? (
              <ul className="list-disc list-inside mt-2 text-gray-700 space-y-1">
                {requirements.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 mt-2">
                No specific requirements listed.
              </p>
            )}
          </div>

          <div>
            <h4 className="font-semibold">Responsibilities</h4>
            {responsibilities?.length ? (
              <ul className="list-disc list-inside mt-2 text-gray-700 space-y-1">
                {responsibilities.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 mt-2">
                No responsibilities provided.
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Salary: {job.salaryRange ?? "Not specified"} · Active:{" "}
            {String(job.isActive)}
          </div>

          <div className="flex items-center gap-3">
            {!hideApply && (
              <button
                onClick={() => setShowApply(true)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Apply
              </button>
            )}

            <button
              onClick={() =>
                typeof onClose === "function"
                  ? onClose()
                  : window.history.back()
              }
              className="px-3 py-2 bg-gray-100 rounded"
            >
              Back
            </button>
          </div>
        </div>
      </div>

      {showApply && (
        <div className="mt-6">
          <ApplicationForm
            job={job}
            onClose={() => setShowApply(false)}
            onSuccess={() => setShowApply(false)}
          />
        </div>
      )}
    </div>
  );
}
