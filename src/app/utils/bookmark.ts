// utils/bookmark.ts
import { nanoid } from "nanoid";
import { createClient } from "@supabase/supabase-js";

// Pass name and email as arguments from your component
export async function bookMark(
  message: { role: string; content: string },
  name: string,
  email: string
) {
  if (!email) {
    console.error("No email provided. Bookmark not saved.");
    return;
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!
  );

  // Generate summary for the new bookmark
  const summary = await generateSummary(message.content);

  const newBookmark = {
    id: nanoid(),
    role: message.role,
    content: message.content,
    summary,
    date: new Date().toLocaleString("en-GB"),
  };

  // Retrieve cached bookmarks from localStorage
  const existingBookmarks: any[] = JSON.parse(
    localStorage.getItem("bookmarked") || "[]"
  );

  // Add the new bookmark to cache
  existingBookmarks.push(newBookmark);
  localStorage.setItem("bookmarked", JSON.stringify(existingBookmarks));

  // Insert all cached bookmarks into Supabase
  const { error } = await supabase.from("bookmark_table").insert(
    existingBookmarks.map((b) => ({
      name,
      email,
      bookmark: b,
    }))
  );

  if (error) {
    console.error("Error saving bookmarks to Supabase:", error);
  } else {
    console.log("Bookmarks inserted successfully!");
  }
}

// Helper function to generate a summary
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

// utils/bookmark.ts
export function countBookmarks(): number {
  const cached = localStorage.getItem("bookmarked");
  if (!cached) return 0;
  try {
    const bookmarks = JSON.parse(cached);
    return Array.isArray(bookmarks) ? bookmarks.length : 0;
  } catch (err) {
    console.error("Failed to parse bookmarks from cache:", err);
    return 0;
  }
}
