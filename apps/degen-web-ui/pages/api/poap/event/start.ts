import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { getDiscordService } from '../../../../src/core/api/discord.service';
import { getPoapService } from '../../../../src/core/api/poap.service';
import { DiscordSession } from '../../../../src/core/interfaces/auth-session';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const poapService = await getPoapService(req);
  const discordService = await getDiscordService(req);
  const userSession = (await getSession({ req })) as DiscordSession;

  const { eventName, duration, guildId, voiceChannelId } = req.body;
  try {
    const isPoapAdmin = await poapService.isPoapAdmin(guildId, userSession?.user?.id);

    if (!isPoapAdmin) {
      res.status(401).json({
        message: `Must Be Poap Admin to start events`,
      });
      return;
    }

    const event = await poapService.startPoapEvent(
      eventName,
      duration,
      userSession.user?.id,
      guildId,
      voiceChannelId
    );

    // Get list of current participants
    const members = await discordService.getMembersInChannel(guildId, voiceChannelId);

    await poapService.removePoapParticipants(guildId, voiceChannelId);

    await Promise.all(
      members.map((member) => {
        poapService.insertPoapParticipant(member, eventName);
      })
    );

    res.status(200).json({
      message: 'starting event',
      event,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}
