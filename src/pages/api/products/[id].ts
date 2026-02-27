// app/api/products/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getProductById} from 'bknd/controllers/products';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
    return getProductById(req, res); // delegás la respuesta a getProductById
    } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Método ${req.method} no permitido`);
    }
}