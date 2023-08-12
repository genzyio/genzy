import axios from "axios";
import { type ProjectDefinition } from "../models/project-definition.models";

function getProjectDefinition(projectName: string) {
  return axios.get(`/projects/${projectName}/definition`);
}

function saveProjectDefinition(projectName: string) {
  return (projectDefinition: ProjectDefinition) =>
    axios.put(`/projects/${projectName}/definition`, projectDefinition);
}

export { getProjectDefinition, saveProjectDefinition };
