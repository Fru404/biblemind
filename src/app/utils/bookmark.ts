// utils/bookmark.ts
import { nanoid } from "nanoid"; // npm i nanoid

export async function bookMark(message: { role: string; content: string }) {
  // call your AI summarizer (Gemini, OpenAI, etc.)
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

// Fake placeholder – replace with Gemini API call
async function generateSummary(content: string): Promise<string> {
  // Example: call Gemini API here
  // For now just shorten content
  return content.length > 40 ? content.slice(0, 40) + "..." : content;
}
