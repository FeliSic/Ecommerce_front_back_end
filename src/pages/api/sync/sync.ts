import { NextApiRequest, NextApiResponse } from 'next';
import { syncAirtableToAlgolia } from 'bknd/controllers/products';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return syncAirtableToAlgolia(req, res);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}