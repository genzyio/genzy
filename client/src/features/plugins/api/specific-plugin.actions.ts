import axios from "axios";

function getPlugin(name: string) {
  return axios.get(`https://registry.npmjs.org/${name}`);
}

function getSpecificPluginVersion(name: string, version: string) {
  return axios.get(`https://registry.npmjs.org/${name}/${version}`);
}

export { getPlugin, getSpecificPluginVersion };
