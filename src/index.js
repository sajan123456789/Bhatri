export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': 'https://careersteps.in', // <-- apna actual frontend domain daalo
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(request.url);
    if (request.method !== 'POST' || url.pathname !== '/api/chat') {
      return new Response(JSON.stringify({ error: 'Endpoint not found. Use POST /api/chat' }), {
        status: 404,
        headers: corsHeaders
      });
    }

    try {
      if (!env.GEMINI_API_KEY) {
        return new Response(JSON.stringify({ error: 'GEMINI_API_KEY is missing in worker environment.' }), {
          status: 500,
          headers: corsHeaders
        });
      }

      let body;
      try {
        body = await request.json();
      } catch (e) {
        return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
          status: 400,
          headers: corsHeaders
        });
      }

      const messages = body.messages;

      // Basic validation — messages must be a proper array with valid content
      if (!Array.isArray(messages) || messages.length === 0 || messages.length > 50) {
        return new Response(JSON.stringify({ error: 'Invalid messages array' }), {
          status: 400,
          headers: corsHeaders
        });
      }

      const isValid = messages.every(msg =>
        msg && typeof msg.content === 'string' && msg.content.trim().length > 0 && msg.content.length <= 4000
      );

      if (!isValid) {
        return new Response(JSON.stringify({ error: 'Each message must have valid non-empty content (max 4000 chars)' }), {
          status: 400,
          headers: corsHeaders
        });
      }

      // Format messages for Gemini API
      const contents = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      const geminiPayload = {
        contents,
        systemInstruction: {
          parts: [{
            text: 'You are CareerSteps AI, an expert career counselor. Only answer questions related to careers, education, colleges, universities, entrance exams, jobs, skills, resumes, interviews, certifications and study guidance. Politely refuse unrelated questions.'
          }]
        }
      };

      const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`;

      const geminiResponse = await fetch(geminiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiPayload)
      });

      const data = await geminiResponse.json();

      if (!geminiResponse.ok) {
        console.error('Gemini API Error:', data.error?.message);
        return new Response(JSON.stringify({ error: 'AI service is currently unavailable. Please try again.' }), {
          status: geminiResponse.status,
          headers: corsHeaders
        });
      }

      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';

      return new Response(JSON.stringify({ reply }), {
        status: 200,
        headers: corsHeaders
      });

    } catch (err) {
      console.error('Server Error:', err.message);
      return new Response(JSON.stringify({ error: 'Something went wrong. Please try again later.' }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }
};
