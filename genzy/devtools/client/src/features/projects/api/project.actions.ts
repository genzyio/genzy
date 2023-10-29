import axios from "axios";
import { type ImportProject, type CreateProject } from "./project.contracts";

function getProjects() {
  return axios.get(`/projects`);
}

function getProject(projectName: string) {
  return axios.get(`/projects/${projectName}`);
}

function createProject(project: CreateProject) {
  return axios.post(`/projects`, project);
}

function importProject(project: ImportProject) {
  return axios.post(`/projects/import`, project);
}

function deleteProject({ projectName, physical }: { projectName: string; physical: boolean }) {
  return axios.delete(`/projects/${projectName}?physical=${physical}`);
}

export { getProjects, getProject, createProject, importProject, deleteProject };
