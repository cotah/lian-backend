// api/lian-tts.js

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Use o método POST" });
    return;
  }

  try {
    const { text, lang = "en" } = req.body || {};

    if (!text || typeof text !== "string") {
      res.status(400).json({ error: "Campo 'text' é obrigatório." });
      return;
    }

    // Escolhe uma voz mais masculina/natural.
    // Opções da OpenAI hoje: alloy, echo, fable, onyx, nova, shimmer. :contentReference[oaicite:0]{index=0}
    // Onyx e Echo soam mais masculinas.
    const voice = "onyx";

    const ttsResponse = await openai.audio.speech.create({
      model: "tts-1", // modelo de TTS da OpenAI :contentReference[oaicite:1]{index=1}
      voice,
      input: text,
      format: "mp3",
    });

    // Converte o resultado em base64 pra mandar pro front
    const buffer = Buffer.from(await ttsResponse.arrayBuffer());
    const base64Audio = buffer.toString("base64");

    res.status(200).json({
      ok: true,
      audio: base64Audio,
      format: "mp3",
      voice,
      lang,
    });
  } catch (err) {
    console.error("Erro no TTS do Lian:", err);
    res.status(500).json({
      ok: false,
      error: "Falha ao gerar áudio com a OpenAI",
      details: err?.message || String(err),
    });
  }
}
