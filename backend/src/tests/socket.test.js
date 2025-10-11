// ==============================
// 🧪 socket.test.js
// Test del sistema real-time – ServiGo
// ==============================

import { io as Client } from "socket.io-client";
import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";

let io, server, clientSocket;

beforeAll((done) => {
  const app = express();
  server = createServer(app);
  io = new Server(server);
  server.listen(() => {
    const port = server.address().port;
    clientSocket = new Client(`http://localhost:${port}`);

    io.on("connection", (socket) => {
      socket.on("joinRoom", (room) => socket.join(room));
      socket.on("sendMessage", (data) => {
        io.to(`room_service_${data.serviceId}`).emit("newMessage", data);
      });
    });

    clientSocket.on("connect", done);
  });
});

afterAll(() => {
  io.close();
  clientSocket.close();
  server.close();
});

// ✅ Test conexión
test("Cliente se conecta correctamente", () => {
  expect(clientSocket.connected).toBe(true);
});

// ✅ Test envío y recepción
test(
  "Envía y recibe mensajes correctamente",
  (done) => {
    const testData = {
      serviceId: "12345",
      sender: "userA",
      receiver: "userB",
      content: "Hola desde test!",
    };

    clientSocket.emit("joinRoom", `room_service_${testData.serviceId}`);

    // Espera a que se una antes de enviar
    setTimeout(() => {
      clientSocket.emit("sendMessage", testData);
    }, 100);

    clientSocket.on("newMessage", (data) => {
      try {
        expect(data.content).toBe("Hola desde test!");
        done();
      } catch (err) {
        done(err);
      }
    });
  },
  10000 // timeout 10s
);
