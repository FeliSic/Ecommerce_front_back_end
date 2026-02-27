// app/api/order/[orderId].ts
// ejemplo basico
import { NextApiRequest, NextApiResponse } from 'next';
import { getOrderById } from 'bknd/controllers/purchases';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { orderId } = req.query;

    if (!orderId || Array.isArray(orderId)) {
      return res.status(400).json({ message: 'orderId inválido' });
    }

    try {
      const order = await getOrderById(Number(orderId));
      if (!order) {
        return res.status(404).json({ message: 'Orden no encontrada' });
      }
      return res.status(200).json({ order });
    } catch (error:any) {
      console.error('Error al obtener la orden:', error);
      return res.status(500).json({ message: 'Error al obtener la orden', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}
