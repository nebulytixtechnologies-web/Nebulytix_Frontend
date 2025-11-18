import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_BASE_URL } from "../../api/config";
import PayslipCard from "./PayslipCard";

export default function PayslipListModal({ employee, onClose }) {
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const empId = employee.id ?? employee._id;

    axios
      .get(`${BACKEND_BASE_URL}/hr/payslip/${empId}`)
      .then((res) => {
        console.log("Payslip list:", res.data);
        if (!mounted) return;
        setPayslips(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Failed to fetch payslips:", err);
        if (!mounted) return;
        setPayslips([]);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => (mounted = false);
  }, [employee]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative max-w-3xl w-full bg-white rounded shadow p-6 z-10
                      max-h-[85vh] overflow-y-auto">
        {/* ↑---------------------------------------------↑
            Added scroll + max height, nothing else touched
        */}

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Payslips - {employee.firstName} {employee.lastName}
          </h3>
          <button onClick={onClose} className="text-gray-500 text-lg">
            ✕
          </button>
        </div>

        {loading ? (
          <div>Loading payslips...</div>
        ) : payslips.length === 0 ? (
          <div className="text-gray-600">No payslips found.</div>
        ) : (
          <div className="space-y-3">
            {payslips.map((p) => (
              <PayslipCard key={p.id} payslip={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
