import { MongoClient } from 'mongodb';
import { AppConfig } from '../../app.config';

let client: MongoClient;
let authDbClientPromise: Promise<MongoClient>;
const authDbUri = `${AppConfig.MONGODB_URI}/${AppConfig.AUTH_DB}?retryWrites=true&w=majority`;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(authDbUri);
    (global as any)._mongoClientPromise = client.connect();
  }
  authDbClientPromise = (global as any)._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(authDbUri);
  authDbClientPromise = client.connect();
}

export default authDbClientPromise;
