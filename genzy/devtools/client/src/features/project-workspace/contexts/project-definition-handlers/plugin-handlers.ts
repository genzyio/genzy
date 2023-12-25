import { type ProjectDefinition } from "../../models/project-definition.models";
import { type HandlerType } from "./types";
import { type Plugin } from "../../../diagrams/microservices/models";
import { type Service } from "../../../diagrams/service/models";
import { type DispatcherType, projectDefinitionActions } from "../project-definition.dispatcher";
import { type Node } from "reactflow";
import axios from "axios";

function formKey(key: string, values: Record<string, string>) {
  return Object.entries(values).reduce((formattedKey: string, [name, value]: [string, string]) => {
    return formattedKey.replace(`{{${name}}}`, value);
  }, key);
}
// Add

type PlugableService = Pick<Service, "name" | "functions"> & { id: string };
type Dependency = { source: string; target: string };

type PluginMicroservice = {
  id: string;
  name: string;
  type: string;

  services: PlugableService[];
  dependencies: Dependency[];
};

type ImageMicroservice = PluginMicroservice & {
  showName?: boolean;
  url: string;
  width: number;
  height: number;
};

type MicroserviceCommunication = {
  source: string;
  target: string;
};

type PluginMetadata = {
  microservices: ImageMicroservice[];
  communications: MicroserviceCommunication[];
};

const dbPluginMetadata: PluginMetadata = {
  microservices: [
    {
      id: "Redis_{{installingOnMicroserviceId}}",
      name: "Redis",
      showName: true,
      type: "imageNode",
      url: "https://w7.pngwing.com/pngs/230/99/png-transparent-redis-original-wordmark-logo-icon.png",
      width: 150,
      height: 150,
      services: [
        {
          id: "Redis_{{installingOnMicroserviceId}}_RedisService",
          name: "RedisService",
          functions: [
            {
              id: "Redis_Get",
              name: "get",
              returnType: "int",
            } as any,
            {
              id: "Redis_Set",
              name: "set",
              returnType: "int",
            } as any,
            {
              id: "Redis_Delete",
              name: "delete",
              returnType: "int",
            } as any,
          ],
        },
        {
          id: "Redis_{{installingOnMicroserviceId}}_RedisService2",
          name: "RedisService2",
          functions: [
            {
              id: "Redis_Get",
              name: "get",
              returnType: "int",
            } as any,
            {
              id: "Redis_Set",
              name: "set",
              returnType: "int",
            } as any,
            {
              id: "Redis_Delete",
              name: "delete",
              returnType: "int",
            } as any,
          ],
        },
      ],
      dependencies: [
        {
          source: "Redis_{{installingOnMicroserviceId}}_RedisService",
          target: "Redis_{{installingOnMicroserviceId}}_RedisService2",
        },
      ],
    },
  ],
  communications: [
    {
      source: "{{installingOnMicroserviceId}}",
      target: "Redis_{{installingOnMicroserviceId}}",
    },
  ],
};

const findMicroserviceNode = (projectDefinition: ProjectDefinition, microserviceId: string) =>
  projectDefinition.microservices.nodes.find((node) => node.id === microserviceId);

const findServiceNode = (
  projectDefinition: ProjectDefinition,
  microserviceId: string,
  serviceId: string
) => {
  const serviceDiagram = projectDefinition.services[microserviceId];
  return serviceDiagram.nodes.find((node) => node.id === serviceId);
};

const findSourceAndTargetHandles = (firstNode: Node<any>, secondNode: Node<any>) => {
  const sourceHandle = firstNode.position.y < secondNode.position.y ? "bottom" : "top";
  const targetHandle = firstNode.position.y < secondNode.position.y ? "top" : "bottom";
  return [sourceHandle, targetHandle];
};

