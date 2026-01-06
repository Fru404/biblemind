// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextRequest } from "next/server";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};

// Wrap NextAuth for App Router route handlers
export async function GET(req: NextRequest) {
  return await NextAuth(authOptions);
}

export async function POST(req: NextRequest) {
  return await NextAuth(authOptions);
}
