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
};

const testConfig = {};

/** Validated app-wide dynamic configuration object */
export const AppConfig = new GlobalAppConfig(
  process.env.NODE_ENV !== 'test' ? config : testConfig
);
