// /api/lian-tts.js

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
    const { text, lang = "en" } = req.body || {};

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        ok: false,
        error: "Missing OPENAI_API_KEY in environment",
      });
    }

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return res.status(400).json({
        ok: false,
        error: "Text is required",
      });
    }

    // Escolhe uma voz baseando-se no idioma
    // (todas as vozes são multilíngues, isso é mais "estético" do que técnico)
    let voice = "nova"; // default
    if (lang === "pt") {
      voice = "alloy"; // fica bom pra PT-BR também
    } else if (lang === "ja") {
      voice = "verse"; // imaginando um tom um pouco diferente
    }

    // Chamada TTS moderna
    const ttsResponse = await client.audio.speech.withRAW().create({
      model: "gpt-4o-mini-tts", // modelo TTS atual
      voice,
      input: text,
      // formato padrão mp3
    });

    const buffer = Buffer.from(await ttsResponse.arrayBuffer());
    const base64Audio = buffer.toString("base64");

    return res.status(200).json({
      ok: true,
      audio: base64Audio,
      format: "mp3",
      lang,
    });
  } catch (error) {
    console.error("Error in /api/lian-tts:", error);

    return res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
}
