import logdna, { Logger, LogOptions } from '@logdna/logger';
import apiKeys from '../constants/apiKeys';

class Log {
	static logger: Logger;

	constructor() {
		try {
			Log.logger = logdna.createLogger(apiKeys.logDNAToken, {
				app: apiKeys.logDNAAppName,
				level: apiKeys.logDNADefault,
			});
		} catch (e) {
			// eslint-disable-next-line no-console
			console.log('Please setup LogDNA token.');
			// eslint-disable-next-line no-console
			console.log(e);
		}
	}

	static info(statement: string | any, options?: Omit<LogOptions, 'level'>): void {
		if (process.env.NODE_ENV === 'development') {
			// eslint-disable-next-line no-console
			console.log(statement);
		}
		this.logger.info(statement, options);
	}

	static warn(statement: string | any, options?: Omit<LogOptions, 'level'>): void {
		if (process.env.NODE_ENV === 'development') {
			// eslint-disable-next-line no-console
			console.log(statement);
		}
		this.logger.warn(statement, options);
	}

	static debug(statement: string | any, options?: Omit<LogOptions, 'level'>): void {
		if (process.env.NODE_ENV === 'development' && process.env.LOGDNA_DEFAULT_LEVEL == 'debug') {
			// eslint-disable-next-line no-console
			console.debug(statement);
		}
		this.logger.debug(statement, options);
	}

	static error(statement: string | any, options?: Omit<LogOptions, 'level'>): void {
		if (process.env.NODE_ENV === 'development') {
			// eslint-disable-next-line no-console
			console.error(statement);
		}
		this.logger.error(statement, options);
	}

	static fatal(statement: string | any, options?: Omit<LogOptions, 'level'>): void {
		if (process.env.NODE_ENV === 'development') {
			// eslint-disable-next-line no-console
			console.error(statement);
		}
		this.logger.fatal(statement, options);
	}

	static trace(statement: string | any, options?: Omit<LogOptions, 'level'>): void {
		if (process.env.NODE_ENV === 'development') {
			// eslint-disable-next-line no-console
			console.log(statement);
		}
		this.logger.trace(statement, options);
	}

	static log(statement: string | any, options?: Omit<LogOptions, 'level'>): void {
		if (process.env.NODE_ENV === 'development') {
			// eslint-disable-next-line no-console
			console.log(statement);
		}
		this.logger.log(statement, options);
	}

	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	static addMetaProperty(key: string, value: any): void {
		this.logger.addMetaProperty(key, value);
	}

	static removeMetaProperty(key: string): void {
		this.logger.removeMetaProperty(key);
	}

	static flush(): void {
		this.logger.flush();
	}
}

export default Log;