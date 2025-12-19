// src/pages/ViewDailyReport.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_BASE_URL, BASE_URL } from "../api/config";
import { Download, RefreshCw, AlertCircle, X } from "lucide-react";

export default function ViewDailyReport({ onClose }) {
  const [reportUrl, setReportUrl] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadReport() {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_BASE_URL}/hr/dailyReport/url`);
      if (res.data?.data) {
        setReportUrl(`${BASE_URL}${res.data.data}`);
      } else {
        setReportUrl("");
      }
    } catch {
      setReportUrl("");
    }
    setLoading(false);
  }

  useEffect(() => {
    loadReport();
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-gray-100">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-8 py-4 border-b bg-white">
        <h1 className="text-lg font-semibold text-gray-800">
          Daily Report
        </h1>

        <div className="flex items-center gap-3">
          {reportUrl && (
            <a
              href={reportUrl}
              download
              className="px-4 py-2 text-sm bg-gray-900 text-white hover:bg-gray-800 transition"
            >
              Download
            </a>
          )}

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="h-[calc(100vh-64px)]">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <RefreshCw className="animate-spin mb-3" size={32} />
            <span className="text-sm">Loading report…</span>
          </div>
        ) : reportUrl ? (
          <iframe
            src={reportUrl}
            title="Daily Report"
            className="w-full h-full bg-white"
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-600">
            <AlertCircle size={36} className="mb-3" />
            <p className="text-sm">
              No daily report available for today.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
