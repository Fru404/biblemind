import { nanoid } from "nanoid";

export async function bookMark(message: { role: string; content: string }) {
  const summary = await generateSummary(message.content);

  const newBookmark = {
    id: nanoid(),
    role: message.role,
    content: message.content,
    summary,
    date: new Date().toLocaleString(),
  };

  const existing = JSON.parse(localStorage.getItem("bookmarked") || "[]");
  existing.push(newBookmark);
  localStorage.setItem("bookmarked", JSON.stringify(existing));
}

async function generateSummary(content: string): Promise<string> {
  try {
    const res = await fetch("/api/bookmark-title", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    const data = await res.json();
    if (data.summary) return data.summary.trim();
  } catch (err) {
    console.error("Summary generation failed:", err);
  }

  // fallback
  return content.length > 40 ? content.slice(0, 40) + "..." : content;
}
