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

import ai_icon from "@/public/ai_icon.png";
import Image from "next/image";

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
  const [bookmarked, setBookmarked] = useState(false);

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
      setBookmarked(true);
      setNotification("Bookmarked successfully!");
      setTimeout(() => setNotification(""), 2000);
    } catch (err) {
      console.error(err);
      setNotification("Failed to bookmark ❌");
    } finally {
      setLoading(false);
    }
    setTimeout(() => setNotification(""), 2000);
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
      {!open && (
        <button
          className="fixed bottom-4 right-4 bg-[#8b1817] text-white px-3 py-2 rounded-full shadow-lg flex items-center gap-2 z-50 "
          onClick={() => {
            setOpen(true);
            setMinimized(false);
          }}
          style={{ cursor: "pointer" }}
        >
          <Image
            src={ai_icon}
            alt="Biblemind AI icon"
            width={25}
            height={25}
            className="rounded"
            style={{ cursor: "pointer" }}
          />
          Discuss
        </button>
      )}

      {open && (
        <div className="fixed bottom-4 right-4 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl flex flex-col z-50 overflow-hidden">
          {/* HEADER */}
          <div className="flex justify-between items-center p-3 bg-[#8B0000] text-white font-semibold shadow-sm">
            <div className="flex items-center gap-2">
              <Image
                src={ai_icon}
                alt="Biblemind AI icon"
                width={30}
                height={28}
                className="rounded-full"
                style={{ cursor: "pointer" }}
              />
              <span className="text-lg">Biblemind</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={clearChat}
                title="Clear Chat"
                className="p-1 hover:bg-red-700 rounded transition"
              >
                <FaTrash size={16} />
              </button>
              <button
                onClick={() => setMinimized((m) => !m)}
                title="Minimize"
                className="p-1 hover:bg-red-700 rounded transition"
              >
                <FaMinus size={16} />
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  setMinimized(false);
                }}
                title="Close"
                className="p-1 hover:bg-red-700 rounded transition"
              >
                <FaTimes size={16} />
              </button>
            </div>
          </div>

          {/* CONTENT */}
          {!minimized && (
            <>
              <div className="flex-1 p-3 overflow-y-auto space-y-2 text-sm max-h-72 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded-lg break-words max-w-[80%] text-xl md:text-2xl font-medium ${
                      m.role === "user"
                        ? "bg-[#8b1817] text-white self-end ml-auto"
                        : "bg-gray-100 text-gray-800 self-start mr-auto"
                    }`}
                  >
                    {m.content}
                  </div>
                ))}
                {loading && (
                  <div className="text-gray-400 italic">Loading...</div>
                )}
              </div>

              {/* INPUT */}
              <div className="p-2 flex gap-2 border-t border-gray-200 bg-gray-50">
                <button
                  className="bg-[#8B0000] hover:bg-red-700 text-white px-3 py-1 rounded flex items-center justify-center transition"
                  onClick={handleBookmark}
                  disabled={loading}
                  title="Bookmark last message"
                >
                  <FaBookmark />
                  {notification && (
                    <div className="fixed bottom-20 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg text-sm z-50">
                      {notification}
                    </div>
                  )}
                </button>

                <input
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about today's readings..."
                />

                <button
                  className="bg-[#8B0000] hover:bg-red-700 text-white px-3 py-1 rounded flex items-center justify-center transition"
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
