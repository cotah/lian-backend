// /api/lian.js

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // CORS
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

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { message, lang = "en", clientId } = req.body || {};

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        ok: false,
        error: "Missing OPENAI_API_KEY in environment",
      });
    }

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({
        ok: false,
        error: "Message is required",
      });
    }

    const userMessage = message.toLowerCase().trim();

    // ============================
// RESPOSTAS FIXAS (SCRIPT)
// ============================
const fixedResponses = {
  hi: "Hi! I'm Lian, your virtual assistant from Yamamori. How can I help you today?",
  hello: "Hi! I'm Lian, your virtual assistant from Yamamori. How can I help you today?",
  hey: "Hi! I'm Lian, your virtual assistant from Yamamori. How can I help you today?",
};


    if (fixedResponses[userMessage]) {
      return res.status(200).json({
        ok: true,
        reply: fixedResponses[userMessage],
        source: "script",
        intent: "greeting",
        language: "en",
        upsell_suggestion: null,
      });
    }

    // ============================
    // PROMPT (PERSONALIDADE LIAN)
    // ============================
    const systemPrompt = `
You are Lian, the virtual assistant of Yamamori, a Japanese restaurant.

You answer in the SAME LANGUAGE as the user:
- If user writes Portuguese -> reply in Brazilian Portuguese.
- If user writes Japanese -> reply in natural polite Japanese (ていねい語).
- Otherwise -> reply in English.

TONE & STYLE BY LANGUAGE:
- EN: friendly, professional, warm, concise.
- PT-BR: formal but welcoming, like a high-end restaurant concierge.
- JA: polite (ていねい語), friendly and easy to understand.

CONTEXT:
- Yamamori: Japanese restaurant.
- Topics you can handle: menu, dish recommendations, drinks, dietary restrictions, reservations, opening hours, location, takeaway/dine-in info, small talk.
- Never invent prices. If the user asks for specific prices, say you cannot give exact values and suggest checking the menu or contacting the restaurant directly.

OUTPUT RULES:
- Keep responses SHORT: maximum 3 short lines.
- Be clear and direct, avoid long paragraphs.
- If user request is ambiguous, ask one clear follow-up question.
- If user asks something outside restaurant scope, answer briefly and gently redirect.

INTENTS (intent field MUST be one of these):
- "greeting"
- "menu_info"
- "dish_recommendation"
- "drinks"
- "dietary"
- "opening_hours"
- "location"
- "reservation"
- "takeaway"
- "small_talk"
- "upsell"
- "other"

LANGUAGE FIELD:
- "en" for English
- "pt" for Brazilian Portuguese
- "ja" for Japanese

UPSELL:
- "upsell_suggestion" is:
  - a short suggestion that naturally complements what the user wants (starter, drink, dessert, upgrade),
  - or null when upsell would feel forced or repetitive.
- Never push upsell aggressively. It should sound like a friendly suggestion.
`;

    // ============================
    // JSON SCHEMA p/ Responses API
    // ============================
    const jsonSchema = {
      name: "lian_response_schema",
      strict: true,
      schema: {
        type: "object",
        properties: {
          reply: {
            type: "string",
            description:
              "Main reply text to show to the user, in the same language as the user.",
          },
          intent: {
            type: "string",
            enum: [
              "greeting",
              "menu_info",
              "dish_recommendation",
              "drinks",
              "dietary",
              "opening_hours",
              "location",
              "reservation",
              "takeaway",
              "small_talk",
              "upsell",
              "other",
            ],
          },
          language: {
            type: "string",
            enum: ["en", "pt", "ja"],
            description:
              "The language used in the reply: en = English, pt = Brazilian Portuguese, ja = Japanese.",
          },
          upsell_suggestion: {
            type: ["string", "null"],
            description:
              "Optional upsell suggestion related to the user's request, or null if no upsell is appropriate.",
          },
        },
        required: ["reply", "intent", "language"],
        additionalProperties: false,
      },
    };

    // ============================
    // CHAMADA OpenAI Responses API
    // ============================
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: message,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: jsonSchema,
      },
      max_output_tokens: 300,
      temperature: 0.7,
    });

    // Tenta pegar o JSON direto; se não der, tenta parsear texto
    let parsed;
    try {
      const content = response.output[0].content[0];
      if (content.type === "output_json") {
        parsed = content.json;
      } else if (content.type === "output_text") {
        parsed = JSON.parse(content.text);
      }
    } catch (err) {
      console.error("Error parsing Lian JSON output:", err);
    }

    // Fallback se por algum motivo não veio no formato esperado
    if (!parsed || !parsed.reply) {
      const fallbackText =
        "Sorry, I'm having trouble answering right now. Could you please try again?";
      return res.status(200).json({
        ok: true,
        reply: fallbackText,
        source: "ai-fallback",
        intent: "other",
        language: "en",
        upsell_suggestion: null,
      });
    }

    const { reply, intent, language, upsell_suggestion } = parsed;

    return res.status(200).json({
      ok: true,
      reply,
      source: "ai",
      intent,
      language,
      upsell_suggestion: upsell_suggestion ?? null,
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
