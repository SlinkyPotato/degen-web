import { IncomingMessage } from 'http';
import { getSession } from 'next-auth/react';
import { DiscordSession } from '../models/auth-session';
import { Client as DiscordClient, Guild } from 'discord.js';
import { REST as DiscordRest } from '@discordjs/rest';
import { UIGuild } from '../models/guild';

export class DiscordService {
  private rest: DiscordRest;
  private client: DiscordClient;
  private userSession: DiscordSession;

  async init(req: any) {
    this.client = req.app.globals.discordClient;
    this.rest = req.app.globals.discordRest;
    this.userSession = (await getSession({ req })) as DiscordSession;
    return this;
  }

  /** Returns the current users discord id */
  getUserId() {
    return this.userSession?.user?.id;
  }

  /** Fetches the current users guilds */
  async getMutualGuilds(): Promise<UIGuild[]> {
    const botGuilds = await this.client.guilds.cache;
    const mutualGuilds = await Promise.all(
      botGuilds
        .map((guild) =>
          guild.members
            .fetch(this.userSession?.user?.id)
            .then((guildMember) => this.mapGuildResponse(guild))
            .catch((err) => null)
        )
        .filter((guild) => guild !== null)
    );
    return mutualGuilds as UIGuild[];
  }

  private mapGuildResponse(guild: Guild): UIGuild {
    return {
      id: guild.id,
      name: guild.name,
      iconUrl: guild.iconURL(),
    };
  }
}

export const getDiscordService = async (req: IncomingMessage) => {
  return new DiscordService().init(req);
};
