import React, {useState, useEffect} from "react";

export default function AboutView() {
  return (
    <div className="p-4">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">About This App</h2>
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold mb-2 text-sm sm:text-base">Purpose</h3>
          <p className="text-gray-600 text-sm sm:text-base">
            This AI-driven emotional support system provides preliminary, non-clinical
            emotional support for individuals experiencing loneliness, stress, and
            anxiety.
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-2 text-sm sm:text-base">Safety Features</h3>
          <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1">
            <li>Crisis detection and intervention protocols</li>
            <li>Professional resource recommendations</li>
            <li>Privacy and data protection</li>
            <li>Emotional response scoring (ERS)</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2 text-sm sm:text-base">Limitations</h3>
          <p className="text-gray-600 text-sm sm:text-base">
            This chatbot is not a replacement for professional therapy or medical
            advice. For serious mental health concerns, please consult a qualified
            professional.
          </p>
        </div>
      </div>
    </div>
  );
}