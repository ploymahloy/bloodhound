import express, { Application, Response } from "express";

const app: Application = express();
const PORT = 3000;

app.get("/", (_, res: Response) => {
    res.send("Express + TypeScript Server is running!");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
