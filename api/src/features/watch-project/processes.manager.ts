import { type Project } from "../projects/projects.models";
import { getPorts } from "./ports.manager";
import { exec } from "child_process";
import path from "path";
import terminate from "terminate";
// @ts-ignore
import findPidFromPort from "find-pid-from-port";

const pidsPerProject: Record<string, Record<string, number>> = {};

async function getPidIfPortIsTaken(port: number) {
  try {
    const pids = await findPidFromPort(port);
    return pids.tcp[0] || pids.udp[0];
  } catch (error) {
    return null;
  }
}

function startMicroservice(projectPath: string, microserviceName: string) {
  const child_process = exec(
    "npm run watch",
    {
      cwd: path.join(projectPath, microserviceName),
    },
    (e, m) => console.log(e, m),
  );
  return child_process.pid as number;
}

async function startProject(project: Project, projectDefinition: any) {
  const ports = getPorts(project);

  if (!pidsPerProject[project.name]) {
    pidsPerProject[project.name] = {};
  }

  for (const [microserviceId, port] of Object.entries(ports)) {
    console.log(microserviceId, port);
    const existingPid = await getPidIfPortIsTaken(port);
    if (existingPid) {
      pidsPerProject[project.name][microserviceId] = existingPid;
    } else {
      const projectPath = project.path;
      const microserviceName = projectDefinition.microservices.nodes.find((node: any) => node.id === microserviceId)
        .data.name;
      const newPid = startMicroservice(projectPath, microserviceName);
      pidsPerProject[project.name][microserviceId] = newPid;

      // Ovde bih mogao promeniti .env file?
    }
  }
}

async function stopProject(project: Project) {
  const pids = pidsPerProject[project.name];

  for (const pid of Object.values(pids)) {
    terminate(pid, (err: any) => console.log(err));
  }
}

export { startProject, stopProject };
