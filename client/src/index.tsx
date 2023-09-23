import { createRoot } from "react-dom/client";
import { ToastContainer, type ToastContainerProps } from "react-toastify";
import { QueryClient, QueryClientProvider } from "react-query";
import { API_URL } from "./url";
import axios from "axios";

import "react-toastify/dist/ReactToastify.css";
import { createHashRouter, RouterProvider } from "react-router-dom";
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

const router = createHashRouter([
  {
    path: "/projects/:projectName",
    element: <ProjectWorkspace />,
  },
  {
    path: "/",
    element: <ProjectsModal />,
  },
  {
    path: "*",
    element: <ProjectsModal />,
  },
]);

const container = document.getElementById("app");
const root = createRoot(container);
root.render(
  <>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>

    <ToastContainer {...toastrOptions} />
  </>
);
