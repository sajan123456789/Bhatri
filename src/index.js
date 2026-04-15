export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    try {
      const { message } = await request.json();
      const API_KEY = env.GEMINI_API_KEY; 

      if (!API_KEY) {
        return new Response(JSON.stringify({ reply: "Vijay setup error: API Key missing." }), { headers: corsHeaders });
      }

      // Sahi API URL format
      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{ text: `Your name is Vijay, an expert career guide for careersteps.in. User asked: ${message}` }]
          }]
        })
      });

      const data = await response.json();
      
      // AI ke reply ko extract karna
      const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Vijay is thinking... Please try again.";

      return new Response(JSON.stringify({ reply: aiReply }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } catch (error) {
      return new Response(JSON.stringify({ reply: "Technical error in connection." }), { headers: corsHeaders });
    }
  },
};
