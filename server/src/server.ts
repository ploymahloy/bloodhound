import 'dotenv/config';
import express, { Application, Request, Response } from 'express';
import { getRandomInt } from 'trng-crypto';

getRandomInt(1); // 2n
getRandomInt(5); // 99948n
getRandomInt(10); // 1845327456n
getRandomInt(100); // 6934718900905400457134776369343709480969619164893508370415330363170507657738911606749154352850444764n

const app: Application = express();
const PORT = Number(process.env.PORT) || 3000;

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
