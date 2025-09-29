// src/app/api/bible-ai/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);

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

Answer the last user question clearly and thoughtfully.
`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    return NextResponse.json({ reply: result.response.text() });
  } catch (err) {
    console.error("Gemini API error:", err);
    const message =
      err instanceof Error ? err.message : "Unexpected internal server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
