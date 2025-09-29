// src/app/api/bible-ai/route.ts
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables.");
}

// Create the client
const ai = new GoogleGenAI({ apiKey });

export async function POST(req: Request) {
  try {
    const { messages, context } = (await req.json()) as {
      messages?: ChatMessage[];
      context?: string;
    };

    if (!Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request: a 'messages' array is required." },
        { status: 400 }
      );
    }

    const history = messages
      .map((m) => `${m.role === "user" ? "User" : "AI"}: ${m.content}`)
      .join("\n");

    const prompt = `
You are BibleMind AI. Your role is to explain daily Vatican scripture readings and the Pope's reflections in a friendly, conversational way.

Here are today's readings:
${context ?? "No context provided."}

Conversation so far:
${history}

Answer the last user question clearly and thoughtfully. Your personality is stoic and reasonable with facts. Please answer plainly and skip any compliments or emotional introductions.
`;

    // ✅ Direct call with the new SDK
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    // 'text' is a property (getter), not a function
    return NextResponse.json({ reply: response.text });
  } catch (err) {
    console.error("Gemini API error:", err);
    const message =
      err instanceof Error ? err.message : "Unexpected internal server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
