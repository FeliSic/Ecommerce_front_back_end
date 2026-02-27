// app/api/me/orders.ts
// ejemplo basico
import { NextApiRequest, NextApiResponse } from 'next';
import { getOrdersByUserId } from 'bknd/controllers/purchases';
import parseBearerToken from "parse-bearer-token";
import { verifyToken } from 'lib/jwt-auth'; // o donde tengas estas funciones

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const token = parseBearerToken(req);
    if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

    const tokenData = verifyToken(token);
    if (!tokenData) return res.status(401).json({ message: 'Token inválido' });


    if (!tokenData || typeof tokenData === 'string') {
    throw new Error("Token inválido");
    }

    const userId = tokenData.id;

    try {
      const orders = await getOrdersByUserId(userId);
      return res.status(200).json({ orders });
    } catch (error:any) {
      console.error('Error al obtener órdenes:', error);
      return res.status(500).json({ message: 'Error al obtener órdenes', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}
