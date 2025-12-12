"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";

interface Message {
  id: string;
  senderId: string;
  senderType: "user" | "counselor";
  contentType: "text" | "voice";
  content: string;
  voiceDuration?: number;
  createdAt: string;
  isRead: boolean;
}

interface Profile {
  id: string;
  avatar: number;
  username: string;
  topics: string[];
}

export default function ChatPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  useEffect(() => {
    // Check for profile
    const savedProfile = localStorage.getItem("safespace_profile");
    const savedConversationId = localStorage.getItem("safespace_current_conversation");
    
    if (!savedProfile) {
      window.location.href = "/signup";
      return;
    }
    
    const profileData = JSON.parse(savedProfile);
    setProfile(profileData);
    setConversationId(savedConversationId);

    // Load messages from API
    if (savedConversationId) {
      fetchMessages(savedConversationId);
      // Poll for new messages every 5 seconds
      const pollInterval = setInterval(() => {
        fetchMessages(savedConversationId);
      }, 5000);

      return () => clearInterval(pollInterval);
    }

    // Online/offline detection
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async (convId: string) => {
    try {
      const response = await fetch(`/api/conversations/${convId}/messages`);
      if (response.ok) {
        const { messages: fetchedMessages } = await response.json();
        setMessages(fetchedMessages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (content: string, contentType: "text" | "voice" = "text", voiceDuration?: number) => {
    if (!content.trim() && contentType === "text") return;
    if (!conversationId || !profile) return;

    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: profile.id,
          senderType: 'user',
          contentType,
          content,
          voiceDuration,
        }),
      });

      if (response.ok) {
        // Immediately fetch updated messages
        await fetchMessages(conversationId);
        setInputText("");
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Use webm with opus codec for best compression
      const options = { mimeType: 'audio/webm;codecs=opus' };
      const recorder = new MediaRecorder(stream, options);
      
      audioChunks.current = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        
        // Upload audio file
        await uploadAudio(audioBlob);
      };

      recorder.start();
      mediaRecorder.current = recorder;
      setIsRecording(true);
      setRecordingTime(0);
      
      recordingInterval.current = setInterval(() => {
        setRecordingTime((t) => {
          if (t >= 180) { // Max 3 minutes
            stopRecording();
            return t;
          }
          return t + 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access  microphone. Please grant permission.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
    }
    
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
    }
    
    setIsRecording(false);
  };

  const uploadAudio = async (audioBlob: Blob) => {
    if (recordingTime === 0) return;
    
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'voice-note.webm');

      const response = await fetch('/api/audio', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const { url } = await response.json();
        await sendMessage(url, 'voice', recordingTime);
      } else {
        alert('Failed to upload voice note');
      }
    } catch (error) {
      console.error('Error uploading audio:', error);
      alert('Failed to upload voice note');
    } finally {
      setIsUploading(false);
      setRecordingTime(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatTimestamp = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputText);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <a href="/dashboard" className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </a>
        <div className="relative">
          <Image
            src="/avatars/avatar_3.png"
            alt="Counselor Hope"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-gray-800 rounded-full" />
        </div>
        <div className="flex-1">
          <h1 className="font-semibold text-gray-900 dark:text-white">Counselor Hope</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {isTyping ? "typing..." : "Online • Specializes in Trauma & Anxiety"}
          </p>
        </div>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </header>

      {/* Offline banner */}
      {!isOnline && (
        <div className="bg-amber-500 text-white text-center py-2 text-sm">
          📴 You're offline – messages will send when connected
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderType === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.senderType === "user"
                  ? "bg-emerald-500 text-white rounded-br-md"
                  : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-md shadow-sm"
              }`}
            >
              {message.contentType === "voice" ? (
                <div className="flex items-center gap-3">
                  <audio 
                    src={message.content} 
                    controls 
                    className="max-w-full"
                    style={{ height: '40px' }}
                  />
                  <span className="text-xs opacity-75 whitespace-nowrap">
                    {formatTime(message.voiceDuration || 0)}
                  </span>
                </div>
              ) : (
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
              )}
              <div className={`flex items-center justify-end gap-1 mt-1 ${message.senderType === "user" ? "text-white/70" : "text-gray-500 dark:text-gray-400"}`}>
                <span className="text-xs">{formatTimestamp(message.createdAt)}</span>
                {message.senderType === "user" && (
                  <span className="text-xs">
                    {message.isRead ? "✓✓" : "✓"}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        {isRecording ? (
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                stopRecording();
                setRecordingTime(0);
                audioChunks.current = [];
              }}
              className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex-1 flex items-center gap-3">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-gray-900 dark:text-white font-medium">{formatTime(recordingTime)}</span>
              <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 transition-all"
                  style={{ width: `${(recordingTime / 180) * 100}%` }}
                />
              </div>
            </div>
            <button
              onClick={stopRecording}
              disabled={isUploading}
              className="p-3 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-colors disabled:opacity-50"
            >
              {isUploading ? (
                <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          </div>
        ) : (
          <div className="flex items-end gap-3">
            <button
              onClick={startRecording}
              className="p-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="Hold to record voice note"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
            <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none outline-none max-h-32"
                rows={1}
              />
            </div>
            <button
              onClick={() => sendMessage(inputText)}
              disabled={!inputText.trim()}
              className="p-3 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
