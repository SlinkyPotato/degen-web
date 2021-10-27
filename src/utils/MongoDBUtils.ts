import { MongoClient, MongoClientOptions } from 'mongodb';
import constants from '../constants/constants';

const MongoDBUtils = async (database: string): Promise<MongoClient> => {
	const options: MongoClientOptions = {
		w: 'majority',
		retryWrites: true,
	};
	return await MongoClient.connect(constants.MONGODB_URI_PARTIAL + database, options);
};

export default MongoDBUtils;