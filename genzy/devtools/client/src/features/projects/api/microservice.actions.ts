import axios from "axios";

function getMicroservicePort(projectName: string, microserviceId: string) {
  return axios.get(`/projects/${projectName}/microservices/${microserviceId}/port`);
}

export { getMicroservicePort };
