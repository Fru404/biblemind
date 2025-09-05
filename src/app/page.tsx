"use client";
import { useEffect, useState } from "react";
import { FaBars, FaTimes, FaBroom } from "react-icons/fa";
import Link from "next/link";
import { toDDMMYYYY } from "@/src/app/utils/dd-mm-yyyy";
import AIbiblemind from "./component/AIbiblemind";

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
  const [loading, setLoading] = useState(false);
  const [highlightedText, setHighlightedText] = useState<string | null>(null);
  const [showAskButton, setShowAskButton] = useState(false);
  const [askPosition, setAskPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Fetch today's date initially
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(toDDMMYYYY(today));
  }, []);

  // Fetch readings from API or cache
  useEffect(() => {
    const biblemind_Key = process.env.NEXT_PUBLIC_BIBLEMIND_API_KEY;
    if (!biblemind_Key) {
      throw new Error(
        "BIBLEMIND_API_KEY is not defined in your environment variables."
      );
    }
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

  // Spinner component
  const Spinner = () => (
    <div className="flex justify-center items-center h-10">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#000000]" />
    </div>
  );

  // Clear cache
  const clearCache = () => {
    localStorage.removeItem("biblemind-cache");
    alert("Cache cleared!");
  };

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
          biblemind
        </div>
        <div className="hidden md:flex gap-6 ml-auto">
          {["Home", "Devotions", "About", "Bookmark", "Contact"].map(
            (label, i) => (
              <Link
                key={i}
                href={`/${label.toLowerCase()}`}
                className="hover:text-gray-300 transition"
              >
                {label}
              </Link>
            )
          )}
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-10"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#8B0000] text-white z-20 transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={() => setMenuOpen(false)} className="text-white">
            <FaTimes size={22} />
          </button>
        </div>
        <nav className="flex flex-col gap-4 px-6 py-2 text-lg">
          {["Home", "devotions", "About", "Bookmark", "Contact"].map(
            (label, i) => (
              <Link
                key={i}
                href={`/${label.toLowerCase()}`}
                className="hover:text-gray-300"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            )
          )}
        </nav>
      </div>

      {/* MAIN SECTION */}
      <main className="flex-grow px-4 py-6 md:px-12 relative">
        {/* Ask AI button */}
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

        {/* Clear cache button */}
        <div className="mb-4">
          <button
            onClick={clearCache}
            title="Clear Cache"
            className="flex items-center gap-2 text-[#8B0000]"
          >
            <FaBroom size={20} /> Clear cache in case of an error
          </button>
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

        {/* Layout: Menu left + Content right */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Menu */}
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

          {/* Right Content */}
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
        </div>
      </main>

      {/* FOOTER */}
      <footer className="p-4 text-center text-sm text-gray-600">
        BibleMind. All rights reserved.
      </footer>
    </div>
  );
}
