import axios from "axios";

function getDefaultProject() {
  return axios.get(`/preferences/projects/default`);
}

export { getDefaultProject };
