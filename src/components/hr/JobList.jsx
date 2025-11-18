// src/components/hr/JobList.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_BASE_URL } from "../../api/config";
import JobCard from "./JobCard";

export default function JobList({ refreshKey = 0 }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    axios
      .get(`${BACKEND_BASE_URL}/hr/allJobs`)
      .then((res) => {
        if (!mounted) return;
        const data = Array.isArray(res.data.data) ? res.data.data : [];
        setJobs(data);
      })
      .catch((err) => {
        console.error(err);
        if (!mounted) return;
        setJobs([]);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => (mounted = false);
  }, [refreshKey]);

  // Handler passed to JobCard so it can remove itself from UI after successful delete
  function handleJobDeleted(deletedId) {
    setJobs((prev) =>
      prev.filter((j) => {
        const jid = j.id ?? j._id;
        return String(jid) !== String(deletedId);
      })
    );
  }

  if (loading) return <div className="p-3 border rounded">Loading jobs...</div>;
  if (!jobs.length)
    return (
      <div className="p-3 border rounded text-gray-600">
        There is no opening.
      </div>
    );

  return (
    <div className="space-y-3 mt-3">
      {jobs.map((j) => (
        <JobCard key={j.id ?? j._id} job={j} onJobDeleted={handleJobDeleted} />
      ))}
    </div>
  );
}
