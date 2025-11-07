import express from "express";
import Stripe from "stripe";
import { verifyToken } from "../middlewares/auth.middleware.js";
import Booking from "../models/Booking.js";
import { io } from "../server.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 💳 Crear sesión de pago
router.post("/create-session", verifyToken, async (req, res) => {
  try {
    const { amount, serviceId, professionalId, date } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Servicio ServiGo (${serviceId})`,
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.FRONTEND_URL}/dashboard?payment=cancel`,
    });

    const booking = await Booking.create({
      serviceId,
      clientId: req.user.id,
      professionalId,
      date,
      amount,
      paymentStatus: "unpaid",
      stripeSessionId: session.id,
    });

    // Notificar al profesional en tiempo real
    io.to(`room_user_${professionalId}`).emit("newNotification", {
      title: "Nueva reserva con pago pendiente 💳",
      message: `El cliente ${req.user.name} ha iniciado un pago de ${amount}€.`,
      read: false,
      createdAt: new Date().toISOString(),
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("❌ Error creando sesión de pago:", error);
    res.status(500).json({ error: "Error al crear sesión de pago" });
  }
});

export default router;
