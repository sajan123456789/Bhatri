export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    // Agar koi browser mein URL khole toh ye dikhega
    if (request.method === "GET") {
      return new Response(JSON.stringify({ status: "Vijay is online", message: "Ready for CareerSteps.in" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    try {
      const { message } = await request.json();
      const API_KEY = env.GEMINI_API_KEY; 

      if (!API_KEY) {
        return new Response(JSON.stringify({ reply: "hello,I am vijay: How can I help you?" }), {
          headers: corsHeaders,
        });
      }

      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Your name is Vijay, a career guide for CareerSteps.in. Answer: ${message}` }] }]
        })
      });

      const data = await response.json();
      const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Vijay is thinking...";

      return new Response(JSON.stringify({ reply: aiReply }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } catch (error) {
      return new Response(JSON.stringify({ reply: "Technical error in Worker." }), { headers: corsHeaders });
    }
  },
};
