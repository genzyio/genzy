import express from "express";
import type { Express, Request, Response } from "express";
import { config } from "./config";

const app: Express = express();

app.use(express.json());

app.get("/api/test", async (req: Request, res: Response) => {
  res.send({
    "name": "GN1mbly API"
  });
});


app.listen(config.port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${config.port}`);
});
