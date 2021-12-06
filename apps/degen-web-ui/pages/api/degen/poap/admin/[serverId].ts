import { NextApiRequest, NextApiResponse } from 'next';
import { getDegenService } from '../../../../../src/core/api/mongo/degen.service';
import {
  DegenService,
  PoapAdmin,
} from '../../../../../src/core/interfaces/degen-service.interface';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const degenService: DegenService = await getDegenService(req);

  if (req.method == 'GET') {
    const serverId = req.query.serverId;
    const admins: PoapAdmin[] = await degenService.getPoapAdmins(serverId);
    res.status(200).json({
      admins,
    });
    return;
  }
}
