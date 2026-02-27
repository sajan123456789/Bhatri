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

      const response = await ai.models.generateContent({
        model: env.GEMINI_MODEL,
        contents: message,
      });

      return new Response(
        JSON.stringify({
          reply: response.text,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );
    }
  },
};
