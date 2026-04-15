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
      
      // Direct env variable use karna
      const API_KEY = env.GEMINI_API_KEY; 

      if (!API_KEY) {
        return new Response(JSON.stringify({ reply: "Vijay setup error: API Key missing in Cloudflare." }), { 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        });
      }

      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{ text: `Your name is Vijay, a helpful career guide. Answer this: ${message}` }]
          }]
        })
      });

      const data = await response.json();
      const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I am thinking... try again.";

      return new Response(JSON.stringify({ reply: aiReply }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } catch (error) {
      return new Response(JSON.stringify({ reply: "Technical error. Please try again." }), { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }
  },
};
