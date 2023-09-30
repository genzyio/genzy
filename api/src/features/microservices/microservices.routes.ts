import { Router, type Request, type Response } from "express";
import { projectDoesNotExistError } from "../projects/projects.errors";
import { projectsRepo } from "../projects/projects.repo";
import { allocatePorts, getPorts } from "../watch-project/ports.manager";

const microserviceRouters = Router();

microserviceRouters.get("/projects/:name/microservices/:microserviceId/port", async (req: Request, res: Response) => {
  const projectName = req.params.name || "";
  const existingProject = await projectsRepo.getByName(projectName);
  if (!existingProject) {
    return res.status(404).send(projectDoesNotExistError(projectName));
  }

  const microserviceId = req.params.microserviceId || "";
  const ports = getPorts(existingProject);
  if (!ports[microserviceId]) {
    await allocatePorts(existingProject, [microserviceId]);
  }

  const port = ports[microserviceId];
  return res.status(200).send({ port });
});

export default microserviceRouters;
