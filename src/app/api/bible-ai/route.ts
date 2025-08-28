// src/app/api/bible-ai/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const apiKey = process.env.GEMINI_API_KEY; 
if (!apiKey) { throw new Error("GEMINI_API_KEY is not defined in your environment variables."); } 
const genAI = new GoogleGenerativeAI(apiKey);
export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request: messages array is required." },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const history = (messages as ChatMessage[])
      .map((m) => `${m.role === "user" ? "User" : "AI"}: ${m.content}`)
      .join("\n");

    const prompt = `
You are BibleMind AI. Your role is to explain daily Vatican scripture readings and Pope's reflections. Provide response like a normal person will do

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

    // Safely handle unknown
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
