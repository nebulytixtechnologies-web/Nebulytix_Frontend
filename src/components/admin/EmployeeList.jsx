// // src/components/admin/EmployeeList.jsx
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { BACKEND_BASE_URL } from "../../api/config";
// import EmployeeCard from "./EmployeeCard";
// import { Search } from "lucide-react";

// export default function EmployeeList({
//   refreshKey = 0,
//   onActionComplete,
//   onViewEmployeeTasks,
// }) {
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [search, setSearch] = useState("");
//   const [ filteredEmployees, setFilteredEmployees] = useState([]);
//   const [ roleFilter, setRoleFilter ] = useState("ALL");

//   useEffect(() => {
//     let mounted = true;
//     setLoading(true);
//     setError(null);

//     axios
//       .get(`${BACKEND_BASE_URL}/admin/getEmpList`)
//       .then((res) => {
//         if (!mounted) return;
//         const list = res.data?.data || [];
//         setEmployees(Array.isArray(list) ? list : []);
//         // setEmployees(Array.isArray(res.data.data) ? res.data.data : []);
//         setFilteredEmployees(Array.isArray(list) ? list : []);
//       })
//       .catch((err) => {
//         console.error("Error fetching employees:", err);
//         if (!mounted) return;
//         setError("Failed to load employees. Check backend.");
//         setEmployees([]);
//         setFilteredEmployees([]);
//       })
//       .finally(() => mounted && setLoading(false));

//     return () => (
//       mounted = false);
//   }, [refreshKey]);

//    // 🔍 Search Filtering
//   useEffect(() => {
//     const s = search.toLowerCase();
//     const result = employees.filter(
//       (emp) =>
//         emp.firstName?.toLowerCase().includes(s) ||
//         emp.lastName?.toLowerCase().includes(s) ||
//         emp.email?.toLowerCase().includes(s) ||
//         emp.cardNumber?.toString().includes(s)
//     );
//     setFilteredEmployees(result);
//   }, [search, employees]);

//   if (loading)
//     return <div className="p-4 border rounded">Loading employees...</div>;
//   if (error)
//     return <div className="p-4 border rounded text-red-600">{error}</div>;

//   return (

//    <div className="space-y-6">
//       {/* Search Bar */}
//       {/* <div className="flex justify-end"> */}
//       <div className="flex items-center justify-between gap-4">
//         {/* Search Bar */}
//         <div className="relative w-full">
//           <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search employees..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="
//               w-full pl-12 pr-4 py-2 rounded-lg border border-gray-300
//              bg-white shadow-sm text-gray-700 placeholder-gray-400
//               focus:outline-none focus:ring-2 focus:ring-sky-500
//               transition-all duration-200
//             "
//          />
//         </div>

//   {/* Filter Dropdown */}
//   <select
//     value={filterRole}
//     onChange={(e) => setFilterRole(e.target.value)}
//     className="
//       w-44 px-3 py-2 rounded-lg border border-gray-300
//       bg-white shadow-sm text-gray-700
//       focus:outline-none focus:ring-2 focus:ring-sky-500
//       transition-all duration-200
//     "
//     >
//     <option value="">All Roles</option>
//     <option value="Admin">Admin</option>
//     <option value="HR">HR</option>
//     <option value="Employee">Employee</option>
//     </select>
//    </div>

//         <div className="relative">
//           <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search employees..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="
//               w-72 pl-12 pr-4 py-2 rounded-lg border border-gray-300
//               bg-white shadow-sm text-gray-700 placeholder-gray-400
//               focus:outline-none focus:ring-2 focus:ring-sky-500
//               transition-all duration-200
//             "
//           />
//         </div>
//       </div>

//       // {/* Loading */}
//       // {loading && (
//       //   <div className="p-4 border rounded bg-gray-50">Loading employees...</div>
//       // )}

//       // {/* Empty State */}
//       // {!loading && filteredEmployees.length === 0 && (
//       //   <div className="p-4 border rounded text-gray-600 text-center bg-gray-50">
//       //     No employees match search.
//       //   </div>
//       // )}

//       {/* Employee Cards */}
//       <div className="space-y-4">
//         {!loading &&
//           filteredEmployees.map((emp) => (
//             <EmployeeCard
//               key={emp.id ?? emp._id}
//               employee={emp}
//               onActionComplete={() => onActionComplete?.()}
//               onViewEmployeeTasks={() => onViewEmployeeTasks?.(emp)}
//             />
//           ))}
//       </div>
//     // </div>
//   );
// }

// src/components/admin/EmployeeList.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_BASE_URL } from "../../api/config";
import EmployeeCard from "./EmployeeCard";
import { Search } from "lucide-react";

export default function EmployeeList({
  refreshKey = 0,
  onActionComplete,
  onViewEmployeeTasks,
}) {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    axios
      .get(`${BACKEND_BASE_URL}/admin/getEmpList`)
      .then((res) => {
        if (!mounted) return;
        const list = res.data?.data || [];
        setEmployees(Array.isArray(list) ? list : []);
        setFilteredEmployees(Array.isArray(list) ? list : []);
      })
      .catch((err) => {
        console.error("Error fetching employees:", err);
        if (!mounted) return;
        setError("Failed to load employees. Check backend.");
        setEmployees([]);
        setFilteredEmployees([]);
      })
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, [refreshKey]);

  // 🔎 Search + Filter Logic
  useEffect(() => {
    const s = search.toLowerCase();

    const result = employees.filter((emp) => {
      const matchesSearch =
        (emp.firstName?.toLowerCase() || "").includes(s) ||
        (emp.lastName?.toLowerCase() || "").includes(s) ||
        (emp.email?.toLowerCase() || "").includes(s) ||
        (emp.cardNumber?.toString() || "").includes(s);

      const matchesRole =
        roleFilter === "ALL" ||
        (emp.Role?.toLowerCase() === roleFilter.toLowerCase());

      return matchesSearch && matchesRole;
    });

    setFilteredEmployees(result);
  }, [search, roleFilter, employees]);

  if (loading) {
    return <div className="p-4 border rounded bg-gray-50">Loading employees...</div>;
  }

  if (error) {
    return <div className="p-4 border rounded text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">

      {/* Search + Filter Row */}
      <div className="flex items-center justify-between gap-4">
        
        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full pl-12 pr-4 py-2 rounded-lg border border-gray-300
              bg-white shadow-sm text-gray-700 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-sky-500
              transition-all duration-200
            "
          />
        </div>

        {/* Filter Dropdown */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="
            w-44 px-3 py-2 rounded-lg border border-gray-300
            bg-white shadow-sm text-gray-700
            focus:outline-none focus:ring-2 focus:ring-sky-500
            transition-all duration-200
          "
        >
          <option value="ALL">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="HR">HR</option>
          <option value="Employee">Employee</option>
        </select>
      </div>

      {/* Employee Cards */}
      <div className="space-y-4">
        {filteredEmployees.length === 0 ? (
          <div className="p-4 border rounded text-gray-600 text-center bg-gray-50">
            No employees found.
          </div>
        ) : (
          filteredEmployees.map((emp) => (
            <EmployeeCard
              key={emp.id ?? emp._id}
              employee={emp}
              onActionComplete={() => onActionComplete?.()}
              onViewEmployeeTasks={() => onViewEmployeeTasks?.(emp)}
            />
          ))
        )}
      </div>

    </div>
  );
}
