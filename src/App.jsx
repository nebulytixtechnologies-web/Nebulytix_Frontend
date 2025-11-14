// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LoginForm from "./pages/LoginForm";
import Career from "./pages/Career";
import HrDashboard from "./pages/HrDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import JobDetails from "./pages/JobDetails";
import ViewReport from "./pages/ViewReport";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/career" element={<Career />} />
      <Route path="/career/job/:id" element={<JobDetails />} />{" "}
      {/* new route */}
      {/* Login */}
      <Route path="/login" element={<LoginForm />} />
      <Route path="/login/:role" element={<LoginForm />} />
      {/* Dashboards */}
      <Route path="/hr" element={<HrDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/employee" element={<EmployeeDashboard />} />
      <Route path="/admin/view-report" element={<ViewReport />} />
    </Routes>
  );
}
