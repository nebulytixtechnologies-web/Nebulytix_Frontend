// src/components/hr/HrInfo.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_BASE_URL, BASE_URL } from "../../api/config";
import { Pencil } from "lucide-react";

export default function HrInfo({ role = "hr", refreshKey = 0 }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const LOCAL_KEY =
    role === "admin"
      ? "neb_admin_info"
      : role === "hr"
      ? "neb_hr_info"
      : "neb_employee_info";

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);

      // 1) Try localStorage first
      try {
        const raw = localStorage.getItem(LOCAL_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (mounted) {
            setProfile(parsed);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.warn("Failed to read profile from localStorage", e);
      }

      // 2) Fetch from backend if token is available
      const token = localStorage.getItem("neb_token");
      if (!token) {
        if (mounted) {
          setError("No auth token found.");
          setLoading(false);
        }
        return;
      }

      const endpoint =
        role === "admin"
          ? "/admin/profile"
          : role === "hr"
          ? "/hr/profile"
          : "/employee/profile";

      try {
        const res = await axios.get(`${BACKEND_BASE_URL}${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        const unwrapped = res.data?.data ?? res.data;
        if (mounted) setProfile(unwrapped);
      } catch (err) {
        console.warn("Profile fetch error", err);
        if (mounted) setError("Failed to load profile from server.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [LOCAL_KEY, refreshKey, role]);

  // Helper: ensure a URL is resolvable by browser.
  function resolveImageUrl(url) {
    if (!url) return null;
    // If already absolute (http/https), return as-is
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    // If relative (starts with '/'), prefix with BASE_URL
    if (url.startsWith("/")) return `${BASE_URL}${url}`;
    // Otherwise attempt to prefix BACKEND_BASE_URL (fallback)
    return `${BASE_URL}/${url}`;
  }

  // Profile Image Upload
  async function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file || !profile?.id) return;

    const formData = new FormData();
    formData.append("profileImage", file); // backend expects 'profileImage'

    try {
      const token = localStorage.getItem("neb_token");
      const res = await axios.put(
        `${BACKEND_BASE_URL}/employee/${profile.id}/profile-picture`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          withCredentials: true,
        }
      );

      // Backend might return raw path ("/uploads/..") or a ResponseMessage with data field.
      const newUrlRaw = res.data?.data ?? res.data;
      // Normalize to an absolute URL for display.
      const newUrl =
        typeof newUrlRaw === "string" ? resolveImageUrl(newUrlRaw) : null;

      // Update UI & localStorage
      const updatedProfile = {
        ...profile,
        profilePictureUrl: newUrlRaw ?? profile.profilePictureUrl,
      };
      setProfile(updatedProfile);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(updatedProfile));

      // Notify other parts of the app
      window.dispatchEvent(
        new CustomEvent("profileUpdated", { detail: updatedProfile })
      );
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload image. Check console for details.");
    }
  }

  if (loading) {
    return (
      <div className="p-4 bg-white rounded shadow">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-white rounded shadow text-red-600">{error}</div>
    );
  }

  if (!profile) {
    return (
      <div className="p-4 bg-white rounded shadow text-gray-600">
        Profile not available.
      </div>
    );
  }

  const {
    firstName,
    lastName,
    email,
    mobile,
    cardNumber,
    jobRole,
    domain,
    gender,
    joiningDate,
    daysPresent,
    paidLeaves,
    profilePictureUrl,
  } = profile;

  // Decide final image src to render
  // profilePictureUrl from backend might be relative ("/uploads/...") OR already full URL.
  const displayImageSrc = profilePictureUrl
    ? resolveImageUrl(profilePictureUrl)
    : `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=0ea5e9&color=fff`;

  return (
    <div className="p-4 bg-white rounded shadow flex gap-6">
      {/* Left: Profile Image + Upload Button */}
      <div className="flex flex-col items-center gap-2 relative">
        <div className="relative">
          <img
            src={displayImageSrc}
            alt="Profile"
            className="h-24 w-24 rounded-full object-cover border shadow"
            onError={(e) => {
              // fallback to avatar if static file fails to load
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=0ea5e9&color=fff`;
            }}
          />

          {/* EDIT BUTTON */}
          <label
            htmlFor="upload-photo"
            className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow cursor-pointer hover:bg-gray-100"
          >
            <Pencil className="w-4 h-4 text-sky-700" />
          </label>

          <input
            id="upload-photo"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />
        </div>

        <div className="text-lg font-semibold text-center">
          {firstName ?? ""} {lastName ?? ""}
        </div>
      </div>

      {/* Right: Profile details (bank details removed) */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
        <div>
          <div className="text-xs text-gray-500">Email</div>
          <div>{email ?? "—"}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Mobile</div>
          <div>{mobile ?? "—"}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Card Number</div>
          <div>{cardNumber ?? "—"}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Gender</div>
          <div>{gender ?? "—"}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Joining Date</div>
          <div>
            {joiningDate ? new Date(joiningDate).toLocaleDateString() : "—"}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Job Role / Domain</div>
          <div>{jobRole ?? domain ?? "—"}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Days Present</div>
          <div>{daysPresent ?? "—"}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Paid Leaves</div>
          <div>{paidLeaves ?? "—"}</div>
        </div>
      </div>
    </div>
  );
}
