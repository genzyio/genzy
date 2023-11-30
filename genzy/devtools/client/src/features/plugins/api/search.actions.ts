import axios from "axios";

const PACKAGES_PER_PAGE = 7;

function getPlugins(search: string, page: number) {
  const size = PACKAGES_PER_PAGE;
  const from = size * page;

  return axios.get(
    `https://registry.npmjs.com/-/v1/search?text=${search}&from=${from}&size=${size}`
  );
}

export { getPlugins };
