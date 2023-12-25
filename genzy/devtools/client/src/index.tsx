import { createRoot } from "react-dom/client";
import { Index } from "./index/index";
import { API_URL } from "./url";
import axios from "axios";

(window as any).API_URL = API_URL;
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = false;

const container = document.getElementById("app");
const root = createRoot(container);
root.render(<Index />);
