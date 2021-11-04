import { Db, MongoClient, MongoClientOptions } from 'mongodb';
import constants from '../constants/constants';

const MongoDBUtils = {
	state: {
		dbMap: new Map<string, Db>(),
		clientMap: new Map<string, MongoClient>(),
	},

	connectDb: async (database: string): Promise<Db> => {
		const db: Db | undefined = MongoDBUtils.state.dbMap.get(database);
		if (db == null) {
			const options: MongoClientOptions = {
				writeConcern: {
					w: 'majority',
				},
				useUnifiedTopology: true,
			};
			return (await MongoClient.connect(constants.MONGODB_URI_PARTIAL + database, options)).db();
		} else {
			return db;
		}
	},
};

export default MongoDBUtils;