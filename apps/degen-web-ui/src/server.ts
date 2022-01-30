import express from 'express';
import { Client, Intents } from 'discord.js';
import { REST } from '@discordjs/rest';
import { initDatabase, MongoDbCollections } from './core/api/mongo/db';
import { Db } from 'mongodb';
import * as core from 'express-serve-static-core';

interface CustomExpressServer extends core.Express {
  globals?: ServerGlobals;
}

export interface ServerGlobals {
  discordClient: Client;
  discordRest: REST;
  db: Db;
  authDb: Db;
  collections: MongoDbCollections;
}

module.exports = async function customServer(app, settings) {
  const handle = app.getRequestHandler();
  await app.prepare();
  const server: CustomExpressServer = express();

  // Init global server vars
  const discordToken = process.env.DISCORD_TOKEN;
  if (!discordToken) {
    throw new Error('Required env variable missing: DISCORD_TOKEN');
  }
  const { db, authDb, collections } = await initDatabase();
  server.globals = {
    discordClient: new Client({
      intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES],
    }),
    discordRest: new REST({ version: '9' }).setToken(discordToken),
    db,
    authDb,
    collections,
  } as ServerGlobals;
  console.log('> Logging in discord.js client...');
  await server.globals.discordClient.login(discordToken);

  console.log('> Starting app...');
  server.all('*', (req, res) => handle(req, res));
  server.listen(settings.port, settings.hostname);
};
