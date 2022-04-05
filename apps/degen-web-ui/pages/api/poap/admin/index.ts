import { NextApiRequest, NextApiResponse } from 'next';
import { getPoapService } from '../../../../src/core/api/poap.service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const poapService = await getPoapService(req);

  if (req.method === 'POST') {
    const { guildId, userId } = req.body;
    try {
      const newAdmin = await poapService.addPoapAdmin(guildId, userId);
      res.status(200).json({
        added: newAdmin,
      });
    } catch (err) {
      res.status(500).json({
        message: `Failed to add new admin user with id: ${userId} for guild: ${guildId}`,
      });
    }
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
