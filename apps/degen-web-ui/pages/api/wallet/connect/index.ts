import { NextApiRequest, NextApiResponse } from 'next';
import { getWalletService } from '../../../../src/core/api/wallet.service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const walletService = await getWalletService(req);

  if (req.method === 'POST') {
    const { account, userId } = req.body;
    const result = await walletService.updateWallet(userId, account);
    res.status(200).json(result);
  }

  if (req.method === 'GET') {
    const userId = req.query.userId as string;
    console.log(`CHECK IF DISCORD USER ALREADY HAS ENTRY`);
    const result = await walletService.getDiscordUser(userId);
    res.status(200).json(result);
  }
}
