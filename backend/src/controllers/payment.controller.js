import Stripe from "stripe";
import dotenv from "dotenv";
import Payment from "../models/Payment.js";
import Service from "../models/Service.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 💳 Crear sesión de pago
export const createCheckoutSession = async (req, res) => {
  try {
    const { serviceId } = req.body;
    const service = await Service.findById(serviceId).populate("professional");

    if (!service) return res.status(404).json({ error: "Servicio no encontrado" });

    // Crear sesión de pago en Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Servicio: ${service.title}`,
              description: service.description,
            },
            unit_amount: Math.round(service.price * 100), // en céntimos
          },
          quantity: 1,
        },
      ],
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    });

    // Guardar en BD
    const payment = await Payment.create({
      service: service._id,
      client: req.user.id,
      professional: service.professional._id,
      amount: service.price,
      stripeSessionId: session.id,
    });

    res.status(201).json({ url: session.url, payment });
  } catch (error) {
    console.error("❌ Error al crear sesión de pago:", error);
    res.status(500).json({ error: "Error al crear sesión de pago" });
  }
};

// ✅ Webhook Stripe (para confirmar pago)
export const handleWebhook = async (req, res) => {
  try {
    const event = req.body;

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const payment = await Payment.findOne({ stripeSessionId: session.id });

      if (payment) {
        payment.status = "succeeded";
        await payment.save();

        // Marcar el servicio como pagado
        await Service.findByIdAndUpdate(payment.service, { status: "completado" });
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error("❌ Error en webhook:", error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};
