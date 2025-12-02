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
  const params = useParams();
  const idFromParams = params?.id;
  const navigate = useNavigate();

  const [job, setJob] = useState(jobProp);
  const [loading, setLoading] = useState(!Boolean(jobProp));
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    if (jobProp) {
      setJob(jobProp);
      setLoading(false);
      return () => (mounted = false);
    }

    if (!idFromParams) {
      setLoading(false);
      setError("No job ID provided.");
      return;
    }

    setLoading(true);
    axios
      .get(`${BACKEND_BASE_URL}/career/job/${idFromParams}`)
      .then((res) => {
        if (!mounted) return;
        setJob(res.data?.data ?? null);
      })
      .catch(() => setError("Could not fetch job details."))
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => (mounted = false);
  }, [idFromParams, jobProp]);

  // STANDALONE PAGE MODE
  if (!embed) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-6 bg-gray-50">
          <JobDetailsBody
            loading={loading}
            job={job}
            error={error}
            hideApply={hideApply}
            onClose={onClose}
          />
        </div>
        <Footer />
      </>
    );
  }

  // EMBEDDED MODE (HR modal)
  return (
    <JobDetailsBody
      loading={loading}
      job={job}
      error={error}
      hideApply={hideApply}
      onClose={onClose}
    />
  );
}

/* ----------------------------------------------------------------------
   MAIN BODY — Updated to match reference (side-by-side form)
---------------------------------------------------------------------- */

function JobDetailsBody({ loading, job, error, hideApply, onClose }) {
  const navigate = useNavigate();

  const getDaysAgo = (dateString) => {
    if (!dateString) return null;
    const postedDate = new Date(dateString);
    const today = new Date();
    const diffDays = Math.floor((today - postedDate) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Posted today";
    if (diffDays === 1) return "Posted 1 day ago";
    return `Posted ${diffDays} days ago`;
  };

  const formatDate = (d) => {
    if (!d) return "Not specified";
    const dt = new Date(d);
    return `${dt.getMonth() + 1}-${dt.getDate()}-${dt.getFullYear()}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white p-4 rounded shadow">Loading job details...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold">Job Not Found</h2>
          <p className="mt-2 text-gray-600">{error || "No job details available."}</p>

          <button
            onClick={() =>
              typeof onClose === "function" ? onClose() : navigate(-1)
            }
            className="mt-4 px-4 py-2 bg-sky-600 text-white rounded"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------
       UI STARTS HERE (Reference Layout)
  ------------------------------------------------------------------ */
  return (
    <main className="max-w-6xl mx-auto px-6 pb-12">

      {/* ===== BLUE BANNER (Reference UI) ===== */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white rounded-2xl shadow-xl p-10 mb-12">

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-wide mb-6">
          {job.jobTitle}
        </h1>

        <div className="flex flex-wrap gap-4 text-sm md:text-base">

          <div className="bg-white/10 px-4 py-2 rounded-full border border-white/20 backdrop-blur">
            {getDaysAgo(job.postedDate || job.createdAt)}
          </div>

          {job.domain && (
            <div className="bg-white/10 px-4 py-2 rounded-full border border-white/20 backdrop-blur">
              Domain: {job.domain}
            </div>
          )}

          {job.id && (
            <div className="bg-white/10 px-4 py-2 rounded-full border border-white/20 backdrop-blur">
              Job Code: {job.id}
            </div>
          )}

        </div>
      </div>

      {/* ===== JOB DETAILS + APPLICATION FORM (SIDE BY SIDE) ===== */}
      <div className="bg-white rounded-xl shadow-md p-8 grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* ---------------- LEFT: Job Details ---------------- */}
        <section className="md:border-r pr-6">

          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Job Description</h2>

          <p className="text-gray-700 whitespace-pre-line leading-relaxed mb-6">
            {job.description || "No description provided."}
          </p>

          <div className="space-y-2 text-gray-700">
            <p><strong>Experience:</strong> {job.experienceLevel}</p>
            <p><strong>Type:</strong> {job.jobType}</p>
            <p><strong>Domain:</strong> {job.domain}</p>

            {/* ✔ NEW LOCATION FIELD ADDED HERE */}
            {job.location && (
              <p><strong>Location:</strong> {job.location}</p>
            )}

            {job.salaryRange && (
              <p><strong>Salary Range:</strong> {job.salaryRange}</p>
            )}

            {job.closingDate && (
              <p><strong>Last Date:</strong> {formatDate(job.closingDate)}</p>
            )}
          </div>

          {job.requirements && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-blue-700 mb-2">Requirements</h3>
              <p className="text-gray-700 whitespace-pre-line">{job.requirements}</p>
            </div>
          )}

          {job.responsibilities && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-blue-700 mb-2">Responsibilities</h3>
              <p className="text-gray-700 whitespace-pre-line">{job.responsibilities}</p>
            </div>
          )}
        </section>

        {/* ---------------- RIGHT: Application Form ---------------- */}
        <section className="pl-6">

          <ApplicationForm
            job={job}
            onClose={() => {}}
            onSuccess={() => {}}
          />

        </section>

      </div>
    </main>
  );
}
