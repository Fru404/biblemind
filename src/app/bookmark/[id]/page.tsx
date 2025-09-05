"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Bookmark {
  id: string;
  role: string;
  content: string;
  date: string;
  summary: string;
}

export default function BookmarkDetailPage() {
  const { id } = useParams();
  const [bookmark, setBookmark] = useState<Bookmark | null>(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("bookmarked") || "[]");
    const found = stored.find((bm: Bookmark) => bm.id === id);
    setBookmark(found || null);
  }, [id]);

  if (!bookmark) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f5f5f5] text-gray-900">
        <nav className="px-6 py-4 bg-[#8B0000] text-white shadow-md">
          <Link href="/bookmark" className="hover:underline">
            ← Back to Bookmarks
          </Link>
        </nav>

        <main className="flex-1 flex items-center justify-center p-6">
          <p className="text-gray-600">Bookmark not found.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f5] text-gray-900">
      {/* NAVBAR */}
      <nav className="px-6 py-4 bg-[#8B0000] text-white shadow-md">
        <Link href="/bookmark" className="hover:underline">
          ← Back to Bookmarks
        </Link>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">{bookmark.summary}</h1>
        <p className="text-sm text-gray-500 mb-4">{bookmark.date}</p>

        <div className="p-4 border rounded bg-white shadow-sm">
          <p className="whitespace-pre-wrap">{bookmark.content}</p>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="p-4 text-center text-sm text-gray-600 border-t">
        BibleMind. All rights reserved.
      </footer>
    </div>
  );
}
