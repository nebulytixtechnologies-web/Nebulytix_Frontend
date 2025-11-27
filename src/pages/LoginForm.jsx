// src/pages/LoginForm.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { login as apiLogin } from "../api/auth";
import Navbar from "../components/Navbar";
import { Eye, EyeClosed} from "lucide-react";

export default function LoginForm() {
  const { role: routeRole } = useParams();
  const navigate = useNavigate();

  const [role, setRole] = useState(routeRole || "employee");
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (routeRole) {
      setRole(routeRole);
    }
  }, [routeRole]);

  function handleInput(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!form.username.trim() || !form.password) {
      setError("Please enter username and password.");
      return;
    }

    setLoading(true);
    try {
      const data = await apiLogin(role, {
        email: form.username,
        password: form.password,
        loginRole: role,
      });

      console.log("Login response data:", data);

      // Save relevant info in role-specific key
      const actualRole = data.loginRole ?? role;
      localStorage.setItem("neb_role", actualRole);
      localStorage.setItem("neb_token", data.token ?? "demo-token");

      if (actualRole === "admin") {
        localStorage.setItem("neb_admin_info", JSON.stringify(data));
        navigate("/admin", { state: { admin: data } });
      } else if (actualRole === "hr") {
        localStorage.setItem("neb_hr_info", JSON.stringify(data));
        navigate("/hr", { state: { hr: data } });
      } else {
        // employee or default
        localStorage.setItem("neb_employee_info", JSON.stringify(data));
        navigate("/employee", { state: { employee: data } });
      }
    } catch (err) {
      console.error("Login error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Login failed — check credentials and backend.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white border rounded-lg shadow p-6">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold">Sign in to Nebulytix</h2>
            
          </div>

          {!routeRole && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded"
              >
                <option value="admin">Admin</option>
                <option value="hr">HR</option>
                <option value="employee">Employee</option>
              </select>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                name="username"
                value={form.username}
                onChange={handleInput}
                className="mt-1 block w-full px-3 py-2 border rounded"
                placeholder={
                  role === "admin" ? "admin username" : "your username or email"
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>

              <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleInput}
                className="mt-1 block w-full px-3 py-2 border rounded"
                placeholder="Enter your password"
                required
              />

               {/* Eye Icon */}
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
            >
              {showPassword ? (
                <EyeClosed className="h-5 w-5" /> 
              ) : ( 
                <Eye className="h-5 w-5" />
                )}
            </span>
              </div>
            </div>

           

            {error && <div className="text-sm text-red-600">{error}</div>}

            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-sky-600 text-white rounded disabled:opacity-60"
              >
                {loading
                  ? "Signing in..."
                  : `Sign in as ${role?.toUpperCase()}`}
              </button>

              <Link to="/" className="text-sm text-gray-600 hover:underline">
                Back to home
              </Link>
            </div>
          </form>

          <div className="mt-4 text-xs text-gray-500">
            Tip: you can open specific role login directly at{" "}
            <code>/login/admin</code>, <code>/login/hr</code>, or{" "}
            <code>/login/employee</code>.
          </div>
        </div>
      </div>
    </div>
  );
}
