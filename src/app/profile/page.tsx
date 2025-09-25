"use client";

import React, { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import biblemind from "@/public/biblemind.png";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = React.useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/signin");
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-700">
        Loading profile…
      </div>
    );
  }
  if (!session) return null;

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f5] text-gray-900">
      {/* NAVBAR (same style as Home) */}
      <nav className="relative z-20 flex items-center justify-between px-4 py-3 bg-[#8B0000] text-white shadow-md">
        <button onClick={() => setMenuOpen(true)} className="md:hidden z-30">
          <FaBars size={24} />
        </button>
        <div className="absolute left-1/2 transform -translate-x-1/2 text-xl md:text-2xl font-bold tracking-wide">
          biblemind
        </div>
        <div className="hidden md:flex gap-6 ml-auto">
          {["Devotions", "About", "Bookmark", "Contact"].map((label) => (
            <Link
              key={label}
              href={`/${label.toLowerCase()}`}
              className="hover:text-gray-300 transition"
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-10"
          onClick={() => setMenuOpen(false)}
        />
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
          {["Devotions", "About", "Bookmark", "Contact"].map((label) => (
            <Link
              key={label}
              href={`/${label.toLowerCase()}`}
              className="hover:text-gray-300"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* MAIN PROFILE CARD */}
      <main className="flex-grow flex ">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
          <div className="h-28 bg-gradient-to-r from-[#8B0000] to-red-700" />

          {/* Avatar */}
          <div className="-mt-16 flex justify-center">
            {session.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-gray-300 flex items-center justify-center text-4xl font-bold text-gray-700">
                {session.user?.name?.charAt(0) ?? "U"}
              </div>
            )}
          </div>

          <div className="p-6 text-center">
            <h1 className="text-2xl font-semibold text-gray-800">
              {session.user?.name}
            </h1>
            <p className="text-gray-500">{session.user?.email}</p>

            <button
              onClick={() => signOut({ callbackUrl: "/signin" })}
              className="mt-6 bg-[#8B0000] hover:bg-red-800 text-white py-2 px-6 rounded-lg font-medium transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </main>

      {/* FOOTER (matching Home) */}
      <footer className="bg-[#8B0000] text-white p-6 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:justify-between gap-4">
          <Link href="/">
            <Image
              src={biblemind}
              alt="BibleMind"
              className="h-20 w-auto cursor-pointer rounded"
            />
          </Link>
          <div className="flex gap-6 text-sm">
            <Link href="/bookmark" className="hover:underline">
              Bookmark
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
