import { getPaymentById } from "lib/mercadopago";
import sendEmail from "lib/nodemailer_email";
import logger from "lib/winston-logger";
import { base } from "lib/algolia_airtable";
import { NextApiRequest, NextApiResponse } from "next";
import { Purchases } from "bknd/models/models";
import { decrementProductStock } from "bknd/controllers/products";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("=== WEBHOOK INICIADO ===");
  console.log("Query:", req.query);
  console.log("Body:", req.body);

  if (req.method !== 'POST') {
    return res.status(405).json({ message: "Método no permitido" });
  }

  // MP puede enviar el ID en query params O en el body
  const paymentId = req.query.id || req.query['data.id'] || req.body?.data?.id;
  const topic = req.query.topic || req.body?.type;

  console.log("PaymentId extraído:", paymentId);
  console.log("Topic extraído:", topic);

  if (!topic || topic !== 'payment') {
    console.log("Ignorando, no es payment:", topic);
    return res.status(200).json({ received: true });
  }

  if (!paymentId) {
    logger.error("Webhook sin paymentId");
    return res.status(400).json({ error: "Payment ID no encontrado" });
  }

  try {
    console.log("Buscando pago con ID:", paymentId);
    const mpPayment = await getPaymentById(Number(paymentId));
    console.log("Pago encontrado:", mpPayment.status, mpPayment.external_reference);

    if (mpPayment.status === "approved") {
      const orderId = mpPayment.external_reference;
      const userEmail = mpPayment.payer?.email;

      console.log("OrderId:", orderId, "Email:", userEmail);

      if (!orderId || !userEmail) {
        logger.error(`Faltan datos del pago: orderId=${orderId}, userEmail=${userEmail}`);
        return res.status(400).json({ error: "Faltan datos del pago" });
      }

      console.log("Buscando compra con transactionId:", orderId);
      const purchase = await Purchases.findOne({ where: { transactionId: orderId } });
      console.log("Compra encontrada:", purchase ? "SÍ" : "NO");

      if (!purchase) {
        logger.error("Compra no encontrada para transactionId: " + orderId);
        return res.status(404).json({ error: "Compra no encontrada" });
      }

console.log("Actualizando purchase...");
await purchase.update({ 
  paymentStatus: 'approved',
  orderIdMercadoPago: String(mpPayment.id)
});

console.log("Enviando email...");
const subject = `Confirmación de pago - Orden ${purchase.orderId}`;
const text = `Hola, tu pago por $${mpPayment.transaction_amount} fue aprobado.`;
await sendEmail(userEmail, subject, text);

// Decrementar stock del producto
if (purchase.productId) {
  console.log("Decrementando stock del producto...");
  await decrementProductStock(purchase.productId);
} else {
  console.warn("No hay productId para decrementar stock");
}

      console.log("✅ TODO EXITOSO");
      logger.info(`Order confirmed for ID: ${orderId}`);
    } else {
      console.log(`Pago no aprovado, status: ${mpPayment.status}`);
    }

    return res.status(200).json({ received: true });
  } catch (error: any) {
    console.error("❌ ERROR CAPTURADO:", error);
    console.error("Stack:", error.stack);
    logger.error("Error processing webhook:", error);
    return res.status(500).json({ error: "Error processing payment", details: error.message });
  }
}