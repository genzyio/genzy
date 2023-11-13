import axios from "axios";
import { type SaveProjectDefinition } from "../api/project.contracts";

function getProjectDefinition(projectName: string) {
  return axios.get(`/projects/${projectName}/definition`);
}

function saveProjectDefinition(projectName: string) {
  return ({ projectDefinition, states }: SaveProjectDefinition) =>
    axios.put(`/projects/${projectName}/definition`, { projectDefinition, states });
}

export { getProjectDefinition, saveProjectDefinition };
