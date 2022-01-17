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

  async getDiscordUser(userId: string) {
    const discordUser = await this.collections.discordUsers
      .find({ userId: userId })
      .toArray();
    return discordUser;
  }

  async createDiscordWallet(userId: string, address: string, username: string) {
    const result = await this.collections.discordUsers.insertOne({
      userId: userId,
      address,
      tag: username,
      isDMEnabled: false,
    });
    return result;
  }

  async updateDiscordWallet(userId: string, address: string) {
    const result = await this.collections.discordUsers.findOneAndUpdate(
      {
        userId: userId,
      },
      {
        $set: {
          address: address,
        },
      }
    );
    return result;
  }
}

export const getWalletService = async (req: IncomingMessage) => {
  return new WalletService().init(req);
};
