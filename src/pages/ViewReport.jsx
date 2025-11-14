// src/pages/ViewReport.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_BASE_URL } from "../api/config";

export default function ViewReport() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchReport() {
      setError(null);
      try {
        const token = localStorage.getItem("neb_token"); // if required
        const resp = await axios.get(
          `${BACKEND_BASE_URL}/admin/reports/daily`,
          {
            responseType: "blob",
            headers: {
              Accept: "application/pdf",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        if (cancelled) return;

        const blob = new Blob([resp.data], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (err) {
        console.error("fetchReport error:", err);
        setError(err?.message || "Failed to load report");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchReport();
    return () => {
      cancelled = true;
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, []); // run once on mount

  function handleDownload() {
    if (!pdfUrl) return;
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = `DailyReport.pdf`; // optional: extract filename from headers if exposed
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-4 flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Back
        </button>
        <button
          onClick={handleDownload}
          disabled={!pdfUrl}
          className="px-3 py-1 bg-green-600 text-white rounded"
        >
          Download
        </button>
      </div>

      {loading && <div>Loading report…</div>}
      {error && <div className="text-red-600">Error: {error}</div>}

      {pdfUrl && (
        <div style={{ height: "80vh" }} className="border">
          <iframe
            title="Daily Report"
            src={pdfUrl}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      )}
    </div>
  );
}
