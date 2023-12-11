import { type Project } from "../../projects/projects.models";
import { type Microservice } from "../project-definition.models";
import { removeFolder } from "../../../core/utils/fs";
import path from "path";

export function removeMicroservice(project: Project, microservice: Microservice) {
  const microservicePath = path.join(project.path, microservice.name);

  removeFolder(microservicePath);
}
