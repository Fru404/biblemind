"use client";
import React from "react";
import Link from "next/link";
import { FaPaperPlane } from "react-icons/fa";
import { useRouter } from "next/router";

export default function Contact() {
  const router = useRouter();
  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f5] text-gray-900">
      {/* NAVBAR */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-4 bg-[#8B0000] text-white shadow-md">
        <button onClick={() => router.back()} className="hover:underline">
          ← Back
        </button>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        {/* CONTACT CARD */}
        <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md border border-gray-200 mb-6">
          <h2 className="text-xl font-semibold mb-2">Contact</h2>
          <p className="text-gray-700">Email:</p>
          <Link
            href="mailto:ngwafru15@gmail.com"
            className="text-blue-600 hover:underline"
          >
            ngwafru15@gmail.com
          </Link>
        </div>

        {/* SUGGESTION FORM */}
        <form className="w-full max-w-md flex flex-col gap-3">
          <textarea
            placeholder="Your suggestions..."
            className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#8B0000] resize-none h-32"
          />
          <button
            type="submit"
            className="bg-[#8B0000] text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-red-800 transition"
          >
            <FaPaperPlane />
            Send
          </button>
        </form>
      </main>

      {/* FOOTER */}
      <footer className="p-4 text-center text-sm text-gray-600 border-t">
        BibleMind. All rights reserved.
      </footer>
    </div>
  );
}
