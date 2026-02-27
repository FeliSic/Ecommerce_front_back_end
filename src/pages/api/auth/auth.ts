// app/api/auth.ts
// ejemplo basico
import { NextApiRequest, NextApiResponse } from 'next';
import { sendingEmail } from 'bknd/controllers/users';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
    }
    await sendingEmail(req, res);
}