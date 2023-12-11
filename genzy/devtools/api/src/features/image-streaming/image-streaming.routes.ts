import { Router, type Request, type Response } from "express";
import axios, { type ResponseType } from "axios";

const imageStreamingRouters = Router();

imageStreamingRouters.get("/images", async (req: Request, res: Response) => {
  const imageUrl = req.query.url?.toString() ?? "";
  const requestConfig = { responseType: "stream" as ResponseType };

  axios
    .get(imageUrl, requestConfig)
    .then(({ data }) => data.pipe(res))
    .catch(() => res.status(204).send());
});

export default imageStreamingRouters;
