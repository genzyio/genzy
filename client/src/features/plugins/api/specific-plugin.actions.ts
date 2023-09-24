import axios from "axios";

function getSpecificPlugin(pluginName: string) {
  return axios.get(`https://registry.npmjs.org/${pluginName}`);
}

export { getSpecificPlugin };