function getPackageJson(plugin: Plugin) {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://www.npmjs.com/package/${plugin.name}/v/${plugin.version}/index`)
      .then((response) => {
        const files = response.data?.files;
        const pluginJsonHex = files["/package.json"]?.hex;
        if (!pluginJsonHex) {
          reject();
          return;
        }

        axios
          .get(`https://www.npmjs.com/package/${plugin.name}/file/${pluginJsonHex}`)
          .then((response) => resolve(response.data))
          .catch((error) => reject(error));
      })
      .catch((error) => reject(error));
  });
}

// TODO: Add genzy plugins and remove (g)n1mbly from here.
function getMetadata(plugin: Plugin, packageJson: any) {
  if (plugin.name === "genzy-redis-plugin" || plugin.name === "n1mbly-redis-plugin") {
    return packageJson.genzyMetadata || packageJson.gn1mblyMetadata || dbPluginMetadata;
  }

  return {
    microservices: [],
    communications: [],
  };
}

const installPluginHandler: HandlerType<{
  microserviceId: string;
  plugin: Plugin;
}> = (projectDefinition: ProjectDefinition, { microserviceId, plugin }) => {
  return async (dispatcher: DispatcherType) => {
    const microserviceNode = findMicroserviceNode(projectDefinition, microserviceId);
    const isInstalled = microserviceNode.data.plugins.some(
      (installedPlugin) => installedPlugin.name === plugin.name
    );
    if (isInstalled) return;

    const keyValues = { installingOnMicroserviceId: microserviceId };
    const nodeMiddleX = microserviceNode.position.x + microserviceNode.width / 2;
    const nodeMiddleY = microserviceNode.position.y + microserviceNode.height / 2;

    const packageJson = await getPackageJson(plugin);
    const metadata = getMetadata(plugin, packageJson);

    metadata.microservices
      .filter((pluginMicroservice) =>
        projectDefinition.microservices.nodes.every(
          (node) => node.id !== formKey(pluginMicroservice.id, keyValues)
        )
      )
      .forEach((pluginMicroservice, i, pluginMicroservicesToInstall) => {
        const degreesBetweenMS = 360 / pluginMicroservicesToInstall.length;
        const degrees = -90 + i * degreesBetweenMS;
        const radians = (degrees * Math.PI) / 180;
        const sin = Math.sin(radians);
        const cos = Math.cos(radians);

        projectDefinition.microservices.nodes.push({
          id: formKey(pluginMicroservice.id, keyValues),
          position: {
            x: nodeMiddleX + 400 * cos - pluginMicroservice.width / 2,
            y: nodeMiddleY + 400 * sin,
          },
          width: pluginMicroservice.width,
          height: pluginMicroservice.height,
          data: {
            name: pluginMicroservice.name,
            showName: pluginMicroservice.showName,
            url: pluginMicroservice.url,
            width: pluginMicroservice.width,
            height: pluginMicroservice.height,
            services: [],
          },
          type: pluginMicroservice.type,
        } as any);
      });

    const pluginMicroserviceServices = metadata.microservices.flatMap(
      (pluginMicroservice) => pluginMicroservice.services
    );
    for (const plugableService of pluginMicroserviceServices) {
      await dispatcher(projectDefinitionActions.addPlugableService, {
        serviceId: formKey(plugableService.id, keyValues),
        microserviceId,
        plugin: plugin.name,
        service: { name: plugableService.name, functions: plugableService.functions },
      });
    }
    const pluginMicroserviceDependencies = metadata.microservices.flatMap(
      (pluginMicroservice) => pluginMicroservice.dependencies
    );
    for (const dependency of pluginMicroserviceDependencies) {
      const sourceServiceNode = findServiceNode(
        projectDefinition,
        microserviceId,
        formKey(dependency.source, keyValues)
      );
      const targetServiceNode = findServiceNode(
        projectDefinition,
        microserviceId,
        formKey(dependency.target, keyValues)
      );
      const [sourceHandle, targetHandle] = findSourceAndTargetHandles(
        sourceServiceNode,
        targetServiceNode
      );

      await dispatcher(projectDefinitionActions.addDependency, {
        microserviceId,
        params: {
          removable: false,
          source: sourceServiceNode.id,
          target: targetServiceNode.id,
          sourceHandle,
          targetHandle,
        },
      });
    }

    for (const communication of metadata.communications) {
      const sourceMicroserviceNode = findMicroserviceNode(
        projectDefinition,
        formKey(communication.source, keyValues)
      );
      const targetMicroserviceNode = findMicroserviceNode(
        projectDefinition,
        formKey(communication.target, keyValues)
      );
      const [sourceHandle, targetHandle] = findSourceAndTargetHandles(
        sourceMicroserviceNode,
        targetMicroserviceNode
      );

      const newEdge = await dispatcher(projectDefinitionActions.addCommunication, {
        params: {
          removable: false,
          source: sourceMicroserviceNode.id,
          target: targetMicroserviceNode.id,
          sourceHandle,
          targetHandle,
        },
      });

      newEdge.id = newEdge.source + "_" + newEdge.target;
    }

    microserviceNode.data.plugins.push(plugin);
  };
};

