import { type Project } from "../../projects/projects.models";
import { type ProjectDefinitionData, type Microservice } from "../project-definition.models";
import { initMicroservice } from "../generators/initMicroservice";
import { reinitializeMicroservicePackageJson } from "../generators/reinitializeMicroservice";
import { generateMicroserviceCode } from "../generators/generateMicroserviceCode";
import { convertProjectDefinition } from "../converter/converter";
import path from "path";
import fs from "fs";

export function reinitializeAndGenerateMicroservice(
  project: Project,
  newProjectData: ProjectDefinitionData,
  newMicroservice: Microservice,
  oldMicroservice: Microservice,
) {
  if (oldMicroservice.name !== newMicroservice.name) {
    const newPath = path.join(project.path, newMicroservice.name);
    const oldPath = path.join(project.path, oldMicroservice.name);
    fs.existsSync(oldPath) && fs.renameSync(oldPath, newPath);
  }

  const microservicePath = path.join(project.path, newMicroservice.name);
  if (!fs.existsSync(microservicePath)) {
    initMicroservice(project, newMicroservice);
  } else {
    reinitializeMicroservicePackageJson(project, oldMicroservice, newMicroservice);
  }

  generateMicroserviceCode(
    project,
    convertProjectDefinition(project, newMicroservice.id, newProjectData),
    newMicroservice.language,
  );
}
