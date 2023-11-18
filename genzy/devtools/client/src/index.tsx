import { createRoot } from "react-dom/client";
import { ToastContainer, type ToastContainerProps } from "react-toastify";
import { QueryClient, QueryClientProvider } from "react-query";
import { API_URL } from "./url";
import axios from "axios";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { ProjectsBase } from "./projects-base";
import { ProjectsModal } from "./features/projects/projects-modal";
import { ProjectWorkspace } from "./features/project-workspace/project-workspace";
import { PluginsModal } from "./features/plugins/plugins-modal";
import { PluginTabsPage, SpecificPluginPage } from "./features/plugins/components/plugins-pages";

import "react-toastify/dist/ReactToastify.css";

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

(window as any).API_URL = API_URL;
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = false;

const router = createHashRouter([
  {
    path: "/projects/:projectName",
    element: <ProjectWorkspace />,
    children: [
      {
        path: "microservices/:microserviceId/plugins",
        element: <PluginsModal />,
        children: [
          {
            path: "specific/:pluginName",
            element: <SpecificPluginPage />,
          },
          {
            path: "installed",
            element: <PluginTabsPage initialTab={"installed"} />,
          },
          {
            path: "search",
            element: <PluginTabsPage initialTab={"search"} />,
          },
          {
            path: "",
            element: <PluginTabsPage initialTab={"search"} />,
          },
          {
            path: "*",
            element: <PluginTabsPage initialTab={"search"} />,
          },
        ],
      },
    ],
  },
  {
    path: "/projects",
    element: <ProjectsModal />,
  },
  {
    path: "/",
    element: <ProjectsBase />,
  },
  {
    path: "*",
    element: <ProjectsBase />,
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
