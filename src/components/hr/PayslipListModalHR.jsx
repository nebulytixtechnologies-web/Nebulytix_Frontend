//Nebulytix_Frontend/src/components/hr/PayslipListModalHR.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_BASE_URL } from "../../api/config";
import PayslipCardHR from "./PayslipCardHR";

export default function PayslipListModalHR({ employee, onClose }) {
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const empId = employee.id ?? employee._id;

    axios
      .get(`${BACKEND_BASE_URL}/hr/payslip/${empId}`)
      .then((res) => setPayslips(res.data || []))
      .finally(() => setLoading(false));
  }, [employee]);

  const handleDeleteFromUI = (id) => {
    setPayslips((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative max-w-3xl w-full bg-white rounded shadow p-6 z-10 max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            Payslips - {employee.firstName} {employee.lastName}
          </h3>
          <button onClick={onClose}>✕</button>
        </div>

        {loading ? (
          <div>Loading payslips...</div>
        ) : (
          <div className="space-y-3">
            {payslips.map((p) => (
              <PayslipCardHR
                key={p.id}
                payslip={p}
                onDelete={handleDeleteFromUI}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
