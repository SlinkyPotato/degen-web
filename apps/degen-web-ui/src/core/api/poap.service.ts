import { ServerGlobals } from '../../server';
import { MongoDbCollections } from './mongo/db';
import { IncomingMessage } from 'http';
import { PoapAdminDTO } from '../interfaces/poap-admin.dto';
import { Db, ObjectId } from 'mongodb';
import { Client as DiscordClient } from 'discord.js';
import { PoapSettingsDTO } from '../interfaces/poap-settings.dto';
import { PoapParticipantDTO } from '../interfaces/poap-participant';

export class PoapService {
  private db: Db;
  private collections: MongoDbCollections;
  private client: DiscordClient;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async init(req: any) {
    this.client = (req.app.globals as ServerGlobals).discordClient;
    this.db = req.app.globals.db;
    this.collections = (req.app.globals as ServerGlobals).collections;
    return this;
  }

  async isPoapAdmin(guildId: string, userId: string) {
    const admins = await this.collections.poapAdmins
      .find({ discordServerId: guildId, discordObjectId: userId })
      .toArray();
    return admins?.length > 0;
  }

  async getPoapAdmins(guildId: string) {
    const admins = await this.collections.poapAdmins
      .find({ discordServerId: guildId })
      .toArray();
    return admins as unknown as PoapAdminDTO[];
  }

  async addPoapAdmin(guildId: string, userId: string) {
    const guild = await this.client.guilds.fetch(guildId);
    const guildMember = await guild.members.fetch(userId);
    const poapAdmin = await this.collections.poapAdmins.insertOne({
      objectType: '???',
      discordObjectId: userId,
      discordObjectName: guildMember.displayName,
      discordServerId: guildId,
      discordServerName: guild.name,
    });
    return poapAdmin as unknown as PoapAdminDTO;
  }

  async removePoapAdmin(_id: string) {
    const result = await this.collections.poapAdmins.deleteOne({
      _id: new ObjectId(_id),
    });
    return result;
  }

  async getPoapEvents(guildId: string) {
    const result = await this.collections.poapSettings
      .find({
        discordServerId: guildId,
      })
      .toArray();

    // Return events with active members in channel
    return Promise.all(
      result.map(async (event) => {
        return {
          _id: event._id,
          event: event.event,
          isActive: event.isActive,
          startTime: event.startTime,
          endTime: event.endTime,
          discordUserId: event.discordUserId,
          voiceChannelId: event.voiceChannelId,
          voiceChannelName: event.voiceChannelName,
          discordServerId: event.discordServerId,
          participants: await this.getPoapParticipants(
            event.discordServerId,
            event.voiceChannelId
          ),
        };
      })
    );
  }

  async startPoapEvent(
    event: string,
    duration: number,
    userId: string,
    guildId: string,
    voiceChannelId: string
  ) {
    const guild = await this.client.guilds.fetch(guildId);
    const voiceChannel = await guild.channels.fetch(voiceChannelId).catch(() => {
      throw new Error(`No voice channel found with id ${voiceChannelId}`);
    });

    const activeEvent = await this.collections.poapSettings.findOne({
      discordServerId: guildId,
      voiceChannelId: voiceChannelId,
      isActive: true,
    });

    if (activeEvent !== null) {
      throw new Error(
        `Active event for server ${guildId} in voice channel ${voiceChannelId}`
      );
    }

    const startTime = new Date();
    const result = await this.collections.poapSettings.findOneAndUpdate(
      {
        discordServerId: guildId,
        voiceChannelId: voiceChannelId,
      },
      {
        $set: {
          event: event,
          isActive: true,
          startTime: startTime.toISOString(),
          endTime: new Date(startTime.getTime() + duration * 60000).toISOString(),
          discordUserId: userId,
          voiceChannelId: voiceChannel.id,
          voiceChannelName: voiceChannel.name,
          discordServerId: guildId,
        },
      },
      {
        upsert: true,
      }
    );
    return result.value as unknown as PoapSettingsDTO;
  }

  async endPoapEvent(guildId: string, voiceChannelId: string) {
    const result = await this.collections.poapSettings.findOneAndUpdate(
      {
        discordServerId: guildId,
        voiceChannelId: voiceChannelId,
        isActive: true,
      },
      {
        $set: {
          isActive: false,
          endTime: new Date().toISOString(),
        },
      }
    );

    if (result.value == null) {
      throw new Error(
        `No active event found for server ${guildId} in voice channel ${voiceChannelId}`
      );
    }
    return result.value as unknown as PoapSettingsDTO;
  }

  async getPoapParticipants(guildId: string, voiceChannelId: string) {
    const result = await this.collections.poapParticipants
      .find({
        discordServerId: guildId,
        voiceChannelId: voiceChannelId,
      })
      .toArray();

    return result as unknown as PoapParticipantDTO[];
  }

  async insertPoapParticipant(participant: PoapParticipantDTO, event: string) {
    const result = await this.collections.poapParticipants.insertOne({
      event: event,
      discordUserId: participant.discordUserId,
      discordUserTag: participant.discordUserTag,
      startTime: participant.startTime,
      endTime: null,
      voiceChannelId: participant.voiceChannelId,
      discordServerId: participant.discordServerId,
      durationInMinutes: 0,
    });

    return result;
  }

  async removePoapParticipants(guildId: string, voiceChannelId: string) {
    const result = await this.collections.poapParticipants.deleteMany({
      discordServerId: guildId,
      voiceChannelId: voiceChannelId,
    });

    if (!result.acknowledged) {
      throw new Error(`Error Removing Participants`);
    }

    return result;
  }
}

export const getPoapService = async (req: IncomingMessage) => {
  return new PoapService().init(req);
};
