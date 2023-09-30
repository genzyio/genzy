import { type N1mblyGeneratorInput } from "../utils/converter";
import { type Project } from "../features/projects/projects.models";
import path from "path";
import { generateJSServer, generateTSServer } from "@n1mbly/cli";

function generateMicroserviceCode(project: Project, input: N1mblyGeneratorInput, lang: "ts" | "js" = "ts") {
  const { name } = input.n1mblyInfo;
  const microservicePath = path.join(project.path, name, "/src");

  switch (lang) {
    case "js":
      generateJSServer(input as any, microservicePath);
      break;
    case "ts":
      generateTSServer(input as any, microservicePath);
      break;
  }
}

export { generateMicroserviceCode };
