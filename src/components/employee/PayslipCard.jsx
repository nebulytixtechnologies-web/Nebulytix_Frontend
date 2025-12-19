//Nebulytix_Frontend/src/components/employee/PayslipCard.jsx
import { format } from "date-fns";
import axios from "axios";
import { BACKEND_BASE_URL } from "../../api/config";

export default function PayslipCard({ payslip }) {
  const handleView = async () => {
    try {
      const res = await axios.get(
        `${BACKEND_BASE_URL}/hr/payslip/${payslip.id}/download`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      console.error(err);
      alert("Failed to view payslip.");
    }
  };

  const handleDownload = async () => {
    try {
      const res = await axios.get(
        `${BACKEND_BASE_URL}/hr/payslip/${payslip.id}/download`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([res.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = payslip.fileName || `payslip_${payslip.id}.pdf`;
      link.click();
    } catch (err) {
      console.error(err);
      alert("Failed to download payslip.");
    }
  };

  return (
    <div className="p-4 border rounded bg-white shadow flex flex-col md:flex-row justify-between items-center gap-3">
      <div className="flex flex-col text-gray-800">
        <div className="font-semibold text-lg">
          {payslip.fileName || `Payslip #${payslip.id}`}
        </div>
        <div className="text-sm text-gray-600">
          {payslip.employeeEmail || "—"}
        </div>
        <div className="text-sm text-gray-500">
          Month: {payslip.payslipMonth || "N/A"}
        </div>
        <div className="text-sm text-gray-500">
          Generated:{" "}
          {payslip.generatedDate
            ? format(new Date(payslip.generatedDate), "dd MMM yyyy, hh:mm a")
            : "N/A"}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleView}
          className="px-3 py-1 bg-sky-600 text-white rounded"
        >
          View Payslip
        </button>
        <button
          onClick={handleDownload}
          className="px-3 py-1 bg-emerald-600 text-white rounded"
        >
          Download
        </button>
      </div>
    </div>
  );
}
