import express from 'express';
import { Client, Intents } from 'discord.js';
import { REST } from '@discordjs/rest';
import connectToDatabase from './core/api/mongo/db';

module.exports = async function customServer(app, settings) {
  const handle = app.getRequestHandler();
  await app.prepare();
  const server = express();

  // Init global server vars
  const discordToken = process.env.DISCORD_TOKEN;
  if (!discordToken) {
    throw new Error('Required env variable missing: DISCORD_TOKEN');
  }
  server.globals = {
    discordClient: new Client({
      intents: [Intents.FLAGS.GUILDS],
    }),
    discordRest: new REST({ version: '9' }).setToken(discordToken),
    db: await connectToDatabase(),
  };
  console.log('> Logging in discord.js client...');
  await server.globals.discordClient.login(discordToken);

  console.log('> Starting app...');
  server.all('*', (req, res) => handle(req, res));
  server.listen(settings.port, settings.hostname);
};
