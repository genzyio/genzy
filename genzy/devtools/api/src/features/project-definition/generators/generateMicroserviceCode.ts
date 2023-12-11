import { type GenzyGeneratorInput } from "../converter/genzy.types";
import { type Project } from "../../projects/projects.models";
import { generateJSServer, generateTSServer } from "@genzy.io/generator";
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
