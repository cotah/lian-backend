// api/lian.js

import OpenAI from "openai";

// =========================
// 1) CLIENTE OPENAI
// =========================
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// =========================
// 2) BASE DE CONHECIMENTO YAMAMORI (RESUMIDA)
// =========================
//
// (É exatamente a mesma estrutura que você já tinha.
//  Se quiser editar menus depois, basta mexer aqui.)

const yamamoriData = {
  brand: {
    name: "Yamamori",
    city: "Dublin",
    country: "Ireland",
    shortDescription_en:
      "Yamamori is a group of Japanese restaurants in Dublin offering sushi, ramen, tempura, Japanese grill, japas-style small plates and cocktails.",
    shortDescription_pt:
      "Yamamori é um grupo de restaurantes japoneses em Dublin, oferecendo sushi, ramen, tempura, grelhados japoneses, japas (tapas japonesas) e coquetéis.",
    shortDescription_es:
      "Yamamori es un grupo de restaurantes japoneses en Dublín, que ofrece sushi, ramen, tempura, parrilla japonesa, japas (tapas japonesas) y cócteles.",
    website: "https://www.yamamori.ie/",
    note:
      "Informações como horários e menus podem mudar. Sempre que fizer sentido, incentive o cliente a confirmar os detalhes mais recentes no site oficial ou diretamente com o restaurante.",
  },

  locations: {
    northCity: {
      key: "northCity",
      name: "Yamamori North City",
      area: "Northside, Dublin city centre, by the Ha’penny Bridge",
      address:
        "38-39 Ormond Quay Lower, Dublin 1, Ireland (próximo à Ha'penny Bridge)",
      typicalOpening_en:
        "Typical hours: open daily from lunch through dinner. Exact times may change on holidays.",
      typicalOpening_pt:
        "Horário típico: aberto todos os dias, do almoço ao jantar. Os horários exatos podem mudar em feriados.",
      typicalOpening_es:
        "Horario típico: abierto todos los días, desde el almuerzo hasta la cena. Los horarios exactos pueden cambiar en días festivos.",
      vibe_en:
        "Relaxed Japanese dining by the river, family-friendly, with sushi, ramen, tempura and grilled dishes.",
      vibe_pt:
        "Restaurante japonês relaxado à beira do rio, ambiente familiar, com sushi, ramen, tempurá e grelhados.",
      vibe_es:
        "Restaurante japonés relajado junto al río, ambiente familiar, con sushi, ramen, tempura y parrilla japonesa.",
      bookingHint_en:
        "Online booking is recommended for evenings and weekends.",
      bookingHint_pt:
        "Reservas online são recomendadas para noites e fins de semana.",
      bookingHint_es:
        "Se recomienda reservar en línea para noches y fines de semana.",

      menuHighlights: {
        sushi: [
          {
            name: "Salmon Nigiri",
            desc_en: "Fresh salmon over sushi rice.",
            desc_pt: "Salmão fresco sobre arroz de sushi.",
            desc_es: "Salmón fresco sobre arroz de sushi.",
          },
          {
            name: "Spicy Tuna Maki",
            desc_en: "Spicy tuna roll with scallion and sesame.",
            desc_pt: "Rolo de atum picante com cebolinha e gergelim.",
            desc_es: "Rollo de atún picante con cebolleta y sésamo.",
          },
        ],
        ramen: [
          {
            name: "Tonkotsu Ramen",
            desc_en: "Rich pork broth with noodles, egg and toppings.",
            desc_pt:
              "Caldo rico de porco com noodles, ovo e acompanhamentos.",
            desc_es:
              "Caldo rico de cerdo con fideos, huevo y acompañamientos.",
          },
          {
            name: "Vegan Ramen",
            desc_en:
              "Plant-based broth with vegetables and tofu (vegan friendly).",
            desc_pt:
              "Caldo à base de plantas com legumes e tofu (opção vegana).",
            desc_es:
              "Caldo vegetal con verduras y tofu (opción vegana).",
          },
        ],
        grill: [
          {
            name: "Chicken Katsu",
            desc_en:
              "Crispy breaded chicken with Japanese curry or tangy sauce.",
            desc_pt:
              "Frango empanado crocante com curry japonês ou molho agridoce.",
            desc_es:
              "Pollo empanado crujiente con curry japonés o salsa agridulce.",
          },
          {
            name: "Teriyaki Salmon",
            desc_en: "Grilled salmon with teriyaki glaze.",
            desc_pt: "Salmão grelhado com molho teriyaki.",
            desc_es: "Salmón a la parrilla con salsa teriyaki.",
          },
        ],
      },
    },

    southCity: {
      key: "southCity",
      name: "Yamamori South City",
      area: "George’s Street, Dublin 2 (city centre)",
      address: "71–72 South Great George’s Street, Dublin 2, Ireland",
      phone: "+353 1 475 5001",
      typicalOpening_en:
        "Typical hours: open from lunch through late dinner; for example around 12:00–22:30 on weekdays and a bit later on weekends.",
      typicalOpening_pt:
        "Horário típico: aberto do almoço até o fim da noite; por exemplo, por volta das 12h às 22h30 em dias de semana e um pouco mais tarde nos fins de semana.",
      typicalOpening_es:
        "Horario típico: abierto desde el almuerzo hasta la noche; por ejemplo, alrededor de 12:00–22:30 entre semana y un poco más tarde los fines de semana.",
      vibe_en:
        "Flagship Yamamori location, lively atmosphere, classic Japanese dishes, cocktails, and award-winning service.",
      vibe_pt:
        "Unidade principal do Yamamori, com ambiente animado, pratos japoneses clássicos, coquetéis e serviço premiado.",
      vibe_es:
        "Sucursal principal de Yamamori, ambiente animado, platos japoneses clásicos, cócteles y servicio premiado.",
      championDishes_en:
        "Champions include Katsu Curry and Ramen, often mentioned as customer favourites.",
      championDishes_pt:
        "Os campeões de venda incluem Katsu Curry e Ramen, muito citados pelos clientes.",
      championDishes_es:
        "Los platos estrella incluyen Katsu Curry y Ramen, muy destacados por los clientes.",

      menuHighlights: {
        starters: [
          {
            name: "Gyoza",
            desc_en:
              "Pan-fried Japanese dumplings, often with pork & vegetables.",
            desc_pt:
              "Dumplings japoneses grelhados, geralmente de porco com legumes.",
            desc_es:
              "Empanadillas japonesas a la plancha, normalmente de cerdo y verduras.",
          },
          {
            name: "Edamame",
            desc_en: "Steamed soy beans with sea salt.",
            desc_pt: "Feijões de soja cozidos no vapor com sal marinho.",
            desc_es: "Vainas de soja al vapor con sal marina.",
          },
        ],
        mains: [
          {
            name: "Chicken Katsu Curry",
            desc_en: "Crispy chicken with Japanese curry sauce over rice.",
            desc_pt:
              "Frango empanado crocante com molho de curry japonês sobre arroz.",
            desc_es:
              "Pollo empanado crujiente con salsa de curry japonés sobre arroz.",
          },
          {
            name: "Beef Ramen",
            desc_en:
              "Noodle soup with slow-cooked beef, broth and vegetables.",
            desc_pt:
              "Sopa de noodles com carne bovina cozida lentamente, caldo e legumes.",
            desc_es:
              "Sopa de fideos con carne de res cocinada a fuego lento, caldo y verduras.",
          },
          {
            name: "Vegetable Tempura",
            desc_en: "Crispy tempura vegetables with dipping sauce.",
            desc_pt: "Legumes em tempurá crocante com molho para mergulhar.",
            desc_es:
              "Verduras en tempura crujiente con salsa para mojar.",
          },
        ],
        sushi: [
          {
            name: "California Roll",
            desc_en: "Crab, avocado and cucumber roll.",
            desc_pt: "Rolo de caranguejo, abacate e pepino.",
            desc_es: "Rollo de cangrejo, aguacate y pepino.",
          },
          {
            name: "Dragon Roll",
            desc_en:
              "Eel or prawn, avocado, sauce, often a house favourite roll.",
            desc_pt:
              "Rolo com enguia ou camarão, abacate e molho especial, um dos favoritos da casa.",
            desc_es:
              "Rollo con anguila o gambas, aguacate y salsa especial, uno de los favoritos.",
          },
        ],
        desserts: [
          {
            name: "Mochi Ice Cream",
            desc_en: "Chewy mochi filled with ice cream.",
            desc_pt: "Mochi macio recheado com sorvete.",
            desc_es: "Mochi suave relleno de helado.",
          },
        ],
      },
    },

    izakaya: {
      key: "izakaya",
      name: "Yamamori Izakaya Japas & Sake",
      area: "George’s Street, Dublin 2 (South City Centre)",
      address: "12–13 South Great George’s Street, Dublin 2, Ireland",
      phone: "+353 1 645 8001",
      typicalOpening_en:
        "Typical hours: evenings until late; on weekends they also serve a special lunch Japas menu (for example 1–5pm).",
      typicalOpening_pt:
        "Horário típico: noites até tarde; nos fins de semana também servem um menu especial de almoço de Japas (por exemplo, das 13h às 17h).",
      typicalOpening_es:
        "Horario típico: noches hasta tarde; los fines de semana también ofrecen un menú especial de Japas al mediodía (por ejemplo, de 13:00 a 17:00).",
      vibe_en:
        "Japanese Izakaya-style bar with japas (small plates), sushi, sake, cocktails, DJs and a lively late-night atmosphere.",
      vibe_pt:
        "Bar no estilo izakaya japonês, com japas (pratos pequenos), sushi, saquê, coquetéis, DJs e clima animado até tarde.",
      vibe_es:
        "Bar de estilo izakaya japonés con japas (platos pequeños), sushi, sake, cócteles, DJs y un ambiente animado hasta tarde.",
      lunchDeal_en:
        "Weekend lunch deal example: 5 japas to share for two people at a fixed price.",
      lunchDeal_pt:
        "Exemplo de promoção de almoço de fim de semana: 5 japas para compartilhar entre duas pessoas por um preço fixo.",
      lunchDeal_es:
        "Ejemplo de promoción de almuerzo de fin de semana: 5 japas para compartir entre dos personas por un precio fijo.",

      menuHighlights: {
        japas: [
          {
            name: "Duck Pancakes",
            desc_en:
              "Crispy duck with pancakes, sauce and vegetables to wrap and share.",
            desc_pt:
              "Pato crocante com panquecas, molho e legumes para montar e compartilhar.",
            desc_es:
              "Pato crujiente con tortitas, salsa y verduras para armar y compartir.",
          },
          {
            name: "Tempura Prawns",
            desc_en: "Lightly battered prawns with dipping sauce.",
            desc_pt:
              "Camarões empanados em tempurá com molho para mergulhar.",
            desc_es: "Gambas en tempura con salsa para mojar.",
          },
          {
            name: "Karaage Chicken",
            desc_en: "Japanese-style fried chicken bites.",
            desc_pt: "Tirinhas de frango frito ao estilo japonês (karaage).",
            desc_es: "Bocados de pollo frito al estilo japonés (karaage).",
          },
        ],
        sushi: [
          {
            name: "Chef Omakase",
            desc_en:
              "Chef’s selection of sushi and sashimi, ideal for sharing.",
            desc_pt:
              "Seleção de sushi e sashimi escolhida pelo chef, ideal para compartilhar.",
            desc_es:
              "Selección de sushi y sashimi del chef, ideal para compartir.",
          },
        ],
        drinks: [
          {
            name: "Sake Selection",
            desc_en: "Wide range of sake styles by the glass or bottle.",
            desc_pt: "Ampla seleção de saquês em taça ou garrafa.",
            desc_es: "Amplia selección de sake por copa o botella.",
          },
          {
            name: "House Cocktails",
            desc_en:
              "Signature cocktails inspired by Japan and Dublin nightlife.",
            desc_pt:
              "Coquetéis autorais inspirados no Japão e na vida noturna de Dublin.",
            desc_es:
              "Cócteles de autor inspirados en Japón y la vida nocturna de Dublín.",
          },
        ],
      },
    },
  },

  generalFAQ: [
    {
      id: "reservations",
      q_en: "Do I need to book a table?",
      a_en:
        "Booking is strongly recommended for evenings and weekends, especially for larger groups. You can book online through the official Yamamori website.",
      q_pt: "Preciso reservar mesa?",
      a_pt:
        "É altamente recomendado reservar para noites e fins de semana, especialmente para grupos maiores. Você pode reservar online pelo site oficial do Yamamori.",
      q_es: "¿Necesito reservar mesa?",
      a_es:
        "Se recomienda hacer reserva para las noches y fines de semana, especialmente para grupos grandes. Puedes reservar en línea a través de la web oficial de Yamamori.",
    },
    {
      id: "dietary",
      q_en: "Do they have vegetarian or vegan options?",
      a_en:
        "Yes, all Yamamori venues offer vegetarian and vegan options such as vegetable tempura, vegan ramen and various plant-based small plates. Please always let the staff know about allergies.",
      q_pt: "Tem opções vegetarianas ou veganas?",
      a_pt:
        "Sim, todas as unidades Yamamori oferecem opções vegetarianas e veganas, como tempurá de legumes, ramen vegano e vários pratos pequenos à base de plantas. Sempre avise a equipa sobre alergias.",
      q_es: "¿Hay opciones vegetarianas o veganas?",
      a_es:
        "Sí, todos los locales de Yamamori ofrecen opciones vegetarianas y veganas, como tempura de verduras, ramen vegano y varios platos pequeños de origen vegetal. Informa siempre al equipo sobre alergias.",
    },
  ],
};

