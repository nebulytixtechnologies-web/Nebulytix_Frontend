import { useState } from "react";
import axios from "axios";
import { BACKEND_BASE_URL } from "../../api/config";

export default function GeneratePayslipModal({ employeeId, onClose, onGenerated }) {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  async function handleGenerate() {
    if (!month || !year) {
      alert("Please select month and year.");
      return;
    }

    const monthYear = `${month} ${year}`;

    try {
      const response = await axios.post(`${BACKEND_BASE_URL}/hr/payslip/generate`, {
        employeeId,
        monthYear
      });

      alert("Payslip generated successfully");
      onGenerated?.(response.data);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to generate payslip");
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 w-full max-w-md rounded-lg shadow-lg space-y-4 max-h-[90vh] overflow-y-auto">

        <h2 className="text-xl font-bold text-sky-600 text-center">
          Generate Payslip
        </h2>

        <div className="flex flex-col gap-3">
          <label className="font-medium text-gray-700">Select Month</label>
          <select
            className="border p-2 rounded"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="">-- Select Month --</option>
            {months.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <label className="font-medium text-gray-700">Select Year</label>
          <input
            type="number"
            className="border p-2 rounded"
            placeholder="2025"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-emerald-600 text-white rounded"
            onClick={handleGenerate}
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}
