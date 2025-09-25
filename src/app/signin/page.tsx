"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaUser, FaEnvelope, FaKey, FaGoogle } from "react-icons/fa";
import { signIn, useSession } from "next-auth/react";

type RegisterResponse = Record<string, unknown>;

export default function SignIn() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [result, setResult] = useState<RegisterResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect to profile if already signed in
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/profile");
    }
  }, [status, router]);

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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            apiKey: "LvOSXg63vQNP5ghmcJ-pAqEMaET1ZuyrtG02Wcj9",
            serviceName: "biblemind.onrender.com",
          }),
        }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: RegisterResponse = await res.json();
      setResult(data);

      // Redirect to profile after successful login
      router.push("/profile");
    } catch (err) {
      setError(
        err instanceof Error
          ? `Registration failed: ${err.message}`
          : "Registration failed. Unknown error."
      );
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

      {/* MAIN */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-md border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Sign In</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* LEFT – Name & Email login */}
            <form
              onSubmit={handleRegister}
              className="flex flex-col gap-4 justify-center"
            >
              <div className="relative">
                <FaUser className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Name"
                  className="pl-10 border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
              </div>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email"
                  className="pl-10 border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-[#8B0000] text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-800 transition disabled:opacity-50"
              >
                <FaKey />
                {loading ? "Logging in…" : "Login"}
              </button>
            </form>

            {/* RIGHT – Other sign-in methods */}
            <div className="flex flex-col justify-center gap-6">
              <button
                type="button"
                className="cursor-pointer flex items-center justify-center gap-2 w-full bg-[#8B0000] text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-800 transition"
                onClick={() => alert("Pauthtato login API call here")}
              >
                Pauthtato (Beta)
              </button>

              <div className="flex items-center">
                <hr className="flex-grow border-gray-300" />
                <span className="mx-3 text-gray-500 text-sm">OR</span>
                <hr className="flex-grow border-gray-300" />
              </div>

              <button
                onClick={() => signIn("google", { callbackUrl: "/profile" })}
                className="cursor-pointer flex items-center justify-center gap-2 w-full border border-gray-300 py-2 px-4 rounded-lg font-medium hover:bg-gray-100 transition"
              >
                <FaGoogle className="text-red-600" />
                Sign in with Google
              </button>
            </div>
          </div>

          {/* Error / Result */}
          {error && (
            <p className="mt-6 text-red-600 text-center text-sm">{error}</p>
          )}
          {result && (
            <div className="mt-6 text-xs break-all bg-gray-50 p-3 rounded border">
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
