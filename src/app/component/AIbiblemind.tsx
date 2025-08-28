"use client";
import React, { useState } from "react";
import { FaTimes, FaMinus, FaCommentDots } from "react-icons/fa";

const AIbiblemind = ({ contextText }: { contextText?: string }) => {
  const [open, setOpen] = useState(false); // fully opened chat
  const [minimized, setMinimized] = useState(false); // minimized but still running
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

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
    }
    setLoading(false);
  };

  return (
    <div>
      {!open && (
        <button
          className="fixed bottom-4 right-4 bg-[#8B0000] text-white px-3 py-2 rounded-full shadow-lg flex items-center gap-2"
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
            <div className="flex gap-2">
              {/* Minimize */}
              <button onClick={() => setMinimized((m) => !m)}>
                <FaMinus size={14} />
              </button>
              {/* Close */}
              <button
                onClick={() => {
                  setOpen(false);
                  setMinimized(false);
                }}
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
                        ? "bg-gray-200 text-gray-900 self-end"
                        : "bg-[#f5f5f5] text-gray-800"
                    }`}
                  >
                    {m.content}
                  </div>
                ))}
                {loading && <div className="text-gray-500">Thinking...</div>}
              </div>

              {/* INPUT */}
              <div className="p-2 flex gap-2 border-t">
                <input
                  className="flex-1 border rounded px-2 py-1 text-sm"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about today's readings..."
                />
                <button
                  className="bg-[#8B0000] text-white px-2 rounded"
                  onClick={sendMessage}
                  disabled={loading}
                >
                  Send
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
