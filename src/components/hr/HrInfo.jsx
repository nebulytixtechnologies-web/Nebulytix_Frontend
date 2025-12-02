// src/components/hr/HrInfo.jsx
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { BACKEND_BASE_URL, BASE_URL } from "../../api/config";
import { Pencil, Image, Trash2 } from "lucide-react";

export default function HrInfo({ role = "hr", refreshKey = 0 }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [viewPhoto, setViewPhoto] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const fileInputRef = useRef(null);

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
      } catch {}

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

        const data = res.data?.data ?? res.data;
        if (mounted) setProfile(data);
      } catch {
        if (mounted) setError("Failed to load profile.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => (mounted = false);
  }, [LOCAL_KEY, refreshKey, role]);

  function resolveImageUrl(url) {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    if (url.startsWith("/")) return `${BASE_URL}${url}`;
    return `${BASE_URL}/${url}`;
  }

  async function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file || !profile?.id) return;

    const formData = new FormData();
    formData.append("profileImage", file);

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

      const newUrl = res.data?.data ?? res.data;

      const updated = { ...profile, profilePictureUrl: newUrl };
      setProfile(updated);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));

      setShowMenu(false);
    } catch {
      alert("Failed to upload image.");
    }
  }

  async function handleDeletePhoto() {
    if (!profile?.id) return;

    try {
      const token = localStorage.getItem("neb_token");

      await axios.delete(
        `${BACKEND_BASE_URL}/employee/${profile.id}/profile-picture`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      const updated = { ...profile, profilePictureUrl: null };
      setProfile(updated);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));

      setShowMenu(false);
    } catch {
      alert("Failed to delete photo.");
    }
  }

  if (loading) return <div className="p-4 bg-white rounded shadow">Loading…</div>;
  if (error) return <div className="p-4 bg-white rounded shadow text-red-600">{error}</div>;

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

  const displayImageSrc = profilePictureUrl
    ? resolveImageUrl(profilePictureUrl)
    : `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=0ea5e9&color=fff`;

  return (
    <>
      <div className="p-4 bg-white rounded shadow flex gap-6">

        {/* LEFT SIDE IMAGE + MENU */}
        <div className="flex flex-col items-center gap-2 relative">

          <div className="relative">
            <img
              src={displayImageSrc}
              className="h-24 w-24 rounded-full object-cover border shadow cursor-pointer"
              onClick={() => setViewPhoto(true)}
            />

            <button
              onClick={() => setShowMenu(true)}
              className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow hover:bg-gray-100"
            >
              <Pencil className="w-4 h-4 text-sky-700" />
            </button>

            {/* FULL THEME POPUP (REFERENCE MATCHED) */}
            {showMenu && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowMenu(false)}
              >
                <div
                  className="
                    absolute z-50 
                    bg-[#141414]/95
                    text-white 
                    backdrop-blur-sm
                    rounded-2xl 
                    shadow-2xl 
                    w-64
                    p-3
                  "
                  style={{
                    top: "130px",
                    left: "220px",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Choose from library */}
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 w-full text-left"
                  >
                    <Image className="w-5 h-5 text-gray-300" />
                    <span className="text-white text-sm">Choose from library</span>
                  </button>

                  {/* Delete */}
                  <button
                    onClick={handleDeletePhoto}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-red-900/30 text-red-500 w-full text-left"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span className="text-red-500 text-sm">Delete</span>
                  </button>
                </div>
              </div>
            )}

            {/* HIDDEN INPUT */}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handlePhotoUpload}
            />
          </div>

          <div className="text-lg font-semibold text-center">
            {firstName} {lastName}
          </div>
        </div>

        {/* RIGHT SIDE INFO */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
          <div><div className="text-xs text-gray-500">Email</div>{email}</div>
          <div><div className="text-xs text-gray-500">Mobile</div>{mobile}</div>
          <div><div className="text-xs text-gray-500">Card Number</div>{cardNumber}</div>
          <div><div className="text-xs text-gray-500">Gender</div>{gender}</div>
          <div><div className="text-xs text-gray-500">Joining Date</div>{joiningDate ? new Date(joiningDate).toLocaleDateString() : "—"}</div>
          <div><div className="text-xs text-gray-500">Job Role / Domain</div>{jobRole ?? domain}</div>
          <div><div className="text-xs text-gray-500">Days Present</div>{daysPresent}</div>
          <div><div className="text-xs text-gray-500">Paid Leaves</div>{paidLeaves}</div>
        </div>
      </div>

      {/* FULLSCREEN PHOTO */}
      {viewPhoto && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setViewPhoto(false)}
        >
          <img src={displayImageSrc} className="max-h-[60vh] rounded-lg" />
        </div>
      )}
    </>
  );
}
