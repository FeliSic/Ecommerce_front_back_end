// app/api/me.ts
// ejemplo basico
import { NextApiRequest, NextApiResponse } from 'next';
import { getMe, updateMe } from 'bknd/controllers/users';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        return getMe(req, res); // delegás la respuesta a getMe
    } else if (req.method === 'PATCH') {
        return updateMe(req, res); // delegás la respuesta a updateMe
    } else {
        res.setHeader('Allow', ['GET', 'PATCH']);
        res.status(405).end(`Método ${req.method} no permitido`);
    }
}
