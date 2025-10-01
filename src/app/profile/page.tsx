"use client";

import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import biblemind from "@/public/biblemind.png";
import { FaBars, FaTimes, FaUser } from "react-icons/fa";

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/signin");
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-700">Loading profile…</p>
      </div>
    );
  }
  if (!session) return null;

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f5] text-gray-900">
      {/* NAVBAR */}
      <nav className="relative z-20 mt-6 flex items-center justify-between px-4 py-3 bg-[#8B0000] text-white shadow-md rounded-2xl transition-all duration-300 ease-in-out w-11/12 max-w-6xl mx-auto">
        <div className="flex items-center gap-4">
          {/* Burger button opens drawer */}

          <div className="text-xl md:text-2xl font-bold tracking-wide">
            <Link href="/">BibleMind</Link>
          </div>
        </div>

        {/* Avatar button on right also opens drawer */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2"
        >
          {session.user?.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || "User"}
              className="w-8 h-8 rounded-full object-cover border border-white"
            />
          ) : (
            <FaUser size={22} />
          )}
        </button>
      </nav>

      {/* Main placeholder page */}
      <main className="flex-grow flex flex-col p-6 ">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Account page
        </h1>
        <p className="text-gray-600">{session.user?.name}</p>
      </main>

      {/* Slide-in Profile Drawer */}
      {/* Overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20"
          onClick={() => setDrawerOpen(false)}
        />
      )}
      {/* Drawer panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-72 sm:w-80 bg-white shadow-2xl z-30 transform transition-transform duration-300 ease-in-out
        ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Profile</h2>
          <button onClick={() => setDrawerOpen(false)}>
            <FaTimes size={22} className="text-gray-700" />
          </button>
        </div>

        <div className="p-6 text-center">
          {session.user?.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || "User"}
              className="w-20 h-20 mx-auto rounded-full object-cover border-4 border-[#8B0000]"
            />
          ) : (
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-300 flex items-center justify-center text-3xl text-gray-700">
              <FaUser />
            </div>
          )}

          <h3 className="mt-4 text-xl font-semibold text-gray-800">
            {session.user?.name}
          </h3>
          <p className="text-gray-600 break-words">{session.user?.email}</p>

          <div className="mt-6 flex flex-col gap-4">
            <Link
              href="/bookmark"
              className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg transition"
              onClick={() => setDrawerOpen(false)}
            >
              My Bookmarks
            </Link>
            <Link
              href="/about"
              className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg transition"
              onClick={() => setDrawerOpen(false)}
            >
              About
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/signin" })}
              className="w-full bg-[#8B0000] hover:bg-red-800 text-white py-2 rounded-lg font-medium transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* FOOTER (same as Home) */}
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
