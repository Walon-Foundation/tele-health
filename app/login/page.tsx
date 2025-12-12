"use client";

import { useState } from "react";

export default function LoginPage() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setIsLoading(true);

    const savedPin = localStorage.getItem("safespace_pin");
    const savedUserId = localStorage.getItem("safespace_user_id");

    if (!savedUserId || !savedPin) {
      setError("No account found. Please sign up first.");
      setIsLoading(false);
      return;
    }

    if (pin !== savedPin) {
      setError("Incorrect PIN. Please try again.");
      setIsLoading(false);
      return;
    }

    // Fetch user's conversations to check if they exist
    try {
      const response = await fetch(`/api/conversations?userId=${savedUserId}`);
      if (response.ok) {
        const { conversations } = await response.json();
        if (conversations && conversations.length > 0) {
          localStorage.setItem('safespace_current_conversation', conversations[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    }

    // Success - redirect to chat or dashboard
    window.location.href = "/dashboard";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enter your PIN to continue
          </p>
        </div>

        {/* PIN Input */}
        <div className="space-y-6">
          <input
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
            onKeyDown={handleKeyDown}
            placeholder="• • • • • •"
            className="w-full px-4 py-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center text-3xl tracking-[0.5em] focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            autoFocus
          />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={pin.length < 4 || isLoading}
            className="w-full px-6 py-4 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Unlocking...
              </span>
            ) : (
              "Unlock"
            )}
          </button>
        </div>

        {/* Links */}
        <div className="mt-8 text-center space-y-4">
          <a
            href="/signup"
            className="block text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
          >
            Create new anonymous account
          </a>
          <button
            onClick={() => {
              if (confirm("This will delete all your data and messages. Are you sure?")) {
                localStorage.clear();
                window.location.href = "/signup";
              }
            }}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
          >
            Forgot PIN? Reset everything
          </button>
        </div>

        {/* Emergency Exit */}
        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            className="w-full flex items-center justify-center gap-2 text-red-500 hover:text-red-600 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Emergency Exit (clears all data)
          </button>
        </div>
      </div>
    </div>
  );
}
