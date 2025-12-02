//src/components/career/JobList.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_BASE_URL } from "../../api/config";
import JobCard from "./JobCard";
import NoOpenings from "./NoOpenings";

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
      .catch(() => {
        if (!mounted) return;
        setJobs([]);
        setError("Could not load jobs from backend.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <div className="p-4 border rounded">Loading job openings...</div>;
  }

  if (!jobs.length) {
    return <NoOpenings error={error} />;
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobCard
          key={job.id ?? job._id}
          job={job}
          onView={() => navigate(`/career/job/${job.id ?? job._id}`)}
        />
      ))}
    </div>
  );
}
