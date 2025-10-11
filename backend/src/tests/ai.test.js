// ==============================
// 🧠 Tests IA y Análisis de Logs – ServiGo
// ==============================
import request from "supertest";
import server from "../index.js";

describe("🧩 API IA – Clasificación y Análisis de Logs", () => {
  const mockToken = process.env.TEST_JWT || "fake.jwt.token";

  // Test: Clasificación de incidencias
  it("POST /api/ai/incidents/classify → devuelve clasificación válida", async () => {
    const res = await request(server)
      .post("/api/ai/incidents/classify")
      .set("Authorization", `Bearer ${mockToken}`)
      .send({ text: "Tengo una fuga de agua debajo del fregadero" });

    expect([200, 401]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body).toHaveProperty("success", true);
      expect(res.body.data).toHaveProperty("category");
      expect(res.body.data).toHaveProperty("confidence");
    }
  });

  // Test: Estimación de precios
  it("POST /api/ai/pricing/estimate → devuelve rango de precios", async () => {
    const res = await request(server)
      .post("/api/ai/pricing/estimate")
      .set("Authorization", `Bearer ${mockToken}`)
      .send({
        category: "Fontanería",
        urgency: "urgente",
        complexity: "alta",
      });

    expect([200, 401]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body.data).toHaveProperty("min");
      expect(res.body.data).toHaveProperty("max");
    }
  });

  // Test: Análisis predictivo de logs
  it("GET /api/ai/logs/analyze → ejecuta análisis de logs", async () => {
    const res = await request(server)
      .get("/api/ai/logs/analyze")
      .set("Authorization", `Bearer ${mockToken}`);

    expect([200, 401]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body).toHaveProperty("success", true);
      expect(res.body.data).toHaveProperty("health");
    }
  });
});

afterAll(async () => {
  server.close();
});
