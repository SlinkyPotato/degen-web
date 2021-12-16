import { AppConstants } from './../../app.constants';
import { Db, MongoClient, Collection, Document } from 'mongodb';
import { AppConfig } from '../../app.config';

export interface MongoDbCollections {
  poapAdmins: Collection<Document>;
  poapSettings: Collection<Document>;
  poapParticipants: Collection<Document>;
}

export async function initDatabase(): Promise<{
  db: Db;
  collections: MongoDbCollections;
}> {
  console.log('> Initializing db connection...');
  const client: MongoClient = new MongoClient(AppConfig.MONGODB_URI);
  await client.connect();
  const db: Db = client.db(AppConfig.MONGODB_DB);

  return {
    db,
    collections: {
      poapAdmins: await db.collection(AppConstants.POAP_ADMIN_COLLECTION_NAME),
      poapSettings: await db.collection(AppConstants.POAP_SETTINGS_COLLECTION_NAME),
      poapParticipants: await db.collection(
        AppConstants.POAP_PARTICIPANTS_COLLECTION_NAME
      ),
    },
  };
}
