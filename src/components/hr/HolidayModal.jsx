import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import { BACKEND_BASE_URL } from "../../api/config";

export default function HolidayModal({ onClose }) {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Disable background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  // Fetch holidays from backend
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(
          `${BACKEND_BASE_URL}/holiday/list?year=${year}`
        );

        const raw = res.data?.data || [];

        const formatted = raw.map((h) => {
          const d = new Date(h.date);
          return {
            month: d.toLocaleString("en", { month: "short" }).toUpperCase(),
            day: String(d.getDate()).padStart(2, "0"),
            name: h.name,
            weekday:
              h.weekday || d.toLocaleString("en", { weekday: "long" }),
          };
        });

        const mid = Math.ceil(formatted.length / 2);
        const left = formatted.slice(0, mid);
        const right = formatted.slice(mid).map((h) => ({ ...h, right: true }));

        setHolidays([...left, ...right]);
      } catch (err) {
        setError("Failed to load holidays");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [year]);

  return (
   <div
  className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
  onClick={onClose}   // CLOSE WHEN CLICKED OUTSIDE
>
  <div
    className="bg-white w-[600px] max-h-[85vh] overflow-y-auto rounded-xl shadow-2xl p-6 animate-fadeIn"
    onClick={(e) => e.stopPropagation()} // DON'T CLOSE ON INSIDE CLICK
  >

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Holidays</h2>
          <X className="cursor-pointer" onClick={onClose} />
        </div>

        {/* Year Selector */}
        <div className="flex items-center gap-3 mb-4">
          <ChevronLeft
            className="cursor-pointer"
            onClick={() => setYear((y) => y - 1)}
          />
          <span className="text-lg font-medium">{year}</span>
          <ChevronRight
            className="cursor-pointer"
            onClick={() => setYear((y) => y + 1)}
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center text-gray-500 py-6">
            Loading holidays...
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-red-600 text-sm mb-4">{error}</p>
        )}

        {/* Holiday Grid */}
        {!loading && holidays.length > 0 && (
          <div className="grid grid-cols-2 gap-x-10">
            <div className="space-y-4">
              {holidays.filter((h) => !h.right).map((h, i) => (
                <HolidayItem key={i} {...h} />
              ))}
            </div>

            <div className="space-y-4">
              {holidays.filter((h) => h.right).map((h, i) => (
                <HolidayItem key={i} {...h} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function HolidayItem({ month, day, name, weekday }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-center leading-tight">
        <div className="bg-[#EDEBFF] text-[#6A56F0] text-[10px] font-semibold px-2 py-[2px] rounded-t-md tracking-wide">
          {month}
        </div>
        <div className="border border-gray-300 px-2 py-[6px] rounded-b-md text-lg font-bold">
          {day}
        </div>
      </div>

      <div className="leading-tight">
        <p className="font-medium text-[15px] text-gray-800">{name}</p>
        <p className="text-xs text-gray-500">{weekday}</p>
      </div>
    </div>
  );
}
