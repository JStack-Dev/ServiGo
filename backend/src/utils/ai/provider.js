// ==============================
// 🤖 AI Provider – Strategy Pattern
// Soporta OpenAI ahora + futuro TensorFlow.js local
// ==============================

import OpenAI from "openai";

const USE_PROVIDER = (process.env.AI_PROVIDER || "openai").toLowerCase();
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

// ==============================
// 🚀 Construcción del cliente OpenAI
// ==============================
function buildOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // 🧩 Modo stub seguro si no hay API key
    return {
      async classifyIncident(input) {
        return {
          category: "General",
          confidence: 0.5,
          reasoning: "Sin API key: devolviendo clasificación por defecto.",
        };
      },
      async estimatePrice({ category = "General", urgency = "normal", complexity = "media" }) {
        return {
          min: 40,
          max: 80,
          currency: "EUR",
          reasoning: "Sin API key: rango estimado por defecto.",
        };
      },
    };
  }

  const client = new OpenAI({ apiKey });

  return {
    // ==============================
    // 🧠 Clasificación de incidencias
    // ==============================
    async classifyIncident(input) {
      const messages = [
        { role: "system", content: "Eres un asistente técnico que clasifica incidencias del hogar." },
        {
          role: "user",
          content:
            `Clasifica la incidencia en una de las categorías: ` +
            `["Fontanería","Electricidad","Cerrajería","Carpintería","Electrodomésticos","Pintura","Climatización","General"]. ` +
            `Devuélveme JSON con campos: category, confidence (0-1), reasoning breve.\n` +
            `Incidencia: ${input.text}`,
        },
      ];

      const resp = await client.chat.completions.create({
        model: OPENAI_MODEL,
        messages,
        temperature: 0.2,
        response_format: { type: "json_object" },
      });

      const raw = resp.choices?.[0]?.message?.content || "{}";
      let parsed = {};
      try {
        parsed = JSON.parse(raw);
      } catch {
        parsed = {};
      }

      return {
        category: parsed.category || "General",
        confidence: Number(parsed.confidence ?? 0.6),
        reasoning: parsed.reasoning || "Clasificación generada por IA.",
      };
    },

    // ==============================
    // 💰 Estimación de precios
    // ==============================
    async estimatePrice({ category = "General", urgency = "normal", complexity = "media" }) {
      const messages = [
        { role: "system", content: "Eres un experto en pricing de servicios del hogar en España." },
        {
          role: "user",
          content:
            `Dada la categoría "${category}", la urgencia "${urgency}" y la complejidad "${complexity}", ` +
            `devuélveme un JSON con min, max y reasoning (breve). Todo en EUR.`,
        },
      ];

      const resp = await client.chat.completions.create({
        model: OPENAI_MODEL,
        messages,
        temperature: 0.2,
        response_format: { type: "json_object" },
      });

      const raw = resp.choices?.[0]?.message?.content || "{}";
      let parsed = {};
      try {
        parsed = JSON.parse(raw);
      } catch {
        parsed = {};
      }

      const min = Number(parsed.min ?? 40);
      const max = Number(parsed.max ?? Math.max(60, min + 10));

      return {
        min,
        max,
        currency: "EUR",
        reasoning: parsed.reasoning || "Estimación basada en benchmark general.",
      };
    },
  };
}

// ==============================
// 🧩 Futuro: TensorFlow.js local (placeholder)
// ==============================
function buildLocalTF() {
  return {
    async classifyIncident(input) {
      return {
        category: "General",
        confidence: 0.55,
        reasoning: "TFJS stub; implementar modelo local.",
      };
    },
    async estimatePrice({ category = "General", urgency = "normal", complexity = "media" }) {
      return {
        min: 35,
        max: 85,
        currency: "EUR",
        reasoning: "Reglas locales; sin IA externa.",
      };
    },
  };
}

// ==============================
// 🧩 Selección del proveedor de IA
// ==============================
export function getAIClient() {
  if (USE_PROVIDER === "openai") return buildOpenAI();
  if (USE_PROVIDER === "local") return buildLocalTF();
  return buildOpenAI(); // Por defecto
}

// ==============================
// 🧠 analyzeWithAI (para análisis de logs y texto libre)
// ==============================
export async function analyzeWithAI(prompt) {
  const apiKey = process.env.OPENAI_API_KEY;

  // ⚠️ Fallback seguro si no hay API key
  if (!apiKey) {
    console.warn("⚠️ Sin API key. Devolviendo análisis simulado de seguridad.");
    return {
      health: "estable",
      mainIssues: ["Sin conexión IA"],
      recommendations: ["Configurar OPENAI_API_KEY"],
      confidence: 50,
    };
  }

  try {
    const openai = new OpenAI({ apiKey });
    const resp = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Eres un analista de seguridad que interpreta logs de servidores y detecta amenazas.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const raw = resp.choices?.[0]?.message?.content || "{}";
    let parsed = {};
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = {
        health: "inestable",
        mainIssues: ["No se pudo interpretar la respuesta del modelo"],
        recommendations: ["Revisar logs y seguridad de conexión."],
        confidence: 70,
      };
    }

    return parsed;
  } catch (error) {
    console.error("❌ Error en analyzeWithAI:", error.message);
    return {
      health: "error",
      mainIssues: [error.message],
      recommendations: ["Verificar conexión con el proveedor IA."],
      confidence: 0,
    };
  }
}
