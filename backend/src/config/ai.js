// ==============================
// 🤖 Configuración de IA local (LocalAI / OpenAI compatible)
// ==============================
import fetch from "node-fetch";

// URL base del servidor de IA (LocalAI corre en tu máquina o servidor)
const LOCAL_AI_URL = process.env.LOCAL_AI_URL || "http://localhost:8080/v1/chat/completions";

// Función genérica para pedir clasificación de texto
export async function classifyText(prompt) {
  try {
    const response = await fetch(LOCAL_AI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // puedes usar tu modelo local aquí
        messages: [
          {
            role: "system",
            content:
              "Eres un asistente experto en clasificar incidencias domésticas en categorías profesionales: fontanero, electricista, cerrajero, pintor, albañil, carpintero, jardinero, limpieza o climatización.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 50,
      }),
    });

    const data = await response.json();
    const category = data?.choices?.[0]?.message?.content?.trim();

    return category || "otros";
  } catch (error) {
    console.error("❌ Error al conectar con LocalAI:", error);
    return "otros";
  }
}
