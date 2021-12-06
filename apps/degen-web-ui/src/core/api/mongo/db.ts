import { Db, MongoClient, Collection, Document } from 'mongodb';

export interface MongoDbCollections {
  poapAdmins: Collection<Document>;
}

export async function initDatabase(): Promise<{
  db: Db;
  collections: MongoDbCollections;
}> {
  console.log('> Initializing db connection...');
  const client: MongoClient = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db: Db = client.db(process.env.MONGODB_DB);

  return {
    db,
    collections: {
      poapAdmins: await db.collection(process.env.POAP_ADMIN_COLLECTION_NAME),
    },
  };
}