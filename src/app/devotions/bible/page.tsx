"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import AIbiblemind from "../../component/AIbiblemind";
import { useRouter } from "next/navigation";

const API_KEY = process.env.NEXT_PUBLIC_BIBLE_API_KEY;
if (!API_KEY) {
  throw new Error("BIBLE_API_KEY is not defined in environment variables.");
}
const BASE_URL = "https://api.scripture.api.bible/v1";

// Reusable headers
const headers: HeadersInit = {
  "api-key": API_KEY as string,
};

// Types
interface Book {
  id: string;
  name: string;
  abbreviation: string;
}

interface Chapter {
  id: string;
  reference: string;
}

interface Verse {
  id: string;
  reference: string;
  text: string;
}

export default function BibleReaderPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [selectedBook, setSelectedBook] = useState<string>("");
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [selectedVerse, setSelectedVerse] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const verseRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Example translation: World English Bible
  const bibleId = "179568874c45066f-01";

  // Fetch all books
  useEffect(() => {
    async function fetchBooks() {
      const res = await fetch(`${BASE_URL}/bibles/${bibleId}/books`, {
        headers,
      });
      const data = await res.json();
      setBooks(data.data || []);
    }
    fetchBooks();
  }, []);

  // Fetch chapters of a selected book
  useEffect(() => {
    if (!selectedBook) return;
    async function fetchChapters() {
      const res = await fetch(
        `${BASE_URL}/bibles/${bibleId}/books/${selectedBook}/chapters`,
        { headers }
      );
      const data = await res.json();
      setChapters(data.data || []);
      setSelectedChapter("");
      setVerses([]);
    }
    fetchChapters();
  }, [selectedBook]);

  // Fetch verses of a selected chapter
  useEffect(() => {
    if (!selectedChapter) return;
    async function fetchVerses() {
      setLoading(true);
      const res = await fetch(
        `${BASE_URL}/bibles/${bibleId}/chapters/${selectedChapter}/verses`,
        { headers }
      );
      const data = await res.json();

      const versesData: Verse[] = [];
      for (const v of data.data || []) {
        const verseRes = await fetch(
          `${BASE_URL}/bibles/${bibleId}/verses/${v.id}`,
          { headers }
        );
        const verseData = await verseRes.json();
        versesData.push({
          id: verseData.data.id,
          reference: verseData.data.reference,
          text: verseData.data.content
            .replace(/<[^>]*>?/gm, "") // strip HTML tags
            .trim(),
        });
      }
      setVerses(versesData);
      setSelectedVerse("");
      setLoading(false);
    }
    fetchVerses();
  }, [selectedChapter]);

  // Scroll to verse when selected
  useEffect(() => {
    if (selectedVerse && verseRefs.current[selectedVerse]) {
      verseRefs.current[selectedVerse]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedVerse]);

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-gray-900 flex flex-col">
      {/* Navbar */}
      <nav className="relative z-20 mt-6 flex items-center justify-between px-4 py-3 bg-[#8B0000] text-white shadow-md rounded-2xl transition-all duration-300 ease-in-out w-11/12 max-w-6xl mx-auto">
        <h1 className="text-xl font-bold">Bible</h1>
        <button onClick={() => router.back()} className="hover:underline">
          ← Back
        </button>
      </nav>

      <main className="flex-grow px-4 py-6 md:px-12">
        {/* Dropdown selectors */}
        <section className="bg-white rounded shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-[#8B0000] mb-4">
            Select Reading
          </h2>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Book Selector */}
            <select
              value={selectedBook}
              onChange={(e) => setSelectedBook(e.target.value)}
              className="border rounded p-2"
            >
              <option value="">-- Select Book --</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.name}
                </option>
              ))}
            </select>

            {/* Chapter Selector */}
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              disabled={!chapters.length}
              className="border rounded p-2"
            >
              <option value="">-- Select Chapter --</option>
              {chapters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.reference}
                </option>
              ))}
            </select>

            {/* Verse Selector */}
            <select
              value={selectedVerse}
              onChange={(e) => setSelectedVerse(e.target.value)}
              disabled={!verses.length}
              className="border rounded p-2"
            >
              <option value="">-- Select Verse --</option>
              {verses.map((v, i) => (
                <option key={v.id} value={v.id}>
                  Verse {i + 1}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Loader */}
        {loading && (
          <div className="flex justify-center py-6">
            <div className="w-10 h-10 border-4 border-[#8B0000] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Passage Display */}
        {!loading && verses.length > 0 && (
          <section className="bg-white rounded shadow-md p-6">
            <h2 className="text-2xl font-semibold text-[#8B0000] mb-4">
              {verses[0].reference.split(":")[0]}
            </h2>
            <div className="space-y-4">
              {verses.map((verse, i) => (
                <div
                  key={verse.id}
                  ref={(el) => {
                    verseRefs.current[verse.id] = el;
                  }}
                  className={`p-2 rounded ${
                    selectedVerse === verse.id
                      ? "bg-yellow-100 border-l-4 border-[#8B0000]"
                      : "bg-gray-50"
                  }`}
                >
                  <span className="font-bold text-[#8B0000] mr-2">{i + 1}</span>
                  <span className="text-gray-800">{verse.text}</span>
                </div>
              ))}
            </div>

            {/* AIbiblemind component with Book, Chapter, Verses */}
            <div className="mt-8 border-t pt-6">
              <AIbiblemind
                contextText={
                  `Book: ${
                    books.find((b) => b.id === selectedBook)?.name ||
                    "Unknown Book"
                  }\n` +
                  `Chapter: ${
                    chapters.find((c) => c.id === selectedChapter)?.reference ||
                    "Unknown Chapter"
                  }\n\n` +
                  verses.map((v, i) => `${i + 1}. ${v.text}`).join("\n")
                }
                highlight={
                  selectedVerse
                    ? verses.find((v) => v.id === selectedVerse)?.text ?? ""
                    : ""
                }
              />
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-sm text-gray-600 bg-white border-t">
        BibleMind. All rights reserved.
      </footer>
    </div>
  );
}