// Update

const updatePluginHandler: HandlerType<{
  microserviceId: string;
  plugin: Plugin;
}> = (projectDefinition: ProjectDefinition, { microserviceId, plugin }) => {
  return async (dispatcher: DispatcherType) => {
    const microserviceData = projectDefinition.microservices.nodes.find(
      (node) => node.id === microserviceId
    ).data;
    const installedPlugin = microserviceData.plugins.find(
      (installedPlugin) => installedPlugin.name === plugin.name
    );
    if (installedPlugin) {
      await dispatcher(projectDefinitionActions.uninstallPlugin, {
        microserviceId,
        plugin: installedPlugin,
      });
    }

    await dispatcher(projectDefinitionActions.installPlugin, {
      microserviceId,
      plugin,
      dontFire: true,
    });
  };
};

// Remove

const uninstallPluginHandler: HandlerType<{
  microserviceId: string;
  plugin: Plugin;
}> = (projectDefinition: ProjectDefinition, { microserviceId, plugin }) => {
  return async (dispatcher: DispatcherType) => {
    const microserviceData = projectDefinition.microservices.nodes.find(
      (node) => node.id === microserviceId
    ).data;

    const keyValues = { installingOnMicroserviceId: microserviceId };

    const packageJson = await getPackageJson(plugin);
    const metadata = getMetadata(plugin, packageJson);

    const plugableServiceIdsToDelete = metadata.microservices
      .flatMap((pluginMicroservice) => pluginMicroservice.services)
      .map((plugableService) => formKey(plugableService.id, keyValues));

    await dispatcher(projectDefinitionActions.deleteServices, {
      microserviceId,
      serviceIds: plugableServiceIdsToDelete,
    });

    for (const { source, target } of metadata.communications) {
      const communication = projectDefinition.microservices.edges.find(
        (edge) =>
          edge.source === formKey(source, keyValues) && edge.target === formKey(target, keyValues)
      );

      await dispatcher(projectDefinitionActions.removeCommunication, {
        microserviceId,
        communicationId: communication.id,
      });
    }

    const microservicesIdsToDelete = metadata.microservices
      .map((pluginMicroservice) => {
        pluginMicroservice.id = formKey(pluginMicroservice.id, keyValues);
        return pluginMicroservice;
      })
      .filter((pluginMicroservice) =>
        projectDefinition.microservices.edges.every(
          (communication) => communication.target !== pluginMicroservice.id
        )
      );
    for (const pluginMicroservice of microservicesIdsToDelete) {
      await dispatcher(projectDefinitionActions.deleteMicroservice, {
        microserviceId: pluginMicroservice.id,
      });
    }

    microserviceData.plugins = microserviceData.plugins.filter(
      (installedPlugin) => installedPlugin.name !== plugin.name
    );
  };
};

export { installPluginHandler, updatePluginHandler, uninstallPluginHandler };
