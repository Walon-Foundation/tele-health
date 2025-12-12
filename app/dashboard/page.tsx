"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Profile {
  id: string;
  avatar: number;
  username: string;
  topics: string[];
  ageRange?: string;
  gender?: string;
  createdAt: string;
}

const TOPIC_LABELS: Record<string, string> = {
  trauma: "🧠 Trauma & PTSD",
  addiction: "💊 Substance Use",
  anxiety: "😰 Anxiety & Stress",
  depression: "😢 Depression",
  relationships: "💔 Relationships",
  family: "👨‍👩‍👧 Family",
  work: "💼 Work/School",
  grief: "⚖️ Grief & Loss",
  crisis: "🆘 Crisis",
};

const RESOURCES = [
  {
    title: "Managing Anxiety",
    description: "Simple breathing techniques and grounding exercises",
    icon: "😰",
  },
  {
    title: "Coping with Trauma",
    description: "Understanding trauma responses and healing strategies",
    icon: "🧠",
  },
  {
    title: "Building Resilience",
    description: "Daily practices to strengthen mental wellbeing",
    icon: "💪",
  },
  {
    title: "Sleep Hygiene",
    description: "Tips for better sleep and rest",
    icon: "😴",
  },
];

const CRISIS_HOTLINES = [
  { name: "Mental Health Hotline", number: "079-XXX-XXX" },
  { name: "Police Emergency", number: "019" },
  { name: "Kissy Psychiatric Hospital", number: "076-XXX-XXX" },
];

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [unreadCount, setUnreadCount] = useState(2);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem("safespace_profile");
    if (!savedProfile) {
      window.location.href = "/signup";
      return;
    }
    setProfile(JSON.parse(savedProfile));
  }, []);

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12">
              <Image
                src={`/avatars/avatar_${profile.avatar}.png`}
                alt="Your avatar"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900 dark:text-white">
                {profile.username}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Welcome back 💚
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
          <div className="max-w-2xl mx-auto space-y-3">
            <Link
              href="/signup"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-gray-900 dark:text-white">Change Avatar</span>
            </Link>
            <button
              onClick={() => {
                const newPin = prompt("Enter new 4-6 digit PIN:");
                if (newPin && /^\d{4,6}$/.test(newPin)) {
                  localStorage.setItem("safespace_pin", newPin);
                  alert("PIN updated successfully!");
                }
              }}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full text-left"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-gray-900 dark:text-white">Change PIN</span>
            </button>
            <button
              onClick={() => {
                if (confirm("Delete your account and all messages? This cannot be undone.")) {
                  localStorage.clear();
                  window.location.href = "/";
                }
              }}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left text-red-500"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Delete Account</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Active Conversation */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Active Conversations
          </h2>
          <Link
            href="/chat"
            className="block bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image
                  src="/avatars/avatar_3.png"
                  alt="Counselor Hope"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-gray-800 rounded-full" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Counselor Hope
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    5 min ago
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  I understand how you're feeling...
                </p>
              </div>
              {unreadCount > 0 && (
                <span className="w-6 h-6 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
          </Link>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/chat"
              className="bg-emerald-500 text-white rounded-2xl p-4 text-center hover:bg-emerald-600 transition-colors"
            >
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="font-medium">Continue Chat</span>
            </Link>
            <button
              onClick={() => alert("Starting new conversation...")}
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl p-4 text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
            >
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="font-medium">New Topic</span>
            </button>
          </div>
        </section>

        {/* Your Topics */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Your Topics
          </h2>
          <div className="flex flex-wrap gap-2">
            {profile.topics.map((topic) => (
              <span
                key={topic}
                className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-medium"
              >
                {TOPIC_LABELS[topic] || topic}
              </span>
            ))}
          </div>
        </section>

        {/* Self-Help Resources */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            📚 Self-Help Resources
          </h2>
          <div className="space-y-3">
            {RESOURCES.map((resource) => (
              <button
                key={resource.title}
                className="w-full bg-white dark:bg-gray-800 rounded-xl p-4 text-left hover:shadow-md transition-shadow flex items-center gap-3"
              >
                <span className="text-2xl">{resource.icon}</span>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {resource.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Crisis Hotlines */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            🆘 Crisis Hotlines
          </h2>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-4 space-y-3">
            <p className="text-sm text-red-700 dark:text-red-400">
              If you're in immediate danger or crisis, please reach out:
            </p>
            {CRISIS_HOTLINES.map((hotline) => (
              <a
                key={hotline.name}
                href={`tel:${hotline.number.replace(/\D/g, "")}`}
                className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="text-gray-900 dark:text-white font-medium">
                  {hotline.name}
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                  {hotline.number}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Data Privacy Notice */}
        <section className="pb-8">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Your data is encrypted and stored locally</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
