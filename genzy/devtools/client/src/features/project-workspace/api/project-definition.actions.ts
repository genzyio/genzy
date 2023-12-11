import { type SaveProjectDefinition } from "./project-definition.contracts";
import { adaptToDiagram } from "./adapters/toDiagram";
import { adaptFromDiagram } from "./adapters/fromDiagram";
import axios from "axios";

async function getProjectDefinition(projectName: string) {
  const response = await axios.get(`/projects/${projectName}/definition`);
  response.data = adaptToDiagram(response.data);

  return response;
}

function saveProjectDefinition(projectName: string) {
  return ({ projectDefinition, states }: SaveProjectDefinition) => {
    return axios.put(`/projects/${projectName}/definition`, {
      projectDefinition: adaptFromDiagram(projectDefinition),
      states,
    });
  };
}

export { getProjectDefinition, saveProjectDefinition };
