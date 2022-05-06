import axios from "axios";

export async function fetchMeta(url: string) {
  return (await axios.get(`${url}/api/meta`)).data;
}