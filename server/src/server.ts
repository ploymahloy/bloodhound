import 'dotenv/config';
import express, { Application, Request, Response } from 'express';
import { prisma } from './lib/prisma';

const app: Application = express();
const PORT = Number(process.env.PORT) || 3000;

app.get('/', (_, res: Response) => {
	res.status(200).json({
		status: 'ok'
	});
});

app.get('/api/health', async (_req: Request, res: Response) => {
	try {
		await prisma.$queryRaw`SELECT 1`;
		res.status(200).json({
			status: 'ok',
			client: true,
			api: true,
			database: true,
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Database unreachable';
		res.status(503).json({
			status: 'error',
			client: true,
			api: true,
			database: false,
			error: message,
		});
	}
});

app.get('/api/location', (req: Request, res: Response) => {
	const { latitude: latStr, longitude: lngStr } = req.query;

	if (latStr === undefined || lngStr === undefined) {
		res.status(400).json({
			error: 'One or more query parameters are missing',
			required: ['latitude', 'longitude']
		});
		return;
	}

	const latitude = Number(latStr);
	const longitude = Number(lngStr);

	if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
		res.status(400).json({
			error: 'Query parameters are invalid. Values must be numbers.',
			required: ['latitude', 'longitude']
		});
		return;
	}

	res.status(200).json({
		latitude,
		longitude,
		name: 'Yeah, Buddy!'
	});
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
