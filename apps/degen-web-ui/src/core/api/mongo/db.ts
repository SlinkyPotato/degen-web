import * as mongoDB from 'mongodb';

export const collections: { poapAdmins?: mongoDB.Collection } = {};

export default async function connectToDatabase(): Promise<mongoDB.Db> {
  console.log('Initializing db connection');
  const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.MONGODB_URI);

  await client.connect();

  const db: mongoDB.Db = client.db(process.env.MONGODB_DB);

  const poapAdminCollection: mongoDB.Collection = db.collection(
    process.env.POAP_ADMIN_COLLECTION_NAME
  );

  collections.poapAdmins = poapAdminCollection;

  console.log('db connection successful');
  return db;
}
