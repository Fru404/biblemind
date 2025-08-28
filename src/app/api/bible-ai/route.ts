// src/app/api/bible-ai/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const history = (messages as ChatMessage[])
      .map((m) => `${m.role === "user" ? "User" : "AI"}: ${m.content}`)
      .join("\n");

    const prompt = `
You are BibleMind AI. Your role is to explain daily Vatican scripture readings and Pope's reflections. Be empathetic to their sin and relate what happens in their life and what is in scriptures

Here are today's readings:
${context}

Conversation so far:
${history}

Answer the last user question clearly and thoughtfully.
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return NextResponse.json({ reply: response });
  } catch (err: unknown) {
    console.error("Gemini API error:", err);

    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }

    // fallback for unknown error types
    return NextResponse.json({ error: "Unknown error occurred" }, { status: 500 });
  }
}
