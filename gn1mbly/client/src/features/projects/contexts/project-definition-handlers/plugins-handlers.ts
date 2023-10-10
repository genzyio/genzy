import { type ProjectDefinition } from "../../models/project-definition.models";
import { type HandlerType } from "./types";
import { type Plugin } from "../../../model/microservices/models";
import { type Service } from "../../../model/service/models";
import { type DispatcherType, projectDefinitionActions } from "../project-definition.dispatcher";
import { type Node } from "reactflow";
import { Events, eventEmitter } from "../../../plugins/events/plugin.events";
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
  return new Promise(async (resolve, reject) => {
    await axios
      .get(`https://www.npmjs.com/package/${plugin.name}/v/${plugin.version}/index`)
      .then(async (response) => {
        const files = response.data?.files;
        const pluginJsonHex = files["/package.json"]?.hex;
        if (!pluginJsonHex) {
          reject();
          return;
        }

        await axios
          .get(`https://www.npmjs.com/package/${plugin.name}/file/${pluginJsonHex}`)
          .then((response) => resolve(response.data))
          .catch((error) => reject(error));
      })
      .catch((error) => reject(error));
  });
}

function getMetadata(plugin: Plugin, packageJson: any) {
  if (plugin.name === "n1mbly-redis-plugin") {
    return packageJson.gn1mblyMetadata || dbPluginMetadata;
  }

  return {
    microservices: [],
    communications: [],
  };
}

const installPluginHandler: HandlerType<{
  microserviceId: string;
  plugin: Plugin;
  dontFire: boolean;
}> = (projectDefinition: ProjectDefinition, { microserviceId, plugin, dontFire }) => {
  return (dispatcher: DispatcherType) => {
    const microserviceNode = findMicroserviceNode(projectDefinition, microserviceId);
    const isInstalled = microserviceNode.data.plugins.some(
      (installedPlugin) => installedPlugin.name === plugin.name
    );
    if (isInstalled) return;

    const keyValues = { installingOnMicroserviceId: microserviceId };
    const nodeMiddleX = microserviceNode.position.x + microserviceNode.width / 2;
    const nodeMiddleY = microserviceNode.position.y + microserviceNode.height / 2;

    getPackageJson(plugin)
      .then((packageJson: any) => {
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

        metadata.microservices
          .flatMap((pluginMicroservice) => pluginMicroservice.services)
          .forEach((plugableService) => {
            dispatcher(projectDefinitionActions.addPlugableService, {
              serviceId: formKey(plugableService.id, keyValues),
              microserviceId,
              plugin: plugin.name,
              service: { name: plugableService.name, functions: plugableService.functions },
            });
          });

        metadata.microservices
          .flatMap((pluginMicroservice) => pluginMicroservice.dependencies)
          .forEach((dependency) => {
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

            dispatcher(projectDefinitionActions.addDependency, {
              microserviceId,
              params: {
                removable: false,
                source: sourceServiceNode.id,
                target: targetServiceNode.id,
                sourceHandle,
                targetHandle,
              },
            });
          });

        metadata.communications.forEach((communication) => {
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

          const newEdge = dispatcher(projectDefinitionActions.addCommunication, {
            params: {
              removable: false,
              source: sourceMicroserviceNode.id,
              target: targetMicroserviceNode.id,
              sourceHandle,
              targetHandle,
            },
          });

          newEdge.id = newEdge.source + "_" + newEdge.target;
        });

        microserviceNode.data.plugins.push(plugin);

        !dontFire && eventEmitter.dispatch(Events.PLUGIN_INSTALLED, {});
      })
      .catch((error) => console.log(error));
  };
};

// Update

const updatePluginHandler: HandlerType<{
  microserviceId: string;
  plugin: Plugin;
}> = (projectDefinition: ProjectDefinition, { microserviceId, plugin }) => {
  return (dispatcher: DispatcherType) => {
    const microserviceData = projectDefinition.microservices.nodes.find(
      (node) => node.id === microserviceId
    ).data;
    const installedPlugin = microserviceData.plugins.find(
      (installedPlugin) => installedPlugin.name === plugin.name
    );
    if (installedPlugin) {
      dispatcher(projectDefinitionActions.uninstallPlugin, {
        microserviceId,
        plugin: installedPlugin,
        dontFire: true,
      });
    }

    setTimeout(() => {
      dispatcher(projectDefinitionActions.installPlugin, {
        microserviceId,
        plugin,
        dontFire: true,
      });
    }, 250);
  };
};

// Remove

const uninstallPluginHandler: HandlerType<{
  microserviceId: string;
  plugin: Plugin;
  dontFire: boolean;
}> = (projectDefinition: ProjectDefinition, { microserviceId, plugin, dontFire }) => {
  return (dispatcher: DispatcherType) => {
    const microserviceData = projectDefinition.microservices.nodes.find(
      (node) => node.id === microserviceId
    ).data;

    const keyValues = { installingOnMicroserviceId: microserviceId };

    getPackageJson(plugin)
      .then((packageJson: any) => {
        const metadata = getMetadata(plugin, packageJson);

        const plugableServiceIdsToDelete = metadata.microservices
          .flatMap((pluginMicroservice) => pluginMicroservice.services)
          .map((plugableService) => formKey(plugableService.id, keyValues));

        dispatcher(projectDefinitionActions.deleteServices, {
          microserviceId,
          serviceIds: plugableServiceIdsToDelete,
        });

        metadata.communications.forEach(({ source, target }) => {
          const communication = projectDefinition.microservices.edges.find(
            (edge) =>
              edge.source === formKey(source, keyValues) &&
              edge.target === formKey(target, keyValues)
          );

          dispatcher(projectDefinitionActions.removeCommunication, {
            microserviceId,
            communicationId: communication.id,
          });
        });

        metadata.microservices
          .map((pluginMicroservice) => {
            pluginMicroservice.id = formKey(pluginMicroservice.id, keyValues);
            return pluginMicroservice;
          })
          .filter((pluginMicroservice) =>
            projectDefinition.microservices.edges.every(
              (communication) => communication.target !== pluginMicroservice.id
            )
          )
          .forEach((pluginMicroservice) => {
            dispatcher(projectDefinitionActions.deleteMicroservice, {
              microserviceId: pluginMicroservice.id,
            });
          });

        microserviceData.plugins = microserviceData.plugins.filter(
          (installedPlugin) => installedPlugin.name !== plugin.name
        );

        !dontFire && eventEmitter.dispatch(Events.PLUGIN_UNINSTALLED, {});
      })
      .catch((error) => console.log(error));
  };
};

export { installPluginHandler, updatePluginHandler, uninstallPluginHandler };
