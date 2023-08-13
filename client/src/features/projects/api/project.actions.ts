import axios from "axios";
import { type CreateProject } from "./project.contracts";

function getProjects() {
  return axios.get(`/projects`);
}

function getProject(projectName: string) {
  return axios.get(`/projects/${projectName}`);
}

function createProject(project: CreateProject) {
  return axios.post(`/projects`, project);
}

export { getProjects, getProject, createProject };
