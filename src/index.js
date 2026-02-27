import { GoogleGenAI } from "@google/genai";

export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Only POST allowed", { status: 405 });
    }

    try {
      const { message } = await request.json();

      const ai = new GoogleGenAI({
        apiKey: env.GEMINI_API_KEY,
      });

      const result = await ai.models.generateContent({
        model: env.GEMINI_MODEL,
        contents: message,
      });

      const reply =
        result?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response from AI";

      return new Response(
        JSON.stringify({ reply }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ reply: "Server error" }),
        { status: 500 }
      );
    }
  },
};
