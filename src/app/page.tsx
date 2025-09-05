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
  const [loading, setLoading] = useState(false); // <-- new loading state

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const formattedDate = toDDMMYYYY(today);
    setSelectedDate(formattedDate);
  }, []);

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
      const cachedDataString = localStorage.getItem("biblemind-cache");
      let cache: Record<string, ReadingEntry> = {};
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
          `https://biblemind-api-cw-gpycraft.onrender.com/sheet-data?date=${selectedDate}`,
          {
            method: "GET", // explicitly specify method
            headers: {
              "x-api-key": biblemind_Key,
              "Content-Type": "application/json", // optional but good practice
            },
            cache: "force-cache",
          }
        );

        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }

        const data = await response.json();

        if ("error" in data) {
          const errorMsg = data.error || "Unknown API error";
          const errorData: ReadingEntry = {
            ot: `Error: ${errorMsg}`,
            gospel: `Error: ${errorMsg}`,
            pope: `Error: ${errorMsg}`,
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

  // Simple spinner component
  const Spinner = () => (
    <div className="flex justify-center items-center h-10">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#000000]"></div>
    </div>
  );

  const clearCache = () => {
    localStorage.removeItem("biblemind-cache");
    alert("Cache cleared! ");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f5] text-gray-900">
      {/* NAVBAR */}
      <nav className="relative z-20 flex items-center justify-between px-4 py-3 bg-[#8B0000] text-white shadow-md">
        <button onClick={() => setMenuOpen(true)} className="md:hidden z-30">
          <FaBars size={24} />
        </button>

        <div className="absolute left-1/2 transform -translate-x-1/2 text-xl md:text-2xl font-bold tracking-wide">
          biblemind
        </div>

        <div className="hidden md:flex gap-6 ml-auto">
          <Link href="#" className="hover:text-gray-300 transition">
            Home
          </Link>
          <Link href="/devotions" className="hover:text-gray-300 transition">
            Rosary
          </Link>
          <Link href="#" className="hover:text-gray-300 transition">
            About
          </Link>
          <Link href="/bookmark" className="hover:text-gray-300 transition">
            BookMarks
          </Link>
          <Link href="/contact" className="hover:text-gray-300 transition">
            Contact
          </Link>
        </div>
      </nav>

      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-10"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

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
          <Link
            href="#"
            onClick={() => setMenuOpen(false)}
            className="hover:text-gray-300"
          >
            Home
          </Link>
          <Link
            href="/devotions"
            onClick={() => setMenuOpen(false)}
            className="hover:text-gray-300"
          >
            Rosary
          </Link>
          <Link
            href="#"
            onClick={() => setMenuOpen(false)}
            className="hover:text-gray-300"
          >
            About
          </Link>
          <Link
            href="/bookmark"
            onClick={() => setMenuOpen(false)}
            className="hover:text-gray-300"
          >
            BookMarks
          </Link>
          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="hover:text-gray-300"
          >
            Contact
          </Link>
        </nav>
      </div>

      {/* MAIN SECTION */}
      <main className="flex-grow px-4 py-6 md:px-12">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#8B0000]">
            Daily scripture reading
          </h1>
          <p className="text-md mt-2 text-gray-700">
            Daily Vatican Readings & Reflections
          </p>
        </div>

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
                selectedDate
                  ? (() => {
                      const parts = selectedDate.split("-");
                      return parts.length === 3
                        ? `${parts[2]}-${parts[1]}-${parts[0]}`
                        : "";
                    })()
                  : ""
              }
              onChange={(e) => {
                const isoDate = e.target.value;
                if (isoDate) {
                  const formatted = toDDMMYYYY(isoDate);
                  setSelectedDate(formatted);
                } else {
                  setSelectedDate("");
                }
              }}
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
                <a href="#reading" className="hover:underline text-gray-700">
                  Reading
                </a>
                <a href="#gospel" className="hover:underline text-gray-700">
                  Gospel
                </a>
                <a href="#pope" className="hover:underline text-gray-700">
                  Words of Pope
                </a>
              </nav>
            </section>
          </aside>

          {/* Right Content */}
          <div className="flex flex-col gap-6 md:w-3/4">
            <section
              id="reading"
              className="bg-white rounded shadow p-4 min-h-[140px]"
            >
              <h2 className="text-xl font-semibold text-[#8B0000] mb-2">
                Readings
              </h2>
              {loading ? (
                <Spinner />
              ) : (
                <p className="whitespace-pre-line">{readings.ot}</p>
              )}
            </section>

            <section
              id="gospel"
              className="bg-white rounded shadow p-4 min-h-[140px]"
            >
              <h2 className="text-xl font-semibold text-[#8B0000] mb-2">
                Gospel
              </h2>
              <AIbiblemind
                contextText={`${readings.ot}\n\n${readings.gospel}\n\n${readings.pope}`}
              />
              {loading ? (
                <Spinner />
              ) : (
                <p className="whitespace-pre-line">{readings.gospel}</p>
              )}
            </section>

            <section
              id="pope"
              className="bg-white rounded shadow p-4 min-h-[140px]"
            >
              <h2 className="text-xl font-semibold text-[#8B0000] mb-2">
                Words of the Pope
              </h2>
              {loading ? (
                <Spinner />
              ) : (
                <p className="whitespace-pre-line">{readings.pope}</p>
              )}
            </section>
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
