//Nebulytix_Frontend/src/components/hr/PayslipCardHR.jsx
import { format } from "date-fns";
import axios from "axios";
import { BACKEND_BASE_URL } from "../../api/config";

export default function PayslipCardHR({ payslip, onDelete }) {
  const handleView = async () => {
    try {
      const res = await axios.get(
        `${BACKEND_BASE_URL}/hr/payslip/${payslip.id}/download`,
        { responseType: "blob" }
      );
      const blob = new Blob([res.data], { type: "application/pdf" });
      window.open(URL.createObjectURL(blob), "_blank");
    } catch (err) {
      console.error(err);
      alert("Failed to view payslip.");
    }
  };

  const handleDownload = async () => {
    try {
      const res = await axios.get(
        `${BACKEND_BASE_URL}/hr/payslip/${payslip.id}/download`,
        { responseType: "blob" }
      );
      const blob = new Blob([res.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = payslip.fileName || `payslip_${payslip.id}.pdf`;
      link.click();
    } catch (err) {
      console.error(err);
      alert("Failed to download payslip.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this payslip?")) return;

    try {
      await axios.delete(
        `${BACKEND_BASE_URL}/hr/delete/payslip/${payslip.id}`
      );
      onDelete(payslip.id); // remove from UI
    } catch (err) {
      console.error(err);
      alert("Failed to delete payslip.");
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

        {/* 🔴 HR ONLY DELETE */}
        <button
          onClick={handleDelete}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
