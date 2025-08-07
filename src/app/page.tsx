"use client";

import { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Start with empty string to avoid hydration mismatch
  const [selectedDate, setSelectedDate] = useState("");

  const [readings, setReadings] = useState({
    ot: "Loading...",
    gospel: "Loading...",
    pope: "Loading...",
  });

  // Set the current date only on client after mount
  useEffect(() => {
    setSelectedDate(new Date().toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    if (!selectedDate) return; // don't fetch if date is not set yet

    const fetchReadings = async () => {
      try {
        const response = await fetch(
          `https://biblemind-api-cw-gpycraft.onrender.com/sheet-data`
        );

        const textData = await response.text();
        let data = JSON.parse(textData);
        if (typeof data === "string") {
          data = JSON.parse(data);
        }

        if (!Array.isArray(data)) {
          console.error("Expected array but got:", data);
          setReadings({
            ot: "Data format error.",
            gospel: "Data format error.",
            pope: "Data format error.",
          });
          return;
        }

        const matched = data.find((entry: any) => {
          const entryDate = entry.date?.split("/").reverse().join("-");
          return entryDate === selectedDate;
        });

        if (matched) {
          setReadings({
            ot: matched.ot || "No Old Testament reading found.",
            gospel: matched.gospel || "No Gospel reading found.",
            pope: matched.pope || "No Pope's reflection found.",
          });
        } else {
          setReadings({
            ot: "No Old Testament reading available for this date.",
            gospel: "No Gospel reading available for this date.",
            pope: "No Pope's reflection available for this date.",
          });
        }
      } catch (error) {
        console.error("Error fetching readings:", error);
        setReadings({
          ot: "Error loading Old Testament reading.",
          gospel: "Error loading Gospel reading.",
          pope: "Error loading Pope's reflection.",
        });
      }
    };
    fetchReadings();
  }, [selectedDate]);

  // ... rest of your component unchanged
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
          <a href="#" className="hover:text-gray-300 transition">
            Home
          </a>
          <a href="#" className="hover:text-gray-300 transition">
            Devotions
          </a>
          <a href="#" className="hover:text-gray-300 transition">
            About
          </a>
          <a href="#" className="hover:text-gray-300 transition">
            Contact
          </a>
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
          <a
            href="#"
            onClick={() => setMenuOpen(false)}
            className="hover:text-gray-300"
          >
            Home
          </a>
          <a
            href="#"
            onClick={() => setMenuOpen(false)}
            className="hover:text-gray-300"
          >
            Devotions
          </a>
          <a
            href="#"
            onClick={() => setMenuOpen(false)}
            className="hover:text-gray-300"
          >
            About
          </a>
          <a
            href="#"
            onClick={() => setMenuOpen(false)}
            className="hover:text-gray-300"
          >
            Contact
          </a>
        </nav>
      </div>

      {/* MAIN SECTION */}
      <main className="flex-grow px-4 py-6 md:px-12">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-[#8B0000]">BibleMind</h1>
          <p className="text-md mt-2 text-gray-700">
            Daily Vatican Readings & Reflections
          </p>
        </div>

        {/* Calendar Picker */}
        <div className="flex justify-center mb-6">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 shadow"
          />
        </div>

        {/* Readings Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <section className="bg-white rounded shadow p-4">
            <h2 className="text-xl font-semibold text-[#8B0000] mb-2">
              Old Testament
            </h2>
            <p className="whitespace-pre-line">{readings.ot}</p>
          </section>

          <section className="bg-white rounded shadow p-4">
            <h2 className="text-xl font-semibold text-[#8B0000] mb-2">
              Gospel
            </h2>
            <p className="whitespace-pre-line">{readings.gospel}</p>
          </section>

          <section className="bg-white rounded shadow p-4">
            <h2 className="text-xl font-semibold text-[#8B0000] mb-2">
              Pope's Words
            </h2>
            <p className="whitespace-pre-line">{readings.pope}</p>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="p-4 text-center text-sm text-gray-600">
        BibleMind. All rights reserved.
      </footer>
    </div>
  );
}
