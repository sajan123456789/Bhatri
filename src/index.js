export default {
  async fetch(request, env, ctx) {
    // Check if the request is a POST request
    if (request.method !== "POST") {
      return new Response("Send a POST request with your message", { status: 400 });
    }

    try {
      const { message } = await request.json();
      
      // Yahan hum dashboard wali key "GEMINI_API_KEY" use kar rahe hain
      const apiKey = env.GEMINI_KEY; 
      const model = env.GEMINI_MODEL || "gemini-1.5-flash";

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: message }] }],
          }),
        }
      );

      const data = await response.json();
      const aiResponse = data.candidates[0].content.parts[0].text;

      return new Response(JSON.stringify({ reply: aiResponse }), {
        headers: { "Content-Type": "application/json" },
      });

    } catch (error) {
      // Agar error aaye toh ye error message dikhayega
      return new Response(JSON.stringify({ error: "Server error: " + error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};
