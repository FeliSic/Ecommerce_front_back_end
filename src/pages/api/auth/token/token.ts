// app/api/auth/token.ts
// ejemplo basico
import { NextApiRequest, NextApiResponse } from 'next';
import { verifyAuthCode } from 'bknd/controllers/users';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
    return verifyAuthCode(req, res); // delegás la respuesta a verifyAuthCode
    } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} no permitido`);
    }
}