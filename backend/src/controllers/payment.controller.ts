import { Request, Response } from "express";
import { stripe } from "../utils/stripe";
import Booking from "../models/Booking";

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { serviceId, professionalId, amount, clientId } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
      customer_email: req.body.email,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: `Servicio #${serviceId}` },
            unit_amount: Math.round(amount * 100), // en céntimos
          },
          quantity: 1,
        },
      ],
    });

    const booking = await Booking.create({
      clientId,
      professionalId,
      serviceId,
      amount,
      stripeSessionId: session.id,
    });

    return res.status(200).json({ url: session.url, bookingId: booking._id });
  } catch (error) {
    console.error("Error creando sesión de Stripe:", error);
    return res.status(500).json({ message: "Error creando sesión de pago" });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { session_id } = req.query;
    const session = await stripe.checkout.sessions.retrieve(session_id as string);

    if (session.payment_status === "paid") {
      await Booking.findOneAndUpdate(
        { stripeSessionId: session.id },
        { paymentStatus: "paid", status: "confirmed" }
      );
    }

    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ success: false });
  }
};
