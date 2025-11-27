export default function SuccessMessage({ onClose }) {
  return (
    <div className="p-6 text-center space-y-4 bg-white rounded-xl shadow-md border">
      <h2 className="text-2xl font-semibold text-green-700">
        Application Submitted Successfully!
      </h2>

      <p className="text-gray-700">
        Thank you for applying. Our team will contact you soon.
      </p>

      {/* FIX → Closing works now */}
      <button
        onClick={onClose}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Close
      </button>
    </div>
  );
}
