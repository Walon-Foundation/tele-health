"use client";

import { useState } from "react";
import { CRISIS_RESOURCES } from "@/utils/crisis-detection";

interface EmergencySOSProps {
  onClose: () => void;
}

export default function EmergencySOS({ onClose }: EmergencySOSProps) {
  const [confirmed, setConfirmed] = useState(false);

  if (!confirmed) {
    return (
      <div className="fixed inset-0 bg-red-900/90 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-pulse-slow">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-md w-full border-4 border-red-500">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🆘</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              You're Not Alone
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              We're here to help you. Please confirm you need immediate assistance.
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <button
              onClick={() => setConfirmed(true)}
              className="w-full px-6 py-4 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all shadow-lg"
            >
              Yes, I Need Help Now
            </button>
            <button
              onClick={onClose}
              className="w-full px-6 py-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
            >
              Cancel
            </button>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            This will show you emergency contact numbers
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-5xl">🆘</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Emergency Help
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Please call one of these numbers immediately
          </p>
        </div>

        {/* Crisis Hotlines */}
        <div className="space-y-4 mb-8">
          {Object.values(CRISIS_RESOURCES).map((resource) => (
            <a
              key={resource.number}
              href={`tel:${resource.number.replace(/\D/g, "")}`}
              className="block bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-2 border-red-300 dark:border-red-700 rounded-2xl p-5 hover:border-red-500 dark:hover:border-red-500 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">
                    {resource.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Available: {resource.available}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">
                    {resource.number}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400 group-hover:underline">
                    <span>Tap to Call</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Safety Plan */}
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-6 mb-6">
          <h3 className="font-bold text-emerald-900 dark:text-emerald-400 mb-3 flex items-center gap-2">
            <span>💚</span>
            <span>You Are Important</span>
          </h3>
          <ul className="space-y-2 text-sm text-emerald-800 dark:text-emerald-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">✓</span>
              <span>These feelings are temporary, even if they don't feel like it right now</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">✓</span>
              <span>You deserve support and care</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">✓</span>
              <span>Reaching out is a sign of strength, not weakness</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => window.location.href = "/chat"}
            className="flex-1 px-6 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-all"
          >
            Talk to a Counselor
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
