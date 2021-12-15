import logdna, { Logger, LogOptions } from '@logdna/logger';
import apiKeys from '../constants/apiKeys';

let logger: Logger;

try {
	logger = logdna.createLogger(apiKeys.logDNAToken, {
		app: apiKeys.logDNAAppName,
		level: apiKeys.logDNADefault,
	});
} catch (e) {
	// eslint-disable-next-line no-console
	console.log('Please setup LogDNA token.');
	// eslint-disable-next-line no-console
	console.log(e);
}

const Log = {

	info(statement: string | any, options?: Omit<LogOptions, 'level'>): void {
		if (process.env.NODE_ENV === 'development') {
			// eslint-disable-next-line no-console
			console.log(statement);
		}
		logger.info(statement, options);
	},

	warn(statement: string | any, options?: Omit<LogOptions, 'level'>): void {
		if (process.env.NODE_ENV === 'development') {
			// eslint-disable-next-line no-console
			console.log(statement);
		}
		logger.warn(statement, options);
	},

	debug(statement: string | any, options?: Omit<LogOptions, 'level'>): void {
		if (process.env.NODE_ENV === 'development' && process.env.LOGDNA_DEFAULT_LEVEL == 'debug') {
			// eslint-disable-next-line no-console
			console.debug(statement);
		}
		logger.debug(statement, options);
	},

	error(statement: string | any, options?: Omit<LogOptions, 'level'>): void {
		if (process.env.NODE_ENV === 'development') {
			// eslint-disable-next-line no-console
			console.error(statement);
		}
		logger.error(statement, options);
	},

	fatal(statement: string | any, options?: Omit<LogOptions, 'level'>): void {
		if (process.env.NODE_ENV === 'development') {
			// eslint-disable-next-line no-console
			console.error(statement);
		}
		logger.fatal(statement, options);
	},

	trace(statement: string | any, options?: Omit<LogOptions, 'level'>): void {
		if (process.env.NODE_ENV === 'development') {
			// eslint-disable-next-line no-console
			console.log(statement);
		}
		logger.trace(statement, options);
	},

	log(statement: string | any, options?: Omit<LogOptions, 'level'>): void {
		if (process.env.NODE_ENV === 'development') {
			// eslint-disable-next-line no-console
			console.log(statement);
		}
		logger.log(statement, options);
	},

	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	addMetaProperty(key: string, value: any): void {
		logger.addMetaProperty(key, value);
	},

	removeMetaProperty(key: string): void {
		logger.removeMetaProperty(key);
	},

	flush(): void {
		logger.flush();
	},
};

export default Log;