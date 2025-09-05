"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Bookmark {
  id: string;
  role: string;
  content: string;
  date: string;
  summary: string;
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("bookmarked") || "[]");
    setBookmarks(stored);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f5] text-gray-900">
      {/* NAVBAR */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-4 bg-[#8B0000] text-white shadow-md">
        <Link href="/" className="hover:underline">
          ← Back To Home
        </Link>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col items-center justify-start p-6 w-full max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Bookmarked Chats</h1>

        {bookmarks.length === 0 ? (
          <p className="text-gray-600">No bookmarks yet.</p>
        ) : (
          <ul className="w-full space-y-3">
            {bookmarks.map((bm) => (
              <li
                key={bm.id}
                className="p-4 border rounded bg-white shadow-sm hover:shadow-md transition"
              >
                <Link href={`/bookmark/${bm.id}`} className="block">
                  <h2 className="font-semibold text-lg">
                    {bm.summary || bm.content.slice(0, 40) + "..."}
                  </h2>
                  <p className="text-sm text-gray-500">{bm.date}</p>
                </Link>
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
