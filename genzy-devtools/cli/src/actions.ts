import fs from "fs";
import path from "path";

function generateMicroservice(projectPath: string, lang: string, genzyStructure: any) {}

function initializeProject(projectPath: string, name: string) {
  fs.mkdirSync(projectPath);
  fs.writeFileSync(
    path.join(projectPath, "project.json"),
    JSON.stringify({
      microservices: { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } },
      services: {},
      classes: {},
    }),
  );
}

function startMicroservice(servicePath: string) {}

function stopMicroservice(servicePath: string) {}

export { generateMicroservice, initializeProject, startMicroservice, stopMicroservice };
