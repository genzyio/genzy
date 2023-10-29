import { type Project } from "../projects/projects.models";
import { getNextOpenPort } from "./port.utils";
import fs from "fs";
import path from "path";

const portsPerProject: Record<string, Record<string, number>> = {};

function getPorts(project: Project) {
  if (!portsPerProject[project.name]) {
    const ports = loadPorts(project);
    setPorts(project, ports);
  }

  return portsPerProject[project.name];
}

function setPorts(project: Project, ports: Record<string, number>) {
  portsPerProject[project.name] = ports;
}

async function _allocatePorts(project: Project, microserviceIds: string[]) {
  const ports = getPorts(project);

  for (const microserviceId of microserviceIds) {
    const biggestAllocatedPort = Object.values(ports).reduce((maxPort, currentPort) => {
      return Math.max(maxPort, currentPort);
    }, 2999);
    const nextPort = await getNextOpenPort(biggestAllocatedPort + 1);
    ports[microserviceId] = nextPort;
  }

  setPorts(project, ports);
}

async function _removePorts(project: Project, microserviceIds: string[]) {
  const ports = getPorts(project);

  for (const microserviceId of microserviceIds) {
    delete ports[microserviceId];
  }

  setPorts(project, ports);
}

function persistPortsAfterOperation(operations: (project: Project, microserviceIds: string[]) => any) {
  return async (project: Project, microserviceIds: string[]) => {
    await operations(project, microserviceIds);

    persistPorts(project);
  };
}

function loadPorts(project: Project) {
  const portsFilePath = path.join(project.path, "ports.json");
  const portsFileContent = fs.readFileSync(portsFilePath).toString();
  const ports = JSON.parse(portsFileContent);

  return ports;
}

function persistPorts(project: Project) {
  const portsFilePath = path.join(project.path, "ports.json");
  const ports = getPorts(project);

  fs.writeFileSync(portsFilePath, JSON.stringify(ports, null, 4));
}

const allocatePorts = persistPortsAfterOperation(_allocatePorts);
const removePorts = persistPortsAfterOperation(_removePorts);

export { getPorts, allocatePorts, removePorts };
