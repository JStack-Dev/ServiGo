// ==============================
// 🤖 AI Provider – Strategy Pattern
// Soporta OpenAI + LocalAI (gratuito) + futuro TensorFlow.js local
// ==============================

import OpenAI from "openai";
import fetch from "node-fetch";

const USE_PROVIDER = (process.env.AI_PROVIDER || "openai").toLowerCase();
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const LOCAL_AI_URL = process.env.LOCAL_AI_URL || "http://localhost:8081/v1/chat/completions";

// ============================================================
// 🚀 Estrategia 1 – OpenAI (requiere API key)
// ============================================================
function buildOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // 🧩 Fallback seguro
    return {
      async classifyIncident() {
        return {
          category: "General",
          confidence: 0.5,
          reasoning: "Sin API key: clasificación simulada.",
        };
      },
      async estimatePrice() {
        return {
          min: 40,
          max: 80,
          currency: "EUR",
          reasoning: "Sin API key: estimación simulada.",
        };
      },
    };
  }

  const client = new OpenAI({ apiKey });

  return {
    async classifyIncident(input) {
      const messages = [
        { role: "system", content: "Eres un asistente técnico que clasifica incidencias del hogar." },
        {
          role: "user",
          content:
            `Clasifica la incidencia en una de las categorías: ` +
            `["Fontanería","Electricidad","Cerrajería","Carpintería","Electrodomésticos","Pintura","Climatización","General"]. ` +
            `Devuélveme JSON con fields: category, confidence (0-1), reasoning breve.\n` +
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

    async estimatePrice({ category = "General", urgency = "normal", complexity = "media" }) {
      const messages = [
        { role: "system", content: "Eres un experto en pricing de servicios del hogar en España." },
        {
          role: "user",
          content:
            `Dada la categoría "${category}", la urgencia "${urgency}" y la complejidad "${complexity}", ` +
            `devuélveme JSON con min, max y reasoning (breve) en EUR.`,
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

// ============================================================
// 🚀 Estrategia 2 – LocalAI (gratuito)
// ============================================================
function buildLocalAI() {
  async function requestLocalAI(prompt) {
    const response = await fetch(LOCAL_AI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // o el modelo local que hayas descargado
        messages: [
          {
            role: "system",
            content:
              "Eres un asistente experto en incidencias domésticas y precios de servicios del hogar en España.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 200,
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    return data?.choices?.[0]?.message?.content ?? "";
  }

  return {
    async classifyIncident({ text }) {
      const prompt =
        `Clasifica la siguiente incidencia en una sola categoría entre: ` +
        `Fontanería, Electricidad, Cerrajería, Carpintería, Pintura, Climatización, Jardinería, Limpieza o General. ` +
        `Devuelve JSON con: category, confidence, reasoning.\nIncidencia: ${text}`;

      const raw = await requestLocalAI(prompt);
      let parsed = {};
      try {
        parsed = JSON.parse(raw);
      } catch {
        parsed = { category: "General", confidence: 0.5, reasoning: "Respuesta no JSON." };
      }
      return parsed;
    },

    async estimatePrice({ category = "General", urgency = "normal", complexity = "media" }) {
      const prompt = `Estima el precio para un servicio de ${category} en España con urgencia ${urgency} y complejidad ${complexity}. Devuelve JSON con min, max, currency y reasoning.`;
      const raw = await requestLocalAI(prompt);
      let parsed = {};
      try {
        parsed = JSON.parse(raw);
      } catch {
        parsed = { min: 40, max: 80, currency: "EUR", reasoning: "Estimación genérica." };
      }
      return parsed;
    },
  };
}

// ============================================================
// 🚀 Estrategia 3 – TensorFlow.js (placeholder futuro)
// ============================================================
function buildLocalTF() {
  return {
    async classifyIncident() {
      return { category: "General", confidence: 0.55, reasoning: "TFJS stub local." };
    },
    async estimatePrice() {
      return { min: 35, max: 85, currency: "EUR", reasoning: "Estimación estática local." };
    },
  };
}

// ============================================================
// 🧩 Selección de proveedor dinámico
// ============================================================
export function getAIClient() {
  if (USE_PROVIDER === "localai") return buildLocalAI();
  if (USE_PROVIDER === "local") return buildLocalTF();
  return buildOpenAI();
}

// ============================================================
// 🧠 analyzeWithAI (análisis libre de logs / texto)
// ============================================================
export async function analyzeWithAI(prompt) {
  const ai = getAIClient();
  return ai.classifyIncident({ text: prompt });
}
