// src/components/hr/job-applications/EmailModal.jsx
import React from "react";

export default function EmailModal({
  mailType,
  mailTargetApp,
  mailSubject,
  setMailSubject,
  mailMessage,
  setMailMessage,
  sendingMail,
  onClose,
  onSend,
}) {
  const title = (() => {
    if (mailTargetApp) {
      if (mailType === "INVITED_SINGLE")
        return `Invite ${mailTargetApp.fullName}`;
      if (mailType === "TERMINATED_SINGLE")
        return `Send rejection email to ${mailTargetApp.fullName}`;
      return `Email ${mailTargetApp.fullName}`;
    }

    if (mailType === "SHORTLISTED")
      return "Email all shortlisted applicants";
    if (mailType === "REJECTED")
      return "Email all rejected applicants";
    return "Send email";
  })();

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />

      <div className="fixed top-[18%] left-1/2 -translate-x-1/2 bg-white shadow-2xl rounded-lg p-6 z-50 w-full max-w-lg">
        <h3 className="text-lg font-semibold mb-2 text-gray-900">
          {title}
        </h3>

        <input
          type="text"
          placeholder="Email subject"
          value={mailSubject}
          onChange={(e) => setMailSubject(e.target.value)}
          className="w-full border border-gray-300 p-2 mt-2 rounded text-sm"
        />

        <textarea
          placeholder="Type your message..."
          value={mailMessage}
          onChange={(e) => setMailMessage(e.target.value)}
          className="w-full border border-gray-300 p-2 mt-3 rounded h-32 text-sm resize-none"
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-gray-100 rounded text-sm hover:bg-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={onSend}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm disabled:opacity-60 hover:bg-blue-700"
            disabled={sendingMail}
          >
            {sendingMail ? "Sending…" : "Send"}
          </button>
        </div>
      </div>
    </>
  );
}
