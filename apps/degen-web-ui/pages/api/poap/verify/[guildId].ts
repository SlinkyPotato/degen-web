import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { getPoapService } from '../../../../src/core/api/poap.service';
import { DiscordSession } from '../../../../src/core/interfaces/auth-session';
import { VerifyPoapDTO } from '../../../../src/core/interfaces/verify-poap.dto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const poapService = await getPoapService(req);
  const userSession = (await getSession({ req })) as DiscordSession;

  if (req.method === 'GET') {
    const guildId = req.query.guildId as string;
    const isPoapAdmin = await poapService.isPoapAdmin(guildId, userSession?.user?.id);
    res.status(200).json({
      isPoapAdmin,
    } as VerifyPoapDTO);
  }
}
