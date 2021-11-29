import { IncomingMessage } from 'http';
import { getSession } from 'next-auth/react';
import { DiscordSession } from '../models/auth-session';
import { Client as DiscordClient, Guild } from 'discord.js';
import { REST as DiscordRest } from '@discordjs/rest';
import { GuildDTO } from '../models/guild.dto';

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

  /** Fetches a list of servers that are mutual between the bot and the current user */
  async getMutualGuilds(): Promise<GuildDTO[]> {
    const botGuilds = await this.client.guilds.cache;
    const mutualGuilds = await Promise.all(
      botGuilds
        .map((guild) =>
          guild.members
            .fetch(this.userSession?.user?.id)
            .then((guildMember) => this.transformGuildResponse(guild))
            .catch((err) => null)
        )
        .filter((guild) => guild !== null)
    );
    return mutualGuilds as GuildDTO[];
  }

  /** Transforms a large discord.js guild entity to a light portable GuildDTO for the response */
  private transformGuildResponse(guild: Guild): GuildDTO {
    return {
      id: guild.id,
      name: guild.name,
      iconUrl: guild.iconURL(),
    };
  }
}

/** Returns an initialized instance of DiscordService */
export const getDiscordService = async (req: IncomingMessage) => {
  return new DiscordService().init(req);
};
