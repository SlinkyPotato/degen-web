import { IncomingMessage } from 'http';
import { DegenService, PoapAdmin } from '../../interfaces/degen-service.interface';
import * as mongoDB from 'mongodb';

export class MongoDegenService implements DegenService {
  db: mongoDB.Db;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async init(req: any) {
    this.db = req.app.globals.db;
    return this;
  }

  async getPoapAdmins(guildId: string) {
    const admins = await this.db
      .collection(process.env.POAP_ADMIN_COLLECTION_NAME)
      .find({ discordServerId: guildId })
      .toArray();

    return admins;
  }

  async addPoapAdmins(admin: PoapAdmin) {
    const result = await this.db
      .collection(process.env.POAP_ADMIN_COLLECTION_NAME)
      .insertOne(admin);
    return result;
  }

  async removePoapAdmins(admin: PoapAdmin) {
    const result = await this.db
      .collection(process.env.POAP_ADMIN_COLLECTION_NAME)
      .deleteMany(admin);
    return result;
  }
}

export const getDegenService = async (req: IncomingMessage) => {
  return new MongoDegenService().init(req);
};
