import { AppConstants } from './../../app.constants';
import { Db, MongoClient, Collection, Document } from 'mongodb';
import { AppConfig } from '../../app.config';

export interface MongoDbCollections {
  poapAdmins: Collection<Document>;
  poapSettings: Collection<Document>;
  poapParticipants: Collection<Document>;
  poapTwitterSettings: Collection<Document>;
  poapTwitterParticipants: Collection<Document>;
  nextAuthSessions: Collection<Document>;
  nextAuthAccounts: Collection<Document>;
  nextAuthCache: Collection<Document>;
}

export async function initDatabase(): Promise<{
  db: Db;
  authDb: Db;
  collections: MongoDbCollections;
}> {
  console.log('> Initializing db connection...');
  const client: MongoClient = new MongoClient(AppConfig.MONGODB_URI);
  await client.connect();
  const db: Db = client.db(AppConfig.MONGODB_DB);
  const authDb = client.db(AppConfig.AUTH_DB);

  return {
    db,
    authDb,
    collections: {
      poapAdmins: await db.collection(AppConstants.POAP_ADMIN_COLLECTION_NAME),
      poapSettings: await db.collection(AppConstants.POAP_SETTINGS_COLLECTION_NAME),
      poapParticipants: await db.collection(
        AppConstants.POAP_PARTICIPANTS_COLLECTION_NAME
      ),
      poapTwitterSettings: await db.collection(AppConstants.POAP_TWITTER_SETTINGS),
      poapTwitterParticipants: await db.collection(
        AppConstants.POAP_TWITTER_PARTICIPANTS
      ),
      nextAuthSessions: await authDb.collection(AppConstants.NEXT_AUTH_SESSIONS),
      nextAuthAccounts: await authDb.collection(AppConstants.NEXT_AUTH_ACCOUNTS),
      nextAuthCache: await authDb.collection(AppConstants.NEXT_AUTH_CACHE),
    },
  };
}
