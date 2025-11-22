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
    const { text, lang = "en" } = req.body;

    if (!text) {
      return res.status(400).json({ ok: false, error: "Text is required" });
    }

    // Chama OpenAI TTS API
    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova", // Voz feminina jovem, amigável, profissional
      input: text,
      // sem "speed" – velocidade padrão
    });

    // Converte resposta para buffer
    const buffer = Buffer.from(await response.arrayBuffer());

    // Converte para base64
    const base64Audio = buffer.toString("base64");

    return res.status(200).json({
      ok: true,
      audio: base64Audio,
    });
  } catch (error) {
    console.error("Error in /api/lian-tts:", error);
    return res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
}
