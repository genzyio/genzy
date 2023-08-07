import { Router } from "express";
import type { Request, Response } from "express";

const testRouters = Router();

testRouters.get("/test", async (req: Request, res: Response) => {
  res.send({
    "name": "GN1mbly API"
  });
});


export default testRouters;testRouters