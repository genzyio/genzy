import { type Project } from "../../projects/projects.models";
import { type Microservice, type ProjectDefinitionData } from "../project-definition.models";
import { initMicroservice } from "../generators/initMicroservice";
import { generateMicroserviceCode } from "../generators/generateMicroserviceCode";
import { convertProjectDefinition } from "../converter/converter";

export function initializeAndGenerateMicroservice(
  project: Project,
  projectData: ProjectDefinitionData,
  microservice: Microservice,
) {
  initMicroservice(project, {
    name: microservice.name,
    version: microservice.version,
    description: microservice.description,
    basePath: microservice.basePath,
    language: microservice.language,
    plugins: microservice.plugins,
  });

  generateMicroserviceCode(
    project,
    convertProjectDefinition(project, microservice.id, projectData),
    microservice.language,
  );
}
