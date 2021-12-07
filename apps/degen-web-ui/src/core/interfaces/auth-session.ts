import { Session } from 'next-auth';

export interface DiscordSession extends Session {
  accessToken?: string | null;
  user?: {
    id?: string | null;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}
