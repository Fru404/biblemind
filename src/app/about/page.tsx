"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AboutPage() {
  const router = useRouter();
  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f5] text-gray-900">
      {/* NAVBAR */}
      <nav className="relative z-20 mt-6 flex items-center justify-between px-4 py-3 bg-[#8B0000] text-white shadow-md rounded-2xl transition-all duration-300 ease-in-out w-11/12 max-w-6xl mx-auto">
        <button onClick={() => router.back()} className="hover:underline">
          ← Back
        </button>
        <h1 className="text-lg font-semibold">About</h1>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col items-start justify-start p-6 w-full max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">About Biblemind</h1>

        <p className="mb-6 text-lg leading-relaxed text-gray-700">
          The Bible is not meant to be distant words on a page. It is alive,
          full of promises, wisdom, and guidance for everyday life. Yet for
          many, reading the Bible feels overwhelming, disconnected, or hard to
          apply. That is why <span className="font-semibold">Biblemind</span>{" "}
          was created: to help you not only read Scripture, but live it,
          understand it, and let it transform your daily journey.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-[#8B0000]">
          Why Biblemind?
        </h2>
        <p className="mb-6 text-gray-700 leading-relaxed">
          With the help of Artificial Intelligence, Biblemind brings the Word
          closer to your personal life. Instead of getting lost in long chapters
          or hearing sermons without real change, you’ll discover meaning,
          clarity, and practical steps that meet you right where you are.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-[#8B0000]">
          What You Can Do with Biblemind
        </h2>
        <ul className="space-y-6 mb-8 w-full">
          <li className="p-4 bg-white rounded-2xl shadow-sm border hover:shadow-md transition">
            <p className="font-medium">
              Generate themes and lessons from any Bible passage
            </p>
            <p className="text-gray-600">
              See how Scripture applies directly to your daily life.
            </p>
          </li>
          <li className="p-4 bg-white rounded-2xl shadow-sm border hover:shadow-md transition">
            <p className="font-medium">
              Ask life questions in the light of Scripture
            </p>
            <p className="text-gray-600">
              Receive reflections tailored to your situation and challenges.
            </p>
          </li>
          <li className="p-4 bg-white rounded-2xl shadow-sm border hover:shadow-md transition">
            <p className="font-medium">Highlight & explore context instantly</p>
            <p className="text-gray-600">
              No need to re-read pages. Get quick understanding at a glance.
            </p>
          </li>
          <li className="p-4 bg-white rounded-2xl shadow-sm border hover:shadow-md transition">
            <p className="font-medium">Save & revisit your reflections</p>
            <p className="text-gray-600">
              Bookmark your favorite insights for moments of encouragement.
            </p>
          </li>
          <li className="p-4 bg-white rounded-2xl shadow-sm border hover:shadow-md transition">
            <p className="font-medium">Daily reflections</p>
            <p className="text-gray-600">
              Start your day with uplifting thoughts drawn directly from the
              Word.
            </p>
          </li>
          <li className="p-4 bg-white rounded-2xl shadow-sm border hover:shadow-md transition">
            <p className="font-medium">Summaries of passages</p>
            <p className="text-gray-600">
              Get the essence of any reading without losing its meaning.
            </p>
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4 text-[#8B0000]">
          How to Get Started
        </h2>
        <p className="mb-6 text-gray-700 leading-relaxed">
          Getting started is simple. You can use Biblemind right away with no
          sign-up required. Or, sign in with your Google account for a more
          personalized experience. It is free, accessible, and available to you
          anytime.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-[#8B0000]">
          The Bigger Picture
        </h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          God gave us the gift of free will and the truth that sets us free. But
          to experience real transformation, we must not only know the Word, we
          must live it, own it, and walk with it. Biblemind is here to bridge
          that gap, helping you step into the victory and freedom already given
          to you through Christ.
        </p>

        <p className="text-lg font-medium text-[#8B0000]">
          BibleMind isn’t just about reading the Bible. It’s about experiencing
          the change, the clarity, and the peace you’ve been longing for.
        </p>
      </main>

      {/* FOOTER */}
      <footer className="p-4 text-center text-sm text-gray-600 border-t">
        © {new Date().getFullYear()} BibleMind. All rights reserved.
      </footer>
    </div>
  );
}
