import axios from "axios";

function startProject(projectName: string) {
  return axios.post(`/projects/${projectName}/watch/start`);
}

function stopProject(projectName: string) {
  return axios.post(`/projects/${projectName}/watch/stop`);
}

export { startProject, stopProject };