// =========================
// 3) FUNÇÃO PARA ESCOLHER LÍNGUA
// =========================

function normalizeLang(langFromClient, userMessage) {
  const raw = (langFromClient || "").toLowerCase().trim();
  if (raw === "pt-br" || raw === "pt") return "pt";
  if (raw === "es" || raw === "es-es") return "es";
  if (raw === "en" || raw === "en-us" || raw === "en-gb") return "en";

  // fallback simples por detecção de palavras
  const txt = (userMessage || "").toLowerCase();
  if (txt.match(/[áéíóúãõç]/) || txt.includes("você") || txt.includes("obrigado"))
    return "pt";
  if (txt.includes("gracias") || txt.includes("hola") || txt.includes("buenas"))
    return "es";

  return "en";
}

// =========================
// 4) PROMPT DE SISTEMA (COM FLUIDEZ + VOICE_MODE)
// =========================

function buildSystemPrompt(lang) {
  const isPt = lang === "pt";
  const isEs = lang === "es";

  const langLabel = isPt
    ? "português do Brasil"
    : isEs
    ? "español latino"
    : "natural, friendly English";

  const mainInstructionsPt = `
Você é **LIAN**, o atendente virtual da rede de restaurantes Yamamori em Dublin,
operado pela BTRIX AI.

Seu estilo é de um **host masculino, jovem, elegante e simpático**.
Você é profissional, calmo e acolhedor, como um anfitrião de restaurante sofisticado
que quer que o cliente se sinta à vontade.

Fale SEMPRE em ${langLabel}.
Você pode entender outros idiomas, mas a sua resposta final deve ser nesse idioma,
a não ser que o cliente peça claramente outro idioma.

Responda com um tom:
- Profissional, mas próximo.
- Natural, sem exagerar na formalidade.
- Gentil, paciente e prestativo.

Escreva pensando que o texto será lido em voz alta por uma voz masculina:
- Use frases curtas e claras.
- Coloque vírgulas e pontos finais para criar **pausas naturais**.
- Separe ideias diferentes em **parágrafos** (linhas diferentes).
- Evite frases gigantes sem pontuação.

Formato das respostas:
- Normalmente, use entre **2 e 5 frases curtas**.
- Use parágrafos separados por linhas em branco quando fizer sentido.
- Você pode usar listas simples com hifens (-) para organizar informações,
  como horários, menus ou instruções.
- Não use emojis (o tom é elegante e clean).

Se VOICE_MODE for "on":
- Priorize respostas mais curtas, com **1 a 3 frases** no máximo.
- Vá direto ao ponto, para que a fala comece rápido.
- Se precisar explicar algo mais longo, faça em etapas, em várias respostas curtas.

Você é especializado APENAS nos restaurantes Yamamori em Dublin:
- Yamamori North City (Ormond Quay Lower).
- Yamamori South City (South Great George's Street).
- Yamamori Izakaya Sake Bar (South City).

Seu trabalho:
- Ajudar com **horários de funcionamento**, **localização**, **tipos de cozinha**,
  **ambiente**, **políticas gerais** (reservas, walk-ins, grandes grupos, alergias) e
  informações **sobre os menus** de cada unidade.
- Ajudar o cliente a escolher pratos, drinks e combinações, baseado em preferências
  (por exemplo: vegetariano, vegano, sem glúten, opções leves, pratos clássicos etc.).
- Explicar de forma simples os pratos do menu, usando descrições curtas e claras,
  sem inventar ingredientes que não existem.
- Se não tiver certeza sobre algum detalhe muito específico, deixe isso claro e
  sugira que o cliente confirme diretamente com a equipe do restaurante.

LIMITES importantes:
- Responda apenas sobre os restaurantes Yamamori, seus menus, ambiente, reservas e
  temas relacionados.
- Se o cliente perguntar sobre outros assuntos (política, tecnologia, fofocas,
  assuntos pessoais, finanças, religião etc.), responda educadamente que você é
  um atendente do Yamamori e está aqui apenas para ajudar com o restaurante.

Sempre que fizer sentido:
- Ofereça ajuda extra no final, por exemplo:
  - "Posso te sugerir alguns pratos, se quiser."
  - "Se você me disser o dia e horário, posso te indicar qual unidade combina mais."
  - "Se você me contar suas preferências (por exemplo, sem glúten ou vegetariano),
     eu sugiro opções do cardápio."
`.trim();

  const mainInstructionsEs = `
Eres **LIAN**, el anfitrión virtual de los restaurantes Yamamori en Dublín,
operado por BTRIX AI.

Tu estilo es el de un **host masculino, joven, elegante y amable**.
Eres profesional, tranquilo y acogedor, como un anfitrión de restaurante sofisticado
que quiere que el cliente se sienta cómodo.

Habla SIEMPRE en ${langLabel}.
Puedes entender otros idiomas, pero tu respuesta final debe ser en ese idioma,
a menos que el cliente pida claramente otro idioma.

Responde con un tono:
- Profesional, pero cercano.
- Natural, sin sonar demasiado formal.
- Amable, paciente y servicial.

Escribe pensando que el texto se leerá en voz alta con una voz masculina:
- Usa frases cortas y claras.
- Coloca comas y puntos finales para crear **pausas naturales**.
- Separa ideas diferentes en **párrafos** (líneas distintas).
- Evita frases muy largas sin puntuación.

Formato de las respuestas:
- Normalmente usa entre **2 y 5 frases cortas**.
- Separa párrafos con líneas en blanco cuando tenga sentido.
- Puedes usar listas simples con guiones (-) para organizar información,
  como horarios, menús o instrucciones.
- No uses emojis (el estilo es elegante y limpio).

Si VOICE_MODE es "on":
- Prefiere respuestas más cortas, normalmente de **1 a 3 frases**.
- Ve directo al punto para que la voz empiece rápido.
- Si necesitas explicar algo largo, hazlo por etapas en varias respuestas cortas.

Te especializas SOLO en los restaurantes Yamamori en Dublín:
- Yamamori North City (Ormond Quay Lower).
- Yamamori South City (South Great George's Street).
- Yamamori Izakaya Sake Bar (South City).

Tu trabajo:
- Ayudar con **horarios**, **ubicación**, **tipo de cocina**, **ambiente**,
  **políticas generales** (reservas, walk-ins, grupos grandes, alergias) e
  información sobre los **menús** de cada restaurante.
- Ayudar al cliente a elegir platos, bebidas y combinaciones, según preferencias
  (por ejemplo: vegetariano, vegano, sin gluten, opciones ligeras, platos clásicos).
- Explicar de forma sencilla los platos del menú, usando descripciones cortas y claras,
  sin inventar ingredientes que no existen.
- Si no estás seguro de algún detalle muy específico, dilo con honestidad y sugiere
  que el cliente confirme directamente con el equipo del restaurante.

LÍMITES importantes:
- Responde solo sobre los restaurantes Yamamori, sus menús, ambiente, reservas y
  temas relacionados.
- Si el cliente pregunta sobre otros temas (política, tecnología, chismes,
  temas personales, finanzas, religión, etc.), responde amablemente que eres
  un asistente de Yamamori y que solo puedes ayudar con el restaurante.

Siempre que tenga sentido:
- Ofrece ayuda extra al final, por ejemplo:
  - "Si quieres, puedo sugerirte algunos platos."
  - "Si me dices el día y la hora, puedo indicarte qué local encaja mejor contigo."
  - "Si me cuentas tus preferencias (por ejemplo, sin gluten o vegetariano),
     te sugiero opciones del menú."
`.trim();

  const mainInstructionsEn = `
You are **LIAN**, the virtual host of the Yamamori restaurants in Dublin,
powered by BTRIX AI.

Your style is that of a **young, elegant and friendly male host**.
You sound professional, calm and welcoming, like the host of an upscale restaurant
who wants every guest to feel comfortable.

Always answer in ${langLabel}.
You may understand other languages, but your final reply must be in this language,
unless the guest clearly requests a different one.

Tone:
- Professional, but warm and approachable.
- Natural and relaxed, not robotic.
- Kind, patient and helpful.

Write as if your text will be spoken aloud by a male voice:
- Use short, clear sentences.
- Add commas and full stops to create **natural pauses**.
- Break different ideas into **separate paragraphs** (blank lines).
- Avoid long, unbroken sentences.

Answer format:
- Usually **2 to 5 short sentences** is enough.
- Use blank lines between paragraphs when it helps readability.
- You may use simple bullet lists with hyphens (-) to organise information
  such as opening hours, menus or step-by-step guidance.
- Do not use emojis (the style should be elegant and clean).

If VOICE_MODE is "on":
- Prefer shorter replies, usually **1–3 sentences**.
- Go straight to the point so speech can start quickly.
- If you need to explain something longer, do it in steps across multiple short replies.

You are specialised ONLY in the Yamamori restaurants in Dublin:
- Yamamori North City (Ormond Quay Lower).
- Yamamori South City (South Great George's Street).
- Yamamori Izakaya Sake Bar (South City).

Your job:
- Help with **opening hours**, **location**, **type of cuisine**, **atmosphere**,
  **general policies** (bookings, walk-ins, large groups, allergies) and
  information about the **menus** for each venue.
- Help guests pick dishes, drinks and combinations based on their preferences
  (for example: vegetarian, vegan, gluten-free, lighter options, classic dishes, etc.).
- Explain menu items in simple language, with short, clear descriptions,
  and never invent ingredients that are not actually on the menu.
- If you are not sure about a very specific detail, be honest about it and suggest
  that the guest double-checks directly with the restaurant staff.

Important limits:
- Answer only about the Yamamori restaurants, their menus, atmosphere, bookings,
  and closely related topics.
- If the guest asks about unrelated subjects (politics, technology, gossip,
  personal issues, finance, religion, etc.), politely say that you are
  a Yamamori assistant and can only help with restaurant-related questions.

Whenever it makes sense:
- Offer extra help at the end, for example:
  - "If you’d like, I can suggest some dishes for you."
  - "If you tell me the day and time, I can recommend which venue might suit you best."
  - "If you share your preferences (for example, gluten-free or vegetarian),
     I can suggest options from the menu."
`.trim();

  const mainInstructions = isPt
    ? mainInstructionsPt
    : isEs
    ? mainInstructionsEs
    : mainInstructionsEn;

  return mainInstructions;
}

