"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import EmergencySOS from "@/components/EmergencySOS";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const FEATURES = [
  {
    icon: "🛡️",
    title: "100% Anonymous",
    description: "No names, no phone numbers, no emails required",
  },
  {
    icon: "📱",
    title: "Works on 3G",
    description: "Optimized for low-bandwidth connections",
  },
  {
    icon: "🔒",
    title: "Encrypted Messages",
    description: "End-to-end encryption keeps your conversations private",
  },
  {
    icon: "🎤",
    title: "Voice Notes",
    description: "Send voice messages when typing isn't enough",
  },
  {
    icon: "📴",
    title: "Works Offline",
    description: "Messages queue and send when you're back online",
  },
  {
    icon: "💚",
    title: "Professional Support",
    description: "Connect with trained mental health counselors",
  },
];

const TOPICS = [
  "🧠 Trauma & PTSD",
  "💊 Substance Use",
  "😰 Anxiety & Stress",
  "😢 Depression",
  "💔 Relationships",
  "👨‍👩‍👧 Family Conflicts",
  "💼 Work/School Stress",
  "⚖️ Grief & Loss",
  "🆘 Crisis Support",
];

export default function Home() {
  const [hasAccount, setHasAccount] = useState(false);
  const [showSOS, setShowSOS] = useState(false);

  useEffect(() => {
    const profile = localStorage.getItem("safespace_profile");
    setHasAccount(!!profile);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Emergency SOS Modal */}
      {showSOS && <EmergencySOS onClose={() => setShowSOS(false)} />}

      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Top Navigation */}
        <div className="relative z-10 flex justify-between items-center px-6 pt-6">
          <Link
            href="/impact"
            className="px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
          >
            📊 View Our Impact
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <button
              onClick={() => setShowSOS(true)}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors shadow-lg shadow-red-500/25 flex items-center gap-2"
            >
              <span>🆘</span>
              <span className="hidden sm:inline">Emergency Help</span>
            </button>
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200/30 dark:bg-emerald-900/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-sky-200/30 dark:bg-sky-900/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 py-16 md:py-24">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <span className="text-2xl">🛡️</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              <span className="text-emerald-600 dark:text-emerald-400">SafeSpace</span>
              <span className="text-gray-900 dark:text-white"> Salone</span>
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-center text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Anonymous, low-bandwidth mental health support for young people in Sierra Leone.
            <span className="text-emerald-600 dark:text-emerald-400 font-medium"> No names, no video calls – just secure, private chat.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href={hasAccount ? "/login" : "/signup"}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-2xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-105 transition-all text-center"
            >
              {hasAccount ? "Welcome Back – Login" : "Get Started Anonymously"}
            </Link>
            <Link
              href="#features"
              className="w-full sm:w-auto px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur text-gray-900 dark:text-white font-semibold rounded-2xl border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-all text-center"
            >
              Learn More
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Free to use</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>No downloads needed</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Works on any phone</span>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Why SafeSpace Salone?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:scale-105 transition-all"
              >
                <span className="text-4xl mb-4 block">{feature.icon}</span>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-16 px-6 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Get Support For
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Whatever you're going through, our trained counselors are here to help
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {TOPICS.map((topic) => (
              <span
                key={topic}
                className="px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 text-emerald-700 dark:text-emerald-400 rounded-full font-medium hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-900/50 dark:hover:to-teal-900/50 transition-all cursor-default"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Create Anonymous Profile",
                description: "Pick an avatar and username. No real names or phone numbers needed.",
              },
              {
                step: "2",
                title: "Select Your Topics",
                description: "Tell us what you need help with so we can match you with the right counselor.",
              },
              {
                step: "3",
                title: "Start Chatting",
                description: "Send text or voice messages anytime. Our counselors respond within minutes.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-2xl font-bold rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/25">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-emerald-500 to-teal-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-3xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Your Privacy is Our Priority
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            We don't collect your real name, phone number, or email. All messages are encrypted end-to-end. 
            Nobody – not even us – can read your conversations except you and your counselor.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["No tracking", "No data selling", "Delete anytime", "Encrypted storage"].map((item) => (
              <span
                key={item}
                className="px-4 py-2 bg-white/20 backdrop-blur rounded-full text-sm font-medium"
              >
                ✓ {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Take the First Step?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Your mental health matters. Start your anonymous journey to healing today.
          </p>
          <Link
            href={hasAccount ? "/login" : "/signup"}
            className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-2xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-105 transition-all"
          >
            {hasAccount ? "Continue Your Journey" : "Get Started Anonymously"}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <span className="text-lg">🛡️</span>
            <span>SafeSpace Salone</span>
          </div>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Contact
            </Link>
          </div>
          <p>© 2025 SafeSpace Salone</p>
        </div>
      </footer>
    </div>
  );
}
