import { ServerGlobals } from '../../server';
import { MongoDbCollections } from './mongo/db';
import { IncomingMessage } from 'http';
import { Db } from 'mongodb';
import { Client as DiscordClient } from 'discord.js';

export class WalletService {
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
}

export const getPoapService = async (req: IncomingMessage) => {
  return new WalletService().init(req);
};
