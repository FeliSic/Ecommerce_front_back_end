// app/api/order.ts
// ejemplo basico
import { NextApiRequest, NextApiResponse } from 'next';
import { createOrder } from 'bknd/controllers/purchases';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
           const productId = req.query.productId as string; // sacás productId del query

        if (!productId) {
            return res.status(400).json({ message: "Falta el productId en query params" });
        } // Extraer los datos del cuerpo de la solicitud

        try {
            const { url, orderId } = await createOrder(req, productId); // Pasar los tres argumentos
            return res.status(201).json({ url, orderId }); // Responder con la URL de pago y el ID de la orden
        } catch (error:any) {
            console.error("Error al crear la orden:", error);
            return res.status(500).json({ message: "Error al crear la orden", error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Método ${req.method} no permitido`);
    }
}