import axios from "axios";

function getPlugins(search: string, count: number) {
  return axios.get(`https://registry.npmjs.com/-/v1/search?text=${search}&size=${count}`);
}

export { getPlugins };
