"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

interface Bookmark {
  id: string;
  role: string;
  content?: string;
  date: string;
  summary?: string;
}
interface BookmarkRow {
  email: string;
  name: string | null;
  bookmark: Bookmark;
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const { data: session } = useSession();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!
  );
  const router = useRouter();

  // Sync bookmarks with Supabase when user signs in
  useEffect(() => {
    const email = session?.user?.email;
    if (!email) return;

    async function syncBookmarks() {
      // 1. Load local bookmarks
      const localBookmarks: Bookmark[] = JSON.parse(
        localStorage.getItem("bookmarked") || "[]"
      );

      // 2. Fetch Supabase bookmarks
      const { data, error } = await supabase
        .from("bookmark_table")
        .select("bookmark")
        .eq("email", email);

      if (error) {
        console.error("Error fetching from Supabase:", error);
        return;
      }

      const supabaseBookmarks: Bookmark[] =
        (data as BookmarkRow[])?.map((item) => item.bookmark) || [];
      // 3. Identify local bookmarks not in Supabase
      const newBookmarks = localBookmarks.filter(
        (lb) => !supabaseBookmarks.find((sb) => sb.id === lb.id)
      );

      // 4. Insert missing bookmarks into Supabase
      if (newBookmarks.length > 0) {
        const { error: insertError } = await supabase
          .from("bookmark_table")
          .insert(
            newBookmarks.map((bm) => ({
              email,
              name: session?.user?.name || null,
              bookmark: bm, // store the JSON object
            }))
          );

        if (insertError)
          console.error("Error inserting bookmarks:", insertError);
      }

      // 5. Merge for display
      const merged = [...supabaseBookmarks, ...newBookmarks].reverse();
      setBookmarks(merged);

      // Update localStorage with merged bookmarks
      localStorage.setItem("bookmarked", JSON.stringify(merged));
    }

    syncBookmarks();
  }, [session]);

  // Load local bookmarks immediately for fast UI
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("bookmarked") || "[]");
    setBookmarks(stored.reverse());
  }, []);

  const deleteBookmark = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this bookmark?"
    );
    if (!confirmDelete) return;

    try {
      // ✅ Delete from Supabase
      const { error } = await supabase
        .from("bookmark_table")
        .delete()

        .eq("email", session?.user?.email);

      if (error) {
        console.error("Error deleting from Supabase:", error.message);
        alert("Failed to delete bookmark from the server.");
        return;
      }

      // ✅ Update local cache
      const updated = bookmarks.filter((bm) => bm.id !== id);
      setBookmarks(updated);
      localStorage.setItem("bookmarked", JSON.stringify(updated));

      console.log("Bookmark deleted from Supabase and cache.");
    } catch (err) {
      console.error("Unexpected error deleting bookmark:", err);
      alert("Something went wrong while deleting the bookmark.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f5] text-gray-900">
      {/* NAVBAR */}
      <nav className="relative z-20 mt-6 flex items-center justify-between px-4 py-3 bg-[#8B0000] text-white shadow-md rounded-2xl transition-all duration-300 ease-in-out w-11/12 max-w-6xl mx-auto">
        <button onClick={() => router.back()} className="hover:underline">
          ← Back
        </button>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col items-center justify-start p-6 w-full max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Bookmarked Reflections</h1>

        {!session && (
          <p className="p-4 text-center text-sm text-gray-600 border-t">
            Sign in to sync bookmarks across devices.{" "}
            <Link
              href="/profile"
              className="hover:text-gray-300 transition underline"
              title="Profile"
            >
              Go to Sign In
            </Link>
          </p>
        )}

        {bookmarks.length === 0 ? (
          <p className="text-gray-600">No bookmarks yet.</p>
        ) : (
          <ul className="w-full space-y-3">
            {bookmarks.map((bm) => (
              <li
                key={bm.id}
                className="p-4 border rounded bg-white shadow-sm hover:shadow-md transition flex justify-between items-start"
              >
                <Link href={`/bookmark/${bm.id}`} className="flex-1 pr-3">
                  <h2 className="font-semibold text-lg">
                    {bm.summary ||
                      bm.content?.slice(0, 40) + "..." ||
                      "No content"}
                  </h2>
                  <p className="text-sm text-gray-500">{bm.date}</p>
                </Link>
                <button
                  onClick={() => deleteBookmark(bm.id)}
                  className="text-red-500 hover:text-red-700 font-bold"
                  title="Delete bookmark"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>

      {/* FOOTER */}
      <footer className="p-4 text-center text-sm text-gray-600 border-t">
        BibleMind. All rights reserved.
      </footer>
    </div>
  );
}
