"use client";

import { useEffect, useState } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

interface Conversation {
  id: string;
  topics: string[];
  status: string;
  createdAt: string;
  user: {
    username: string;
    avatar: number;
  };
  lastMessage?: {
    content: string;
    createdAt: string;
  };
  unreadCount: number;
}

interface AssignmentRequest {
  id: string;
  message: string;
  createdAt: string;
  conversation: {
    id: string;
    topics: string[];
    user: {
      username: string;
      avatar: number;
    };
  };
}

const TOPIC_LABELS: Record<string, string> = {
  trauma: "🧠 Trauma",
  addiction: "💊 Addiction",
  anxiety: "😰 Anxiety",
  depression: "😢 Depression",
  relationships: "💔 Relationships",
  family: "👨‍👩‍👧 Family",
  work: "💼 Work/School",
  grief: "⚖️ Grief",
  crisis: "🆘 Crisis",
};

export default function CounselorDashboard() {
  const { user, isLoaded } = useUser();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [requests, setRequests] = useState<AssignmentRequest[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "waiting" | "urgent">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      fetchData();
    }
  }, [isLoaded, user]);

  const fetchData = async () => {
    try {
      // TODO: Replace with actual API calls using counselor ID from Clerk
      // For now, using mock data
      setConversations([
        {
          id: "1",
          topics: ["anxiety", "work"],
          status: "active",
          createdAt: new Date().toISOString(),
          user: { username: "BlueButterfly23", avatar: 1 },
          lastMessage: {
            content: "Thank you for your help...",
            createdAt: new Date().toISOString(),
          },
          unreadCount: 2,
        },
        {
          id: "2",
          topics: ["depression", "family"],
          status: "active",
          createdAt: new Date().toISOString(),
          user: { username: "HopefulHeart99", avatar: 2 },
          unreadCount: 0,
        },
      ]);

      setRequests([
        {
          id: "1",
          message: "I need help with severe anxiety",
          createdAt: new Date().toISOString(),
          conversation: {
            id: "3",
            topics: ["anxiety", "crisis"],
            user: { username: "AnonymousUser45", avatar: 3 },
          },
        },
      ]);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    if (filter === "all") return true;
    if (filter === "urgent") return conv.topics.includes("crisis");
    return conv.status === filter;
  });

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return null; // Clerk will redirect to sign-in
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">💚</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-900 dark:text-white">
                Counselor Dashboard
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Welcome, {user.firstName || user.emailAddresses[0].emailAddress}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm"
            >
              ← Back to App
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Conversations */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {conversations.length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Active Chats
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                <div className="text-2xl font-bold text-emerald-500">
                  {conversations.reduce((sum, c) => sum + c.unreadCount, 0)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Unread
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                <div className="text-2xl font-bold text-red-500">
                  {requests.length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Requests
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                <div className="text-2xl font-bold text-orange-500">
                  {conversations.filter((c) => c.topics.includes("crisis")).length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Urgent
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              {["all", "active", "waiting", "urgent"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === f
                      ? "bg-emerald-500 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {/* Conversations List */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Your Conversations
              </h2>
              {filteredConversations.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    No conversations yet. Users will be matched with you automatically.
                  </p>
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <Link
                    key={conv.id}
                    href={`/counselor/chat/${conv.id}`}
                    className="block bg-white dark:bg-gray-800 rounded-xl p-4 hover:shadow-md transition-shadow border-l-4 border-emerald-500"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Image
                          src={`/avatars/avatar_${conv.user.avatar}.png`}
                          alt={conv.user.username}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                        {conv.unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {conv.user.username}
                          </h3>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(conv.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {conv.topics.map((topic) => (
                            <span
                              key={topic}
                              className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded text-xs"
                            >
                              {TOPIC_LABELS[topic] || topic}
                            </span>
                          ))}
                        </div>
                        {conv.lastMessage && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                            {conv.lastMessage.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Sidebar - Assignment Requests */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Assignment Requests
              </h2>
              {requests.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No pending requests
                </p>
              ) : (
                <div className="space-y-3">
                  {requests.map((req) => (
                    <div
                      key={req.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Image
                          src={`/avatars/avatar_${req.conversation.user.avatar}.png`}
                          alt={req.conversation.user.username}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <span className="font-medium text-gray-900 dark:text-white text-sm">
                          {req.conversation.user.username}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {req.message}
                      </p>
                      <div className="flex gap-2">
                        <button className="flex-1 px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600">
                          Accept
                        </button>
                        <button className="flex-1 px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600">
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h2>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg text-sm font-medium hover:bg-emerald-200 dark:hover:bg-emerald-900/50 text-left">
                  📚 View Resources
                </button>
                <button className="w-full px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 text-left">
                  📊 My Statistics
                </button>
                <Link
                  href="/impact"
                  className="block w-full px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg text-sm font-medium hover:bg-purple-200 dark:hover:bg-purple-900/50 text-left"
                >
                  📈 Impact Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
