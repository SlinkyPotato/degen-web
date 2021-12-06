import { NextApiRequest, NextApiResponse } from 'next';
import { getDegenService } from '../../../../../src/core/api/mongo/degen.service';
import { PoapAdmin } from '../../../../../src/core/interfaces/degen-service.interface';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const degenService = await getDegenService(req);

  if (req.method == 'POST') {
    const admin: PoapAdmin = req.body;
    const message = await degenService.addPoapAdmins(admin);
    res.status(200).json({
      message,
    });
    return;
  }

  if (req.method == 'DELETE') {
    const admin: PoapAdmin = req.body;
    const message = await degenService.removePoapAdmins(admin);
    res.status(200).json({
      message,
    });
    return;
  }
}
