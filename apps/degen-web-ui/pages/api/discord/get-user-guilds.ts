import { Guild } from 'discord.js';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken, JWT } from 'next-auth/jwt';

const secret = process.env.SECRET;

// eslint-disable-next-line import/no-anonymous-default-export
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token: JWT = await getToken({ req, secret });

  const options = {
    headers: {
      Authorization: 'Bearer ' + token.accessToken,
    },
  };

  const guilds = await fetch('https://discord.com/api/users/@me/guilds', options);

  const data: Guild[] = await guilds.json();

  res.status(200).json(data);
}
