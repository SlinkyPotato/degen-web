const express = require('express');
const { Client, Intents } = require('discord.js');
const { REST } = require('@discordjs/rest');

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
  };
  console.log('> Logging in discord.js client...');
  await server.globals.discordClient.login(discordToken);

  console.log('> Starting app...');
  server.all('*', (req, res) => handle(req, res));
  server.listen(settings.port, settings.hostname);
};
