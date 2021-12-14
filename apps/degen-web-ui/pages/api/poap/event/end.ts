import { NextApiRequest, NextApiResponse } from 'next';
import { getPoapService } from '../../../../src/core/api/poap.service';
import { PoapSettingsDTO } from '../../../../src/core/interfaces/poap-settings.dto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const poapService = await getPoapService(req);

  const { guildId, voiceChannelId } = req.body;
  try {
    const event: PoapSettingsDTO = await poapService.endPoapEvent(
      guildId,
      voiceChannelId
    );
    res.status(200).json({
      message: `Successfully ended event for server ${guildId} in voice channel ${voiceChannelId}`,
      event,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}
