import { NextApiRequest, NextApiResponse } from 'next';
import { getDiscordService } from '../../../../src/core/api/discord.service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const discordService = await getDiscordService(req);
  const guildId = req.query.guildId as string;
  const guildChannels = await discordService.getGuildChannels(guildId);
  res.status(200).json({
    guildChannels,
  });
}
