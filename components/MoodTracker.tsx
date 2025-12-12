"use client";

import { useState } from "react";

interface MoodTrackerProps {
  type: "pre" | "post";
  onSelect: (mood: number, note?: string) => void;
  onSkip?: () => void;
}

const MOODS = [
  { value: 1, emoji: "😢", label: "Very Bad", color: "bg-red-500" },
  { value: 2, emoji: "😞", label: "Bad", color: "bg-orange-500" },
  { value: 3, emoji: "😐", label: "Okay", color: "bg-yellow-500" },
  { value: 4, emoji: "😊", label: "Good", color: "bg-emerald-500" },
  { value: 5, emoji: "😄", label: "Very Good", color: "bg-green-500" },
];

export default function MoodTracker({ type, onSelect, onSkip }: MoodTrackerProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [showNote, setShowNote] = useState(false);

  const handleSubmit = () => {
    if (selectedMood) {
      onSelect(selectedMood, note || undefined);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {type === "pre" ? "How are you feeling?" : "How do you feel now?"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {type === "pre" 
              ? "Let's check in before we start"
              : "Thanks for sharing. How are you feeling after our chat?"}
          </p>
        </div>

        {/* Mood Selection */}
        <div className="flex justify-between gap-2 mb-6">
          {MOODS.map((mood) => (
            <button
              key={mood.value}
              onClick={() => setSelectedMood(mood.value)}
              className={`flex-1 aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${
                selectedMood === mood.value
                  ? `${mood.color} text-white scale-110 shadow-lg`
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:scale-105"
              }`}
            >
              <span className="text-3xl">{mood.emoji}</span>
              <span className="text-xs font-medium">{mood.label}</span>
            </button>
          ))}
        </div>

        {/* Optional Note */}
        {selectedMood && !showNote && (
          <button
            onClick={() => setShowNote(true)}
            className="w-full text-sm text-emerald-600 dark:text-emerald-400 hover:underline mb-4"
          >
            + Add a note (optional)
          </button>
        )}

        {showNote && (
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What's on your mind? (optional)"
            className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4 resize-none"
            rows={3}
          />
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {onSkip && (
            <button
              onClick={onSkip}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              Skip
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={!selectedMood}
            className="flex-1 px-4 py-3 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
