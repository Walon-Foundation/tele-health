"use client";

import Image from "next/image";
import { useState } from "react";

const AVATARS = [1, 2, 3, 4, 5, 6, 7, 8];

const TOPICS = [
  { id: "trauma", label: "🧠 Trauma & PTSD" },
  { id: "addiction", label: "💊 Substance Use & Addiction" },
  { id: "anxiety", label: "😰 Anxiety & Stress" },
  { id: "depression", label: "😢 Depression & Sadness" },
  { id: "relationships", label: "💔 Relationship Issues" },
  { id: "family", label: "👨‍👩‍👧 Family Conflicts" },
  { id: "work", label: "💼 Work/School Stress" },
  { id: "grief", label: "⚖️ Grief & Loss" },
  { id: "crisis", label: "🆘 Crisis Support" },
];

const AGE_RANGES = ["15-19", "20-25", "26-30", "31-35", "36+"];
const GENDERS = ["Male", "Female"];

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
  const [username, setUsername] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [gender, setGender] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleTopic = (topicId: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((t) => t !== topicId)
        : [...prev, topicId]
    );
  };

  const handleNext = async () => {
    setError("");
    if (step === 1 && !selectedAvatar) {
      setError("Please select an avatar");
      return;
    }
    if (step === 2 && username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }
    if (step === 4 && selectedTopics.length === 0) {
      setError("Please select at least one topic");
      return;
    }
    if (step === 5) {
      if (pin.length < 4 || pin.length > 6) {
        setError("PIN must be 4-6 digits");
        return;
      }
      if (pin !== confirmPin) {
        setError("PINs do not match");
        return;
      }
      
      // Create user in database
      setLoading(true);
      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username,
            avatar: selectedAvatar,
            ageRange,
            gender,
            topics: selectedTopics,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create user');
        }

        const { user } = await response.json();
        
        // Store userId and PIN locally
        localStorage.setItem('safespace_user_id', user.id);
        localStorage.setItem('safespace_pin', pin);
        localStorage.setItem('safespace_profile', JSON.stringify(user));

        // Create initial conversation
        const convResponse = await fetch('/api/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            topics: selectedTopics,
            requestCounselor: false,
          }),
        });

        if (convResponse.ok) {
          const { conversation } = await convResponse.json();
          localStorage.setItem('safespace_current_conversation', conversation.id);
        }

        window.location.href = "/chat";
      } catch (err) {
        setError("Failed to create account. Please try again.");
        setLoading(false);
      }
      return;
    }
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setError("");
    setStep((s) => s - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
        {/* Progress indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-2 w-8 rounded-full transition-all ${
                s <= step
                  ? "bg-emerald-500"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Avatar Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Choose Your Avatar
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                This will be your anonymous identity
              </p>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {AVATARS.map((num) => (
                <button
                  key={num}
                  onClick={() => setSelectedAvatar(num)}
                  className={`relative aspect-square rounded-full overflow-hidden border-4 transition-all hover:scale-105 ${
                    selectedAvatar === num
                      ? "border-emerald-500 ring-4 ring-emerald-200 dark:ring-emerald-800"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={`/avatars/avatar_${num}.png`}
                    alt={`Avatar ${num}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Username */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Create Your Username
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Choose an anonymous name (no real names!)
              </p>
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g., BlueButterfly23"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              maxLength={20}
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              {username.length}/20 characters
            </p>
          </div>
        )}

        {/* Step 3: Optional Demographics */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Tell Us About You
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Optional – helps us match you better
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Age Range
                </label>
                <div className="flex flex-wrap gap-2">
                  {AGE_RANGES.map((range) => (
                    <button
                      key={range}
                      onClick={() => setAgeRange(ageRange === range ? "" : range)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        ageRange === range
                          ? "bg-emerald-500 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Gender
                </label>
                <div className="flex flex-wrap gap-2">
                  {GENDERS.map((g) => (
                    <button
                      key={g}
                      onClick={() => setGender(gender === g ? "" : g)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        gender === g
                          ? "bg-emerald-500 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Topic Selection */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                What Would You Like Help With?
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Select all that apply
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => toggleTopic(topic.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedTopics.includes(topic.id)
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {topic.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: PIN Creation */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Create Your PIN
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                4-6 digits to protect your privacy
              </p>
            </div>
            <div className="space-y-4">
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Enter PIN"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center text-2xl tracking-widest focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Confirm PIN"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center text-2xl tracking-widest focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Your PIN is stored locally – we never see it
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <p className="mt-4 text-red-500 text-sm text-center">{error}</p>
        )}

        {/* Navigation buttons */}
        <div className="mt-8 flex gap-3">
          {step > 1 && (
            <button
              onClick={handleBack}
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={loading}
            className="flex-1 px-6 py-3 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-50"
          >
            {loading ? "Creating..." : step === 5 ? "Get Started" : "Continue"}
          </button>
        </div>

        {/* Skip link for optional step */}
        {step === 3 && (
          <button
            onClick={() => setStep(4)}
            className="w-full mt-4 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            Skip this step
          </button>
        )}
      </div>
    </div>
  );
}
