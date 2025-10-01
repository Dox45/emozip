import React , {useState, useEffect} from "react"
export default function CrisisModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-md mx-4 w-full">
        <div className="flex items-center mb-3 text-red-600">
          <AlertTriangle className="mr-2" size={20} />
          <h3 className="text-lg font-semibold">Crisis Support Resources</h3>
        </div>
        <p className="mb-3 text-sm">I'm concerned about your safety. Please reach out for immediate help:</p>
        <ul className="list-disc list-inside mb-3 space-y-1 text-sm">
          <li>US: 988 Suicide & Crisis Lifeline</li>
          <li>UK: 116 123 Samaritans</li>
          <li>Emergency: 911 (US) or 999 (UK)</li>
          <li>Crisis Text Line: Text HOME to 741741</li>
        </ul>
        <button
          onClick={onClose}
          className="w-full bg-red-600 text-white py-2 rounded text-sm hover:bg-red-700"
        >
          I understand
        </button>
      </div>
    </div>
  );
}