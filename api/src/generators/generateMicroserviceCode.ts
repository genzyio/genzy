import { type N1mblyGeneratorInput } from "../utils/converter";
import { type Project } from "../features/projects/projects.models";
import { exec } from "child_process";
import path from "path";
import fs from "fs";

function generateMicroserviceCode(project: Project, input: N1mblyGeneratorInput, lang: "ts" | "js" = "ts") {
  const { name } = input.n1mblyInfo;
  const microservicePath = path.join(project.path, name);
  const generateJsonPath = path.join(microservicePath, "generate.json");

  fs.writeFileSync(generateJsonPath, JSON.stringify(input));

  exec(`npx C:/Users/panic/source/repos/n1mbly/n1mlby-js/cli -l ${lang} -f ${generateJsonPath} -s true -o src`, {
    cwd: microservicePath,
  });
}

export { generateMicroserviceCode };
