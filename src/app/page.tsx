"use client";

import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f5] text-gray-900">
      {/* NAVBAR */}
      <nav className="relative z-20 flex items-center justify-between px-4 py-3 bg-[#8B0000] text-white shadow-md">
        {/* Hamburger Icon (mobile only) */}
        <button onClick={() => setMenuOpen(true)} className="md:hidden z-30">
          <FaBars size={24} />
        </button>

        {/* Centered Title */}
        <div className="absolute left-1/2 transform -translate-x-1/2 text-xl md:text-2xl font-bold tracking-wide">
          biblemind
        </div>

        {/* Desktop Menu */}
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

      {/* MOBILE MENU OVERLAY */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-10"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* MOBILE SIDE MENU */}
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

      {/* MAIN */}
      <main className="flex-grow flex items-center justify-center">
        <h1 className="text-4xl font-bold text-[#8B0000]">biblemind</h1>
      </main>

      {/* FOOTER */}
      <footer className="p-4 text-center text-sm text-gray-600">
        BibleMind. All rights reserved.
      </footer>
    </div>
  );
}
