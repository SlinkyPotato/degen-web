import { NextApiRequest, NextApiResponse } from 'next';
import { getDiscordService } from '../../../src/core/api/discord.service';

// eslint-disable-next-line import/no-anonymous-default-export
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const discordService = await getDiscordService(req);
  const guilds = discordService.getMutualGuilds();
  res.status(200).json({
    guilds,
  });
}
