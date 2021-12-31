import { NextApiRequest, NextApiResponse } from 'next';
import { getWalletService } from '../../../../src/core/api/wallet.service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const poapService = await getWalletService(req);

  if (req.method === 'POST') {
    console.log('POSTING TO API ENDPOINT FOR CONNECT');
    const result = await poapService.updateWallet(
      '1',
      '0xcfBf34d385EA2d5Eb947063b67eA226dcDA3DC38'
    );
    res.status(200).json(result);
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;
    try {
      const result = await poapService.removePoapAdmin(id);
      if (result.deletedCount > 0) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: 'User not found.' });
      }
    } catch (err) {
      res.status(500).json({ message: 'Failed to remove admin user.' });
    }
  }
}
