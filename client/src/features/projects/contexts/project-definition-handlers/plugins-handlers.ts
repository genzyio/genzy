import { type ProjectDefinition } from "../../models/project-definition.models";
import { type HandlerType } from "./types";
import { type Plugin } from "../../../model/microservices/models";
import { DispatcherType, projectDefinitionActions } from "../project-definition.dispatcher";

// Add

// type Scope = "PerMicroservice" | "PerProject"

// type PluginMetadata = {
//   scope: Scope;
//   microserviceNodes: [{

//   }]
// }

// const dbPluginMetadata: PluginMetadata = {
//   scope: "PerMicroservice",

// }

const installPluginHandler: HandlerType<{
  microserviceId: string;
  plugin: Plugin;
}> = (projectDefinition: ProjectDefinition, { microserviceId, plugin }) => {
  return (dispatch: DispatcherType) => {
    const microserviceData = projectDefinition.microservices.nodes.find(
      (node) => node.id === microserviceId
    ).data;
    const isInstalled = microserviceData.plugins.some(
      (installedPlugin) => installedPlugin.name === plugin.name
    );
    if (isInstalled) return;

    // const microserviceId2 = `${+new Date()}`;
    // const x = {
    //   id: microserviceId2,
    //   position: { x: 0, y: 0 },
    //   data: {
    //     name: "X",
    //     url: "https://www.computerhope.com/jargon/d/database.png",
    //     width: 200,
    //     height: 200,
    //   },
    //   type: "imageNode",
    // };

    // projectDefinition.microservices.nodes.push(x as any);
    microserviceData.plugins.push(plugin);
  };
};

// Update

const updatePluginHandler: HandlerType<{
  microserviceId: string;
  plugin: Plugin;
}> = (projectDefinition: ProjectDefinition, { microserviceId, plugin }) => {
  const microserviceData = projectDefinition.microservices.nodes.find(
    (node) => node.id === microserviceId
  ).data;
  const installedPlugin = microserviceData.plugins.find(
    (installedPlugin) => installedPlugin.name === plugin.name
  );
  if (!installedPlugin) return;

  installedPlugin.version = plugin.version;
};

// Remove

const uninstallPluginHandler: HandlerType<{
  microserviceId: string;
  plugin: Plugin;
}> = (projectDefinition: ProjectDefinition, { microserviceId, plugin }) => {
  // Remove remote proxies
  const microserviceData = projectDefinition.microservices.nodes.find(
    (node) => node.id === microserviceId
  ).data;

  microserviceData.plugins = microserviceData.plugins.filter(
    (installedPlugin) => installedPlugin.name !== plugin.name
  );
};

export { installPluginHandler, updatePluginHandler, uninstallPluginHandler };
