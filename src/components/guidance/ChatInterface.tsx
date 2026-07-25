"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  ChatMessage,
  GuidanceResponse,
  RecoveryProfile,
} from "@/types/recovery";
import { saveConversation, getConversation } from "@/lib/storage";
import { cn } from "@/lib/cn";
import { GuidancePanel } from "./GuidancePanel";
import { Send, Settings, RotateCcw } from "lucide-react";

interface ChatInterfaceProps {
  profile: RecoveryProfile;
  onEditProfile: () => void;
}

export function ChatInterface({ profile, onEditProfile }: ChatInterfaceProps) {
  const [conversation, setConversation] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [latestGuidance, setLatestGuidance] = useState<GuidanceResponse | null>(
    null
  );
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load conversation history on mount
  useEffect(() => {
    const savedConversation = getConversation();
    setConversation(savedConversation);
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, loading, latestGuidance]);

  // Focus input when loading finishes
  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
    }
  }, [loading]);

  const sendMessage = useCallback(
    async (text?: string) => {
      const userText = text ?? message;
      if (!userText.trim() || loading) return;

      const userMessage: ChatMessage = {
        role: "user",
        message: userText.trim(),
      };

      const updatedConversation = [...conversation, userMessage];

      setConversation(updatedConversation);
      saveConversation(updatedConversation);
      setMessage("");
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/guidance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profile,
            conversation: updatedConversation,
          }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error ?? "Unable to get a response.");
        }

        setLatestGuidance(result.data);
        const newConversation = [
          ...updatedConversation,
          {
            role: "assistant" as const,
            message: result.data.assistantMessage,
          },
        ];
        setConversation(newConversation);
        saveConversation(newConversation);
      } catch (caught) {
        setError(
          caught instanceof Error
            ? caught.message
            : "Something went wrong. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
    [conversation, loading, message, profile]
  );

  const handleClearConversation = useCallback(() => {
    setConversation([]);
    setLatestGuidance(null);
    saveConversation([]);
  }, []);

  return (
    <div className="flex h-screen flex-col bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-4xl">🌱</div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Sentinel</h1>
            <p className="text-sm text-slate-600">Your Recovery Coach</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleClearConversation}
            className="flex items-center gap-2 rounded-lg bg-slate-200 hover:bg-slate-300 px-4 py-2 text-sm font-medium text-slate-900 transition"
            title="Clear conversation"
          >
            <RotateCcw size={16} />
            Clear
          </button>
          <button
            type="button"
            onClick={onEditProfile}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-sm font-medium text-white shadow-md hover:shadow-lg transition"
          >
            <Settings size={16} />
            Profile
          </button>
        </div>
      </header>

      {/* Guidance Panel */}
      <GuidancePanel
        guidance={latestGuidance}
        trustedPersonName={profile.trustedPerson.name}
      />

      {/* Chat Area */}
      <section className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {conversation.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-6">
              <div className="text-6xl animate-bounce">🌱</div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  Welcome, {profile.name}
                </h2>
                <p className="text-lg text-slate-600 max-w-md">
                  I'm here to support you. Tell me how you're feeling today.
                </p>
              </div>
            </div>
          </div>
        )}

        {conversation.map((chat, index) => (
          <div
            key={`${chat.role}-${index}`}
            className={cn(
              "flex w-full",
              chat.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-xl rounded-2xl px-5 py-3 text-base leading-relaxed",
                chat.role === "user"
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md"
                  : "bg-slate-100 text-slate-900 border border-slate-200"
              )}
            >
              {chat.role === "assistant" && <span className="mr-2">🌱</span>}
              {chat.message}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 border border-slate-200 rounded-2xl px-5 py-3 text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-start">
            <div className="bg-red-100 border border-red-300 text-red-800 rounded-2xl px-5 py-3 text-sm">
              {error}
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </section>

      {/* Input Area */}
      <div className="border-t border-slate-200 bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          {/* Input Field */}
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Type your message..."
              disabled={loading}
              className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-3 text-slate-900 placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:opacity-50 transition"
            />
          </div>

          {/* Send Button */}
          <button
            type="button"
            onClick={() => sendMessage()}
            disabled={loading || !message.trim()}
            className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white flex items-center justify-center shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
            aria-label="Send message"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
