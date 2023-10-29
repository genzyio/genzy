import { type GenzyGeneratorInput } from "../utils/converter";
import { type Project } from "../features/projects/projects.models";
import { generateJSServer, generateTSServer } from "@genzy.io/cli";
import path from "path";

function generateMicroserviceCode(project: Project, input: GenzyGeneratorInput, lang: "ts" | "js" = "ts") {
  const { name } = input.genzyInfo;
  const microservicePath = path.join(project.path, name, "/src");

  const generateMethod = lang === "js" ? generateJSServer : generateTSServer;
  generateMethod(input as any, microservicePath)
    .then(() => {})
    .catch(() => {});
}

export { generateMicroserviceCode };
