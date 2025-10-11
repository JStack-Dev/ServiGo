// ==============================
// 🧪 messages.test.js
// Test de la API REST de mensajes – ServiGo
// ==============================
import request from "supertest";
import server from "../index.js"; // export default server en index.js
import jwt from "jsonwebtoken";

const token = jwt.sign(
  { id: "000000000000000000000001", role: "cliente" },
  process.env.JWT_SECRET || "test_secret",
  { expiresIn: "1h" }
);

// ObjectId válido (24 hex chars)
const VALID_SERVICE_ID = "507f1f77bcf86cd799439011";

describe("API de mensajes", () => {
  afterAll(() => server.close());

  test("GET /api/messages/:serviceId devuelve 200 con token y ObjectId válido", async () => {
    const res = await request(server)
      .get(`/api/messages/${VALID_SERVICE_ID}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("GET /api/messages/:serviceId devuelve 400 si el serviceId es inválido", async () => {
    const res = await request(server)
      .get("/api/messages/123456") // inválido
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "serviceId inválido");
  });
});
