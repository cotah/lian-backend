import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { message, lang = "en", clientId } = req.body;

    if (!message) {
      return res.status(400).json({ ok: false, error: "Message is required" });
    }

    // ========================================
    // RESPOSTAS FIXAS (SCRIPT)
    // ========================================
    const userMessage = message.toLowerCase().trim();

    const fixedResponses = {
      // PRIMEIRA RESPOSTA (GREETING)
      hi: "Hi! I'm Lian, your virtual assistant from Yamamori. How can I help you today? Would you like menu suggestions, reservations, or our opening hours?",

      hello:
        "Hi! I'm Lian, your virtual assistant from Yamamori. How can I help you today? Would you like menu suggestions, reservations, or our opening hours?",

      hey: "Hi! I'm Lian, your virtual assistant from Yamamori. How can I help you today? Would you like menu suggestions, reservations, or our opening hours?",

      // aqui você pode adicionar mais respostas fixas depois
      // "menu": "...",
      // "reservation": "...",
    };

    // Verifica se existe resposta fixa
    if (fixedResponses[userMessage]) {
      return res.status(200).json({
        ok: true,
        reply: fixedResponses[userMessage],
        source: "script", // Indica que veio do script
      });
    }

    // ========================================
    // AI PARA PERGUNTAS COMPLEXAS
    // ========================================
    const systemPrompt = `You are Lian, a virtual assistant for Yamamori restaurant.

PERSONALITY:
- Friendly, professional, and helpful
- Young female voice (25-27 years old)
- Warm and welcoming tone

GUIDELINES:
- Keep responses SHORT and DIRECT (maximum 3 lines)
- Focus on: menu, reservations, hours, location
- Be conversational and natural
- If unsure, politely ask for clarification

RESTAURANT INFO:
- Name: Yamamori
- Type: Japanese restaurant
- Services: Dine-in, reservations, takeout

IMPORTANT: Keep responses concise and friendly!`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    const reply = completion.choices[0].message.content;

    return res.status(200).json({
      ok: true,
      reply: reply,
      source: "ai", // Indica que veio da AI
    });
  } catch (error) {
    console.error("Error in /api/lian:", error);
    return res.status(500).json({
      ok: false,
      error: "Internal server error",
      reply:
        "Sorry, I'm having trouble right now. Please try again in a moment.",
    });
  }
}
