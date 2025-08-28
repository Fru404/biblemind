// src/app/api/bible-ai/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyBZLkoTNnuJw93ZZVdeapQ4CEU9ULR9OvQ");

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const history = (messages || [])
      .map((m: any) => `${m.role === "user" ? "User" : "AI"}: ${m.content}`)
      .join("\n");

    const prompt = `
You are BibleMind AI. Your role is to explain daily Vatican scripture readings and Pope's reflections.

Here are today's readings:
${context}

Conversation so far:
${history}

Answer the last user question clearly and thoughtfully.
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return NextResponse.json({ reply: response });
  } catch (err: any) {
    console.error("Gemini API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
