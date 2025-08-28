"use client";
import React, { useState } from "react";

const AIbiblemind = ({ contextText }: { contextText?: string }) => {
  const [open, setOpen] = useState(false);
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
      <button
        className="bg-[#8B0000] text-white px-3 py-1 rounded shadow"
        onClick={() => setOpen((o) => !o)}
      >
        Discuss
      </button>

      {open && (
        <div className="fixed bottom-4 right-4 w-80 bg-white border rounded shadow-lg flex flex-col">
          <div className="p-2 border-b font-bold bg-[#8B0000] text-white">
            BibleMind AI
          </div>
          <div className="flex-1 p-2 overflow-y-auto space-y-2 text-sm">
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
        </div>
      )}
    </div>
  );
};

export default AIbiblemind;
