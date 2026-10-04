import 'dotenv/config';
import express, { Application, NextFunction, Request, Response } from 'express';
import { prisma } from './lib/prisma';
import { searchListings, type SearchNear } from './lib/search';

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
		console.error(error);
		res.status(503).json({
			status: 'error',
			client: true,
			api: true,
			database: false,
			error: 'Database unreachable',
		});
	}
});

const readQuery = (value: unknown): string => {
	if (typeof value === 'string') return value;
	if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
	return '';
};

app.get('/api/search', async (req: Request, res: Response) => {
	const q = readQuery(req.query.q).trim();
	const city = readQuery(req.query.city).trim();
	const latRaw = readQuery(req.query.latitude).trim();
	const lngRaw = readQuery(req.query.longitude).trim();
	const radiusRaw = readQuery(req.query.radiusMiles).trim();

	if ((latRaw && !lngRaw) || (!latRaw && lngRaw)) {
		res.status(400).json({
			error: 'One or more query parameters are missing',
			required: ['latitude', 'longitude']
		});
		return;
	}

	let near: SearchNear | undefined;
	if (latRaw && lngRaw) {
		const latitude = Number(latRaw);
		const longitude = Number(lngRaw);
		if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
			res.status(400).json({
				error: 'Query parameters are invalid. Values must be numbers.',
				required: ['latitude', 'longitude']
			});
			return;
		}

		let radiusMiles: number | undefined;
		if (radiusRaw) {
			radiusMiles = Number(radiusRaw);
			if (Number.isNaN(radiusMiles)) {
				res.status(400).json({
					error: 'Query parameters are invalid. Values must be numbers.',
					required: ['radiusMiles']
				});
				return;
			}
		}

		near = { latitude, longitude, radiusMiles };
	}

	try {
		const results = await searchListings({ q, city, near });
		res.status(200).json(results);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Search failed' });
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

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
	console.error(err);
	if (res.headersSent) return;
	res.status(500).json({ error: 'Something went wrong' });
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
