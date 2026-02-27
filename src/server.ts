import express, { Application, Request, Response } from "express";

const app: Application = express();
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.get("/location", (req: Request, res: Response) => {
    const { latitude: latStr, longitude: lngStr } = req.query;

    if (latStr === undefined || lngStr === undefined ) {
        res.status(400).json({
            error: "One or more query parameters are missing",
            required: ["latitude", "longitude"],
        });
        return;
    }

    const latitude = Number(latStr);
    const longitude = Number(lngStr);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
        res.status(400).json({
            error: "Query parameters are invalid. Values must be numbers.",
            required: ["latitude", "longitude"],
        });
        return;
    }

    res.status(200).json({
        latitude,
        longitude,
        name: "Yeah, Buddy!",
    });
});
