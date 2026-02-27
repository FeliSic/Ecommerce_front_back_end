// app/api/search.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { searchProducts} from 'bknd/controllers/products';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
    return searchProducts(req, res); // delegás la respuesta a sendingEmail
    } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Método ${req.method} no permitido`);
    }
}
