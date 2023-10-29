import axios from "axios";

function getRecentlyOpenedProjects() {
  return axios.get(`/recently-opened`);
}

function modifyRecentlyOpened(projectName: string) {
  return axios.post(`/projects/${projectName}/recently-opened`);
}

function deleteRecentlyOpened(projectName: string) {
  return axios.delete(`/projects/${projectName}/recently-opened`);
}

export { getRecentlyOpenedProjects, modifyRecentlyOpened, deleteRecentlyOpened };
