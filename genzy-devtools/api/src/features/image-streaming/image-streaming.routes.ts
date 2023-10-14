import { Router, type Request, type Response } from "express";
import axios, { type AxiosResponse } from "axios";

const imageStreamingRouters = Router();

imageStreamingRouters.get("/images", async (req: Request, res: Response) => {
  const url = req.query.url?.toString() || "";

  axios
    .get(url, {
      responseType: "stream",
    })
    .then(({ data }: AxiosResponse) => data.pipe(res))
    .catch(() => res.status(204).send());
});

export default imageStreamingRouters;
