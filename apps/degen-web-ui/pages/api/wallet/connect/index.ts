import { NextApiRequest, NextApiResponse } from 'next';
import { getWalletService } from '../../../../src/core/api/wallet.service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const walletService = await getWalletService(req);

  if (req.method === 'POST') {
    const { account, userId, username } = req.body;
    const users = await walletService.getDiscordUser(userId);
    let result;
    if (users.length > 0) {
      result = await walletService.updateDiscordWallet(userId, account);
    } else {
      result = await walletService.createDiscordWallet(userId, account, username);
    }
    res.status(200).json(result);
  }
}
