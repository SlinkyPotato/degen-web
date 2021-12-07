import { IncomingMessage } from 'http';
import { getSession } from 'next-auth/react';
import { DiscordSession } from '../interfaces/auth-session';
import { Client as DiscordClient, Guild, GuildMember, Permissions } from 'discord.js';
import { REST as DiscordRest } from '@discordjs/rest';
import { GuildDTO } from '../interfaces/guild.dto';
import { ServerGlobals } from '../../server';

export class DiscordService {
  private rest: DiscordRest;
  private client: DiscordClient;
  private userSession: DiscordSession;

  async init(req: any) {
    this.client = (req.app.globals as ServerGlobals).discordClient;
    this.rest = (req.app.globals as ServerGlobals).discordRest;
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
            .then((guildMember) => this.transformGuildResponse(guild, guildMember))
            .catch((err) => null)
        )
        .filter((guild) => guild !== null)
    );
    return mutualGuilds as GuildDTO[];
  }

  async isGuildAdmin(guildId: string, guildMember?: GuildMember): Promise<boolean> {
    const guild = await this.client.guilds.fetch(guildId);
    if (!guildMember) {
      guildMember = await guild.members.fetch(this.userSession?.user?.id);
    }
    return (
      guildMember.permissions.has(Permissions.FLAGS.ADMINISTRATOR) ||
      guildMember.permissions.has(Permissions.FLAGS.MANAGE_GUILD)
    );
  }

  /** Transforms a large discord.js guild entity to a light portable GuildDTO for the response */
  private async transformGuildResponse(
    guild: Guild,
    guildMember: GuildMember
  ): Promise<GuildDTO> {
    if (guild) {
      return {
        id: guild.id,
        name: guild.name,
        iconUrl: guild.iconURL(),
        guildAdmin: await this.isGuildAdmin(guild.id, guildMember),
      };
    }
    return null;
  }
}

/** Returns an initialized instance of DiscordService */
export const getDiscordService = async (req: IncomingMessage) => {
  return new DiscordService().init(req);
};
