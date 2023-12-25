import { type FC } from "react";
import { createHashRouter, RouterProvider as ReactRouterProvider } from "react-router-dom";
import { ProjectsBase } from "../projects-base";
import { ProjectsModal } from "@features/projects/projects-modal";
import { ProjectWorkspace } from "@features/project-workspace/project-workspace";
import { PluginsModal } from "@features/plugins/plugins-modal";
import { PluginTabsPage, SpecificPluginPage } from "@features/plugins/components/plugins-pages";

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

export const RouterProvider: FC = () => {
  return <ReactRouterProvider router={router} />;
};
