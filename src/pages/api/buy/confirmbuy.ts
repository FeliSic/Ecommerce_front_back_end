// app/api/products/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createSingleProductPreference } from 'lib/mercadopago';
import { Purchases } from 'bknd/models/models';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { orderName, orderDescription, orderId, productId, userId, userEmail, orderPrice, transactionId, orderIdMercadoPago } = req.body;
    try {
      // Guardar la compra en la base ANTES de crear la preferencia
      await Purchases.create({
        orderIdMercadoPago,
        orderId,
        userId,
        productId,
        userEmail,
        amount: orderPrice,
        transactionId,
        paymentStatus: 'pending',
      });

      const preference = await createSingleProductPreference({
        orderName,
        orderDescription,
        orderId,
        productId,
        userEmail,
        userId,
        orderPrice,
        transactionId,
        back_urls: {
          success: `${process.env.VERCEL_URL}/thanks`,
          failure: `${process.env.VERCEL_URL}/failure`,
          pending: `${process.env.VERCEL_URL}/pending`,
        },
        auto_return: "approved",
      });
      res.status(200).json(preference);
    } catch (error: any) {
  console.error("Error en /api/products/[id]:", error);
  res.status(500).json({ error: "Error creando la preferencia", details: error.message || error });
  }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}
