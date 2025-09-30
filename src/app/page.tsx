"use client";

import { useEffect, useState, useRef } from "react";
import { FaBars, FaTimes, FaBroom, FaChevronUp, FaBible } from "react-icons/fa";
import { FaCross } from "react-icons/fa6";
import Link from "next/link";
import { toDDMMYYYY } from "@/src/app/utils/dd-mm-yyyy";
import AIbiblemind from "./component/AIbiblemind";

import { useSession } from "next-auth/react";

interface ReadingEntry {
  date?: string;
  ot?: string;
  gospel?: string;
  pope?: string;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [readings, setReadings] = useState<ReadingEntry>({
    ot: "Loading...",
    gospel: "Loading...",
    pope: "Loading...",
  });
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [highlightedText, setHighlightedText] = useState<string | null>(null);
  const [showAskButton, setShowAskButton] = useState(false);
  const [askPosition, setAskPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Floating Bible button state
  const [biblePos, setBiblePos] = useState({ bottom: 16, right: 16 });
  const draggingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });

  // Fetch today's date initially
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(toDDMMYYYY(today));
  }, []);

  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Fetch readings from API or cache
  useEffect(() => {
    const biblemind_Key = process.env.NEXT_PUBLIC_BIBLEMIND_API_KEY;
    if (!biblemind_Key) throw new Error("BIBLEMIND_API_KEY is not defined.");
    if (!selectedDate) return;

    const fetchReadings = async () => {
      setLoading(true);
      let cache: Record<string, ReadingEntry> = {};
      const cachedDataString = localStorage.getItem("biblemind-cache");
      if (cachedDataString) {
        try {
          cache = JSON.parse(cachedDataString);
        } catch {
          cache = {};
        }
      }

      if (cache[selectedDate]) {
        setReadings(cache[selectedDate]);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://biblemind-api-cw-gpycraft.onrender.com/daily-readings?date=${selectedDate}`,
          {
            method: "GET",
            headers: {
              "x-api-key": biblemind_Key,
              "Content-Type": "application/json",
            },
            cache: "force-cache",
          }
        );

        if (!response.ok)
          throw new Error(`API returned status ${response.status}`);
        const data = await response.json();

        if ("error" in data) {
          const errorData: ReadingEntry = {
            ot: `Error: ${data.error || "Unknown API error"}`,
            gospel: `Error: ${data.error || "Unknown API error"}`,
            pope: `Error: ${data.error || "Unknown API error"}`,
          };
          setReadings(errorData);
          cache[selectedDate] = errorData;
          localStorage.setItem("biblemind-cache", JSON.stringify(cache));
          setLoading(false);
          return;
        }

        const result: ReadingEntry = {
          ot: data.ot || "No Old Testament reading found.",
          gospel: data.gospel || "No Gospel reading found.",
          pope: data.pope || "No Pope reflection found.",
          date: data.date || selectedDate,
        };

        setReadings(result);
        cache[selectedDate] = result;
        localStorage.setItem("biblemind-cache", JSON.stringify(cache));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching readings:", error);
        const errorData: ReadingEntry = {
          ot: "Error loading Old Testament reading.",
          gospel: "Error loading Gospel reading.",
          pope: "Error loading Pope's reflection.",
        };
        setReadings(errorData);
        setLoading(false);
      }
    };

    fetchReadings();
  }, [selectedDate]);

  // Spinner
  const Spinner = () => (
    <div className="flex justify-center items-center h-10">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#000000]" />
    </div>
  );

  // Highlight handler
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim() !== "") {
      const text = selection.toString();
      setHighlightedText(text);

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setAskPosition({
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY - 30,
      });
      setShowAskButton(true);
    } else {
      setShowAskButton(false);
    }
  };

  // Drag handlers for Bible button
  const handleMouseDown = (e: React.MouseEvent) => {
    draggingRef.current = true;
    startPosRef.current = { x: e.clientX, y: e.clientY };
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!draggingRef.current) return;

    const dx = e.clientX - startPosRef.current.x;
    const dy = e.clientY - startPosRef.current.y;

    setBiblePos((prev) => ({
      bottom: Math.max(0, prev.bottom - dy),
      right: Math.max(0, prev.right - dx),
    }));

    startPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUpGlobal = () => {
    draggingRef.current = false;
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUpGlobal);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUpGlobal);
    };
  }, []);

  return (
    <div
      className="flex flex-col min-h-screen bg-[#f5f5f5] text-gray-900"
      onMouseUp={handleMouseUp}
    >
      {/* NAVBAR */}
      <nav className="relative z-20 flex items-center justify-between px-4 py-3 bg-[#8B0000] text-white shadow-md">
        <button onClick={() => setMenuOpen(true)} className="md:hidden z-30">
          <FaBars size={24} />
        </button>
        <div className="absolute left-1/2 transform -translate-x-1/2 text-xl md:text-2xl font-bold tracking-wide">
          Biblemind
        </div>
        <div className="hidden md:flex items-center gap-6 ml-auto">
          {["Devotions", "About", "Bookmark", "Contact", "Signin"].map(
            (label) => (
              <Link
                key={label}
                href={`/${label.toLowerCase()}`}
                className="hover:text-gray-300 transition"
              >
                {label}
              </Link>
            )
          )}
          {session && (
            <Link
              href="/profile"
              className="hover:text-gray-300 transition"
              title="Profile"
            >
              Profile
            </Link>
          )}
        </div>
      </nav>

      {/* MAIN SECTION */}
      <main className="flex-grow px-4 py-6 md:px-12 relative">
        {showAskButton && askPosition && (
          <div
            style={{ top: askPosition.y, left: askPosition.x }}
            className="absolute bg-[#8B0000] text-white px-3 py-1 rounded shadow-md z-50"
          >
            💬
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#8B0000]">
            Daily scripture reading
          </h1>
          <p className="text-md mt-2 text-gray-700">
            Daily Vatican Readings & Reflections
          </p>
        </div>

        {/* Calendar Picker */}
        <div className="flex justify-center mb-6">
          <div className="w-64 bg-white p-4 rounded shadow-md border border-gray-200">
            <label
              htmlFor="date-picker"
              className="block text-gray-700 font-semibold mb-2"
            >
              Date
            </label>
            <input
              id="date-picker"
              type="date"
              value={
                selectedDate ? selectedDate.split("-").reverse().join("-") : ""
              }
              onChange={(e) => setSelectedDate(toDDMMYYYY(e.target.value))}
              className="w-full border border-gray-300 rounded px-3 py-2 shadow focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="md:w-1/4">
            <section className="bg-white rounded shadow p-4">
              <h2 className="text-xl font-semibold text-[#8B0000] mb-4">
                Menu
              </h2>
              <nav className="flex flex-col gap-2">
                {["Reading", "Gospel", "Words of the Pope"].map((label, i) => (
                  <a
                    key={i}
                    href={`#${label.toLowerCase().replace(/\s/g, "")}`}
                    className="hover:underline text-gray-700"
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </section>
          </aside>

          <div className="flex flex-col gap-6 md:w-3/4">
            {["reading", "gospel", "words of the pope"].map((section) => (
              <section
                key={section}
                id={section}
                className="bg-white rounded shadow p-4 min-h-[140px]"
              >
                <h2 className="text-xl font-semibold text-[#8B0000] mb-2">
                  {section === "reading"
                    ? "Readings"
                    : section === "gospel"
                    ? "Gospel"
                    : "Words of the Pope"}
                </h2>
                {loading ? (
                  <Spinner />
                ) : (
                  <p className="whitespace-pre-line">
                    {section === "reading"
                      ? readings.ot
                      : section === "gospel"
                      ? readings.gospel
                      : readings.pope}
                  </p>
                )}
                {section === "gospel" && (
                  <AIbiblemind
                    contextText={`${readings.ot}\n\n${readings.gospel}\n\n${readings.pope}`}
                    highlight={highlightedText}
                  />
                )}
              </section>
            ))}
          </div>

          {/* Floating Bible Button on left */}
          <div
            className="fixed z-50 cursor-grab"
            style={{ bottom: biblePos.bottom, left: biblePos.right }} // use left instead of right
            onMouseDown={handleMouseDown}
          >
            <Link href="/devotions/bible">
              <div className="bg-[#8B0000] text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition">
                <FaBible size={28} />
              </div>
            </Link>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#8B0000] text-white p-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link href="/">
              <div className="h-10 w-10 rounded bg-white text-[#8B0000] flex items-center justify-center font-bold">
                BM
              </div>
            </Link>
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/bookmark" className="hover:underline">
              Bookmark
            </Link>
            <Link href="/signin" className="hover:underline">
              Signin
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
          </div>
        </div>
        <div className="text-center text-xs mt-4 opacity-80">
          © {new Date().getFullYear()} BibleMind. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
