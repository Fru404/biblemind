"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { createClient } from "@supabase/supabase-js";

interface Bookmark {
  id: string;
  role: string;
  content: string;
  summary: string;
  date: string;
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const { data: session } = useSession();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!
  );

  useEffect(() => {
    const fetchBookmarks = async () => {
      // Load local bookmarks first
      const cached: Bookmark[] = JSON.parse(
        localStorage.getItem("bookmarked") || "[]"
      );

      // Fetch Supabase bookmarks if signed in
      let supabaseBookmarks: Bookmark[] = [];
      if (
        session?.user?.email &&
        session.user.email !== "anonymous@user.biblemind.onrender.com"
      ) {
        const { data, error } = await supabase
          .from("bookmark_table")
          .select("bookmark")
          .eq("email", session.user.email);

        if (error) {
          console.error("Error fetching bookmarks from Supabase:", error);
        } else if (data) {
          supabaseBookmarks = data.map((d) => d.bookmark);
        }
      }

      // Merge local + Supabase, avoiding duplicates
      const merged = [
        ...cached,
        ...supabaseBookmarks.filter(
          (sb) => !cached.find((cb) => cb.id === sb.id)
        ),
      ];

      // Sort by date descending
      merged.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setBookmarks(merged);
      localStorage.setItem("bookmarked", JSON.stringify(merged));
    };

    fetchBookmarks();
  }, [session?.user?.email, supabase]);

  const deleteBookmark = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this bookmark?"))
      return;

    const updated = bookmarks.filter((bm) => bm.id !== id);
    setBookmarks(updated);
    localStorage.setItem("bookmarked", JSON.stringify(updated));

    // Delete from Supabase if signed in
    if (
      session?.user?.email &&
      session.user.email !== "anonymous@user.biblemind.onrender.com"
    ) {
      const { error } = await supabase
        .from("bookmark_table")
        .delete()
        .eq("email", session.user.email)
        .eq("bookmark->>id", id);

      if (error)
        console.error("Failed to delete bookmark from Supabase:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-6 py-4 bg-red-900 text-white shadow-md">
        <Link href="/" className="hover:underline font-semibold">
          ← Back To Home
        </Link>
        <h1 className="text-xl font-bold">Your Bookmarks</h1>
      </nav>

      {/* MAIN */}
      <main className="flex-1 flex flex-col items-center justify-start p-6 w-full max-w-4xl mx-auto">
        {!session && (
          <p className="p-4 text-center text-sm text-gray-600 border rounded bg-white shadow-sm mb-4">
            Sign in to sync bookmarks across devices.{" "}
            <Link
              href="/profile"
              className="text-red-900 font-semibold underline hover:text-red-700 transition"
              title="Profile"
            >
              Sign In
            </Link>
          </p>
        )}

        {bookmarks.length === 0 ? (
          <p className="text-gray-500 text-lg mt-8">No bookmarks yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {bookmarks.map((bm) => (
              <div
                key={bm.id}
                className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition flex flex-col justify-between"
              >
                <div className="mb-2">
                  <h2 className="font-semibold text-lg text-gray-800">
                    {bm.summary || bm.content.slice(0, 80) + "..."}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">{bm.date}</p>
                  <p className="text-gray-700 mt-2 line-clamp-4">
                    {bm.content}
                  </p>
                </div>

                <div className="flex justify-end gap-2 mt-3">
                  <Link
                    href={`/bookmark/${bm.id}`}
                    className="text-white bg-red-900 px-3 py-1 rounded hover:bg-red-700 transition text-sm"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => deleteBookmark(bm.id)}
                    className="text-red-900 border border-red-900 px-3 py-1 rounded hover:bg-red-100 transition text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="p-4 text-center text-sm text-gray-500 border-t mt-6">
        BibleMind. All rights reserved.
      </footer>
    </div>
  );
}