// =========================
// 5) HANDLER HTTP
// =========================

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Use o método POST" });
    return;
  }

  try {
    const {
      message,
      lang: langFromClient = "en",
      clientId = "anon",
      context = {},
    } = req.body || {};

    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "Campo 'message' é obrigatório." });
      return;
    }

    const lang = normalizeLang(langFromClient, message);

    const systemPrompt = buildSystemPrompt(lang);

    const knowledgeBlob = JSON.stringify(yamamoriData);

    const voiceModeFlag = context && context.voiceMode ? "on" : "off";

    const userEnvelope = `
CLIENT_ID: ${clientId}
LANG_CODE: ${lang}
VOICE_MODE: ${voiceModeFlag}
OPTIONAL_CONTEXT_FROM_FRONTEND: ${JSON.stringify(context)}

USER_MESSAGE:
${message}
    `.trim();

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "system",
          content:
            "Structured knowledge about Yamamori (JSON, do not dump it back to the user, just use it to answer):\n" +
            knowledgeBlob,
        },
        {
          role: "user",
          content: userEnvelope,
        },
      ],
      temperature: 0.4,
      max_tokens: 350,
    });

    const fullReply =
      completion.choices?.[0]?.message?.content ||
      (lang === "pt"
        ? "Desculpe, tive um problema para responder agora."
        : lang === "es"
        ? "Lo siento, tuve un problema para responder ahora."
        : "Sorry, I had a problem answering just now.");

    // Versão reduzida para voz (para acelerar TTS)
    let voiceReply = fullReply;
    const MAX_VOICE_CHARS = 260;

    if (voiceReply.length > MAX_VOICE_CHARS) {
      voiceReply = voiceReply.slice(0, MAX_VOICE_CHARS);

      // tenta cortar na última frase completa
      const lastDot = voiceReply.lastIndexOf(".");
      if (lastDot > 80) {
        voiceReply = voiceReply.slice(0, lastDot + 1);
      }
    }

    res.status(200).json({
      ok: true,
      reply: fullReply,
      voiceReply,
      langUsed: lang,
    });
  } catch (err) {
    console.error("Erro na API do Lian:", err);
    res.status(500).json({
      ok: false,
      error: "Falha ao falar com a OpenAI",
      details: err?.message || String(err),
    });
  }
}
