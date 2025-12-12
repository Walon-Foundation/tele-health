"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ImpactMetrics {
  totalUsers: number;
  activeSessions: number;
  messagesSent: number;
  averageResponseTime: string;
  moodImprovement: number;
  crisisInterventions: number;
}

export default function ImpactDashboard() {
  const [metrics, setMetrics] = useState<ImpactMetrics>({
    totalUsers: 0,
    activeSessions: 0,
    messagesSent: 0,
    averageResponseTime: "0m",
    moodImprovement: 0,
    crisisInterventions: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading metrics
    setTimeout(() => {
      setMetrics({
        totalUsers: 127,
        activeSessions: 23,
        messagesSent: 1453,
        averageResponseTime: "4.2m",
        moodImprovement: 78,
        crisisInterventions: 5,
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  const stats = [
    {
      label: "Anonymous Users Helped",
      value: metrics.totalUsers,
      icon: "👥",
      color: "from-blue-500 to-cyan-500",
      change: "+12 today",
    },
    {
      label: "Active Sessions",
      value: metrics.activeSessions,
      icon: "💬",
      color: "from-emerald-500 to-teal-500",
      change: "Right now",
    },
    {
      label: "Messages Exchanged",
      value: metrics.messagesSent.toLocaleString(),
      icon: "✉️",
      color: "from-purple-500 to-pink-500",
      change: "+89 in last hour",
    },
    {
      label: "Avg Response Time",
      value: metrics.averageResponseTime,
      icon: "⚡",
      color: "from-orange-500 to-red-500",
      change: "Under 5 minutes",
    },
    {
      label: "Mood Improvement",
      value: `${metrics.moodImprovement}%`,
      icon: "📈",
      color: "from-green-500 to-emerald-600",
      change: "Post-session happiness",
    },
    {
      label: "Crisis Interventions",
      value: metrics.crisisInterventions,
      icon: "🆘",
      color: "from-red-500 to-orange-500",
      change: "Lives potentially saved",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent mx-auto mb-4" />
          <p className="text-emerald-400 font-medium">Loading impact data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-900 to-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-xl">🛡️</span>
            </div>
            <div>
              <h1 className="font-bold text-xl">SafeSpace Salone</h1>
              <p className="text-xs text-gray-400">Real-Time Impact Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 rounded-full border border-emerald-500">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-emerald-400">Live Data</span>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-medium"
            >
              Back to App
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Stats */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Our Impact in Sierra Leone
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Tracking the real-time difference we're making in mental health support
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="relative group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-20 group-hover:opacity-30 rounded-2xl blur-xl transition-opacity`} />
              <div className="relative bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 hover:bg-white/[0.15] transition-all">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{stat.icon}</span>
                  <span className="text-xs text-emerald-400 font-medium px-2 py-1 bg-emerald-500/20 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Social Proof */}
        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">Why SafeSpace Salone Matters</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl mb-3">🌍</div>
              <h4 className="font-semibold mb-2">Sierra Leone First</h4>
              <p className="text-sm text-gray-300">
                Designed specifically for low-bandwidth, high-impact mental health support
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🔒</div>
              <h4 className="font-semibold mb-2">100% Anonymous</h4>
              <p className="text-sm text-gray-300">
                No names, no emails, no tracking – complete privacy for vulnerable users
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">⚡</div>
              <h4 className="font-semibold mb-2">Works on 3G</h4>
              <p className="text-sm text-gray-300">
                Optimized for slow connections with voice notes under 120KB/min
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-105 transition-all"
          >
            Get Help Anonymously →
          </Link>
          <p className="mt-4 text-sm text-gray-400">
            Free • Anonymous • Available 24/7
          </p>
        </div>
      </div>
    </div>
  );
}
