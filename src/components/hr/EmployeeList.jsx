// src/components/hr/EmployeeList.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_BASE_URL } from "../../api/config";
import EmployeeCard from "./EmployeeCard";
import { Search } from "lucide-react";

export default function EmployeeList({ refreshKey = 0, onActionComplete, roleFilter }) {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    axios
      .get(`${BACKEND_BASE_URL}/hr/getEmpList`)
      .then((res) => {
        if (!mounted) return;
        const list = res.data?.data || [];
        setEmployees(Array.isArray(list) ? list : []);
        setFilteredEmployees(Array.isArray(list) ? list : []);
      })
      .catch((err) => {
        console.error("Failed to fetch employees:", err);
        if (!mounted) return;
        setEmployees([]);
        setFilteredEmployees([]);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => (mounted = false);
  }, [refreshKey]);

  useEffect(() => {
  const token = localStorage.getItem("neb_token");

  axios.get(`${BACKEND_BASE_URL}/admin/employees`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => {
    let filtered = res.data || [];

    if (roleFilter === "EMPLOYEE") {
      filtered = filtered.filter(u => u.loginRole === "EMPLOYEE");
    } else if (roleFilter === "HR") {
      filtered = filtered.filter(u => u.loginRole === "HR");
    }

    setEmployees(filtered);
  })
  .catch(err => console.error("Failed to fetch employees", err));
}, [roleFilter, refreshKey]);


  // 🔎 Search Logic
  useEffect(() => {
    const s = search.toLowerCase();
    const result = employees.filter(
      (emp) =>
        emp.firstName?.toLowerCase().includes(s) ||
        emp.lastName?.toLowerCase().includes(s) ||
        emp.email?.toLowerCase().includes(s) ||
        emp.cardNumber?.toString().includes(s)
    );
    setFilteredEmployees(result);
  }, [search, employees]);

  return (
    <div className="space-y-6">

      {/* HEADER ROW */}
      <div className="flex items-center justify-between">

        {/* ⭐ Employee List heading with HR dashboard color */}
        <h2
          className="
            text-2xl font-bold tracking-wide
            text-sky-700     /* Matches HR Dashboard */
          "
        >
          Employee List
        </h2>

        {/* ⭐ Search Input with Icon */}
        <div className="relative">
          <Search
            className="
              w-5 h-5 absolute left-4 top-1/2 
              -translate-y-1/2 text-gray-400
            "
          />

          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-80 pl-12 pr-4 py-3
              rounded-xl border border-gray-300
              bg-white shadow-sm
              text-gray-700 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-sky-500
              transition-all duration-200
            "
          />
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="p-4 border rounded-lg text-gray-600 shadow-sm bg-gray-50">
          Loading employees...
        </div>
      )}

      {/* EMPTY */}
      {!loading && filteredEmployees.length === 0 && (
        <div className="p-4 border rounded-lg text-gray-500 shadow-sm bg-gray-50">
          No employees found.
        </div>
      )}

      {/* EMPLOYEE CARDS */}
      <div className="space-y-4">
        {filteredEmployees.map((emp) => (
          <EmployeeCard
            key={emp.id}
            employee={emp}
            onActionComplete={onActionComplete}
          />
        ))}
      </div>
    </div>
  );
}
