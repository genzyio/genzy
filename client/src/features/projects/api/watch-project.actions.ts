import axios from "axios";

function getActiveMicroservices(projectName: string) {
  return axios.get(`/projects/${projectName}/watch/active`);
}

function startProject(projectName: string) {
  return axios.post(`/projects/${projectName}/watch/start`);
}

function stopProject(projectName: string) {
  return axios.post(`/projects/${projectName}/watch/stop`);
}

export { getActiveMicroservices, startProject, stopProject };
