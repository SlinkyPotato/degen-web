import 'reflect-metadata';
import { IsString, validateSync } from 'class-validator';

/**
 * This class is used to validate env variables. Instead of
 * using variables directly off of process.env.* pull them
 * from the AppConfig constant.
 */
export class GlobalAppConfig {
  @IsString()
  DISCORD_CLIENT_ID: string;

  @IsString()
  DISCORD_CLIENT_SECRET: string;

  @IsString()
  DISCORD_TOKEN: string;

  @IsString()
  SECRET: string;

  @IsString()
  NEXTAUTH_URL: string;

  @IsString()
  API_URL: string;

  @IsString()
  MONGODB_URI: string;

  @IsString()
  MONGODB_DB: string;

  @IsString()
  AUTH_DB: string;

  @IsString()
  TWITTER_CLIENT_ID: string;

  @IsString()
  TWITTER_CLIENT_SECRET: string;

  @IsString()
  TWITTER_BEARER_TOKEN: string;

  @IsString()
  TWITTER_ACCESS_TOKEN: string;

  @IsString()
  TWITTER_ACCESS_TOKEN_SECRET: string;

  @IsString()
  TWITTER_CALLBACK_URL: string;

  constructor(config: any) {
    Object.assign(this, config);
    const errors = validateSync(this);

    errors.forEach((error) => {
      console.error(
        `[!] The following env variable is either missing or did not pass validation: ${JSON.stringify(
          error?.constraints
        )}`
      );
    });

    if (
      process.env.NODE_ENV === 'development' &&
      Array.isArray(errors) &&
      errors.length > 0
    ) {
      throw new Error(
        'Missing environment variables, please refer to logs above to ensure required variables are set.'
      );
    }
  }
}

const config = {
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  SECRET: process.env.SECRET ?? 'localSecret',
  NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? 'http://localhost:4200',
  API_URL: process.env.API_URL ?? 'http://localhost:4200',
  MONGODB_URI: process.env.MONGODB_URI,
  MONGODB_DB: process.env.MONGODB_DB ?? 'degen',
  AUTH_DB: process.env.AUTH_DB ?? 'nextauth',
  TWITTER_CLIENT_ID: process.env.TWITTER_CLIENT_ID,
  TWITTER_CLIENT_SECRET: process.env.TWITTER_CLIENT_SECRET,
  TWITTER_BEARER_TOKEN: process.env.TWITTER_BEARER_TOKEN,
  TWITTER_ACCESS_TOKEN: process.env.TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_TOKEN_SECRET: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  TWITTER_CALLBACK_URL: process.env.TWITTER_CALLBACK_URL,
};

const testConfig = {};

/** Validated app-wide dynamic configuration object */
export const AppConfig = new GlobalAppConfig(
  process.env.NODE_ENV !== 'test' ? config : testConfig
);
