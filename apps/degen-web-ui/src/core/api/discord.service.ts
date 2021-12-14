import { IncomingMessage } from 'http';
import { getSession } from 'next-auth/react';
import { DiscordSession } from '../interfaces/auth-session';
import {
  Client as DiscordClient,
  Guild,
  GuildChannel,
  GuildMember,
  Permissions,
} from 'discord.js';
import { REST as DiscordRest } from '@discordjs/rest';
import { GuildDTO } from '../interfaces/guild.dto';
import { ServerGlobals } from '../../server';
import { PoapParticipantDTO } from '../interfaces/poap-participant';
import { ChannelDTO } from '../interfaces/channel.dto';

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

  async getGuildChannels(guildId: string): Promise<ChannelDTO[]> {
    const guild = await this.client.guilds.fetch(guildId);
    const channels = await guild.channels.cache.filter(
      (channel) => channel.type === 'GUILD_VOICE'
    );

    return await Promise.all(
      channels.map((channel) => this.transformChannelResponse(channel as GuildChannel))
    );
  }

  async getMembersInChannel(
    guildId: string,
    voiceChannelId: string
  ): Promise<PoapParticipantDTO[]> {
    const guild = await this.client.guilds.fetch(guildId);
    const channel = await guild.channels.fetch(voiceChannelId);

    return Promise.all(
      channel.members.map((member) => this.transformMemberResponse(member))
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

  private async transformChannelResponse(
    guildChannel: GuildChannel
  ): Promise<ChannelDTO> {
    if (guildChannel) {
      return {
        id: guildChannel.id,
        name: guildChannel.name,
        type: guildChannel.type,
      };
    }
    return null;
  }

  private async transformMemberResponse(
    guildMember: GuildMember
  ): Promise<PoapParticipantDTO> {
    return {
      event: '',
      discordUserId: guildMember.id,
      discordUserTag: guildMember.displayName,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      voiceChannelId: guildMember.voice.channel.id,
      discordServerId: guildMember.guild.id,
      durationInMinutes: 0,
    };
  }
}

/** Returns an initialized instance of DiscordService */
export const getDiscordService = async (req: IncomingMessage) => {
  return new DiscordService().init(req);
};
