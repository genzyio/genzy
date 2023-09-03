import { createRoot } from "react-dom/client";
import { ToastContainer, type ToastContainerProps } from "react-toastify";
import { QueryClient, QueryClientProvider } from "react-query";
import { API_URL } from "./url";
import axios from "axios";

import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProjectsModal } from "./projects-modal";
import { ProjectWorkspace } from "./project-workspace";

const toastrOptions: ToastContainerProps = {
  position: "bottom-right",
  autoClose: 5000,
  hideProgressBar: true,
  newestOnTop: false,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = false;

const container = document.getElementById("app");
const root = createRoot(container);
root.render(
  <>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/projects/:projectName" element={<ProjectWorkspace />} />
          <Route path="/" element={<ProjectsModal />} />
          <Route path="*" element={<ProjectsModal />} />
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>

    <ToastContainer {...toastrOptions} />
  </>
);
