import { Router, type Request, type Response } from "express";
import { getScreenshot, uploadScreenshot } from "./screenshots-storage";

const projectScreenshotsRouters = Router();

projectScreenshotsRouters.get("/projects/:name/screenshot", async (req: Request, res: Response) => {
  const projectName = req.params.name || "";
  await getScreenshot(projectName)
    .then((screenshot) => screenshot.pipe(res))
    .catch(() => res.status(204).send());
});

projectScreenshotsRouters.post("/projects/:name/screenshot", async (req: Request, res: Response) => {
  await uploadScreenshot(req, res)
    .then(() => res.status(200).send())
    .catch((err) => res.send(err));
});

export default projectScreenshotsRouters;
