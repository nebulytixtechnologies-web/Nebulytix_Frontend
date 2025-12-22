// src/components/admin/HrList.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_BASE_URL } from "../../api/config";
import HrCard from "../admin/HrCard"; // import HrCard instead of EmployeeCard

export default function HrList({ onActionComplete }) {
  const [hrs, setHrs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHrList();
  }, []);

  const fetchHrList = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_BASE_URL}/admin/getHrList`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("neb_token")}`,
        },
      });

      // Map HR DTO to match HrCard fields
      const mappedHrs = res.data.data.map(hr => ({
        id: hr.id,
        firstName: hr.firstName || hr.name?.split(" ")[0] || "N/A",
        lastName: hr.lastName || hr.name?.split(" ")[1] || "",
        email: hr.email,
        cardNumber: hr.hrCardNumber || "",
      }));

      setHrs(mappedHrs);
    } catch (err) {
      console.error("Error fetching HR list", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading HR list...</p>;
  if (hrs.length === 0) return <p>No HR found</p>;

  return (
    <div className="space-y-3">
      {hrs.map((hr) => (
        <HrCard
          key={hr.id}
          hr={hr}
          deleteUrl={`${BACKEND_BASE_URL}/admin/deleteHr/${hr.id}`}
          onActionComplete={() => {
            fetchHrList(); // refresh list after any action
            onActionComplete?.();
          }}
        />
      ))}
    </div>
  );
}
