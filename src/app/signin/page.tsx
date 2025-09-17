"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function SignIn() {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(
        "https://pauthtato-client-c2c.onrender.com/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            apiKey: "LvOSXg63vQNP5ghmcJ-pAqEMaET1ZuyrtG02Wcj9", // safe to expose public key
            serviceName: "biblemind.com", // or dynamically detect your site
          }),
        }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError("Registration failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f5] text-gray-900">
      {/* NAVBAR */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-4 bg-[#8B0000] text-white shadow-md">
        <Link href="/" className="hover:underline">
          ← Back To Home
        </Link>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#8B0000] text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-800 transition disabled:opacity-50"
            >
              {loading ? "Creating…" : "Pauthtato"}
            </button>
          </form>

          {error && <p className="mt-4 text-red-600 text-center">{error}</p>}

          {result && (
            <div className="mt-6 text-sm break-all bg-gray-50 p-4 rounded">
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
        </div>
      </main>

      <footer className="p-4 text-center text-sm text-gray-600 border-t">
        BibleMind. All rights reserved.
      </footer>
    </div>
  );
}
