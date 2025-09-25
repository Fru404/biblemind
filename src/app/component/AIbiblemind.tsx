"use client";

import React, { useState, KeyboardEvent, useEffect } from "react";
import {
  FaTimes,
  FaMinus,
  FaCommentDots,
  FaPaperPlane,
  FaTrash,
  FaBookmark,
} from "react-icons/fa";
import { bookMark, countBookmarks } from "../utils/bookmark";
import { useSession } from "next-auth/react";

interface AIbiblemindProps {
  contextText?: string;
  highlight?: string | null;
}

const AIbiblemind: React.FC<AIbiblemindProps> = ({
  contextText,
  highlight,
}) => {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (highlight) {
      setInput(highlight);
      setOpen(true);
      setMinimized(false);
    }
  }, [highlight]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/bible-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          context: contextText,
        }),
      });
      const data = await res.json();
      const assistantMessage = { role: "assistant", content: data.reply };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("AI error:", err);
      setNotification("AI request failed ❌");
      setTimeout(() => setNotification(null), 2000);
    }

    setLoading(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => setMessages([]);

  const handleBookmark = async () => {
    if (messages.length === 0) return;
    /*
    const bookmarkCount = countBookmarks();
    const MAX_BOOKMARKS = 10; // optional limit for display, can remove if unlimited

    if (bookmarkCount >= MAX_BOOKMARKS) {
      setNotification(
        `You have reached the maximum of ${MAX_BOOKMARKS} bookmarks. `
      );
      setTimeout(() => setNotification(null), 3000);
      return;
    }*/

    const lastMessage = messages[messages.length - 1];

    try {
      // Save bookmark. If user is signed in, pass name/email; else null
      await bookMark(
        lastMessage,
        session?.user?.name || "Anonymous",
        session?.user?.email ?? "anonymous@user.biblemind.onrender.com"
      );
      setNotification("Bookmarked! ✅");
    } catch (err) {
      console.error(err);
      setNotification("Failed to bookmark ❌");
    }

    setTimeout(() => setNotification(null), 2000);
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading AI…
      </div>
    );
  }

  return (
    <div>
      {notification && (
        <div className="fixed bottom-20 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg text-sm z-50">
          {notification}
        </div>
      )}

      {!open && (
        <button
          className="fixed bottom-4 right-4 bg-[#8b1817] text-white px-3 py-2 rounded-full shadow-lg flex items-center gap-2"
          onClick={() => {
            setOpen(true);
            setMinimized(false);
          }}
        >
          <FaCommentDots /> Discuss
        </button>
      )}

      {open && (
        <div className="fixed bottom-4 right-4 w-80 bg-white border rounded shadow-lg flex flex-col">
          {/* HEADER */}
          <div className="flex justify-between items-center p-2 border-b bg-[#8B0000] text-white font-bold">
            <span>BibleMind AI</span>
            <div className="flex gap-2 items-center">
              <button onClick={clearChat} title="Clear Chat">
                <FaTrash size={14} />
              </button>
              <button onClick={() => setMinimized((m) => !m)} title="Minimize">
                <FaMinus size={14} />
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  setMinimized(false);
                }}
                title="Close"
              >
                <FaTimes size={14} />
              </button>
            </div>
          </div>

          {/* CONTENT */}
          {!minimized && (
            <>
              <div className="flex-1 p-2 overflow-y-auto space-y-2 text-sm max-h-64">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded ${
                      m.role === "user"
                        ? "bg-[#8b1817] text-white self-end"
                        : "bg-[#f5f5f5] text-gray-800"
                    }`}
                  >
                    {m.content}
                  </div>
                ))}
                {loading && <div className="text-gray-500">...</div>}
              </div>

              {/* INPUT */}
              <div className="p-2 flex gap-2 border-t">
                <button
                  className="bg-[#8B0000] text-white px-2 rounded flex items-center justify-center"
                  onClick={handleBookmark}
                  disabled={loading}
                  title="Bookmark last message"
                >
                  <FaBookmark />
                </button>

                <input
                  className="flex-1 border rounded px-2 py-1 text-sm"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about today's readings..."
                />

                <button
                  className="bg-[#8B0000] text-white px-2 rounded flex items-center justify-center"
                  onClick={sendMessage}
                  disabled={loading}
                >
                  <FaPaperPlane />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AIbiblemind;
