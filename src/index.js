export default {
  async fetch(request, env) {

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    let message = "";

    // ✅ If GET request
    if (request.method === "GET") {
      const url = new URL(request.url);
      message = url.searchParams.get("message") || "Hello";
    }

    // ✅ If POST request
    if (request.method === "POST") {
      const body = await request.json();
      message = body.message;
    }

    try {
      const apiKey = env.GEMINI_KEY;
      const model = env.GEMINI_MODEL || "gemini-1.5-flash";

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: message }]
              }
            ]
          })
        }
      );

      const data = await response.json();

      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response from Gemini";

      return new Response(JSON.stringify({ reply }), {
        headers: corsHeaders
      });

    } catch (err) {
      return new Response(JSON.stringify({
        reply: "Server error: " + err.message
      }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }
};
