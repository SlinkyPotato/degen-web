import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth/core/types';
import { getSession } from 'next-auth/react';

export default function ApiAuthGuard(
  handler: (
    req: NextApiRequest,
    res: NextApiResponse,
    session: Session & { user: { id: string } },
    ...other
  ) => any
) {
  return async (req: NextApiRequest, res: NextApiResponse, ...other) => {
    const session = (await getSession({ req })) as Session & { user: { id: string } };

    if (session) {
      await handler(req, res, session, ...other);
    } else {
      res.status(401);
    }
    res.end();
  };
}
