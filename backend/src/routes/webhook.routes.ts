import express, { Request, Response } from "express";
import { stripe } from "../utils/stripe";
import Booking from "../models/Booking";
import bodyParser from "body-parser";

const router = express.Router();

// 🧠 Este endpoint NO usa express.json(), usa raw body
router.post(
  "/stripe",
  bodyParser.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"];

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig as string,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      // 🎯 Evento de pago completado
      if (event.type === "checkout.session.completed") {
        const session = event.data.object as any;

        // 🧾 Actualizar reserva asociada
        await Booking.findOneAndUpdate(
          { stripeSessionId: session.id },
          { paymentStatus: "paid", status: "confirmed" }
        );
      }

      // 💸 Si se produce reembolso o fallo
      if (event.type === "charge.refunded") {
        const charge = event.data.object as any;
        await Booking.findOneAndUpdate(
          { stripeSessionId: charge.payment_intent },
          { paymentStatus: "refunded", status: "cancelled" }
        );
      }

      res.status(200).json({ received: true });
    } catch (err: any) {
      console.error("❌ Error en webhook Stripe:", err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
);

export default router;
