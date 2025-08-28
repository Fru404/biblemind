// src/pages/api/bible-ai.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyBZLkoTNnuJw93ZZVdeapQ4CEU9ULR9OvQ");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { messages, context } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Build a prompt that includes today’s readings
    const history = messages
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

    res.json({ reply: response });
  } catch (err: any) {
    console.error("Gemini API error:", err);
    res.status(500).json({ error: err.message });
  }
}
