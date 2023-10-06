import { type N1mblyGeneratorInput } from "../utils/converter";
import { type Project } from "../features/projects/projects.models";
import { generateJSServer, generateTSServer } from "@n1mbly/cli";
import path from "path";

function generateMicroserviceCode(project: Project, input: N1mblyGeneratorInput, lang: "ts" | "js" = "ts") {
  const { name } = input.n1mblyInfo;
  const microservicePath = path.join(project.path, name, "/src");

  const generateMethod = lang === "js" ? generateJSServer : generateTSServer;
  generateMethod(input as any, microservicePath)
    .then(() => {})
    .catch(() => {});
}

export { generateMicroserviceCode };
