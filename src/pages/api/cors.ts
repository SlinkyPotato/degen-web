import Cors from 'cors';

const cors = Cors({
	methods: ['GET'],
});

const handler = async (req: any, res: any) => {
	await runMiddleware(req, res, cors);
	res.json({ message: 'Hello everyone!' });
};

const runMiddleware = (req: any, res: any, fn: any) => {
	return new Promise((resolve, reject) => {
		fn(req, res, (result: any) => {
			if (result instanceof Error) {
				return reject(result);
			}
			
			return resolve(result);
		});
	});
};

export default handler;
