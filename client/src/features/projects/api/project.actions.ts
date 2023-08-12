import axios from "axios";

function getProjects() {
  return axios.get(`/projects`);
}

function getProject(projectName: string) {
  return axios.get(`/projects/${projectName}`);
}

export { getProjects, getProject };
