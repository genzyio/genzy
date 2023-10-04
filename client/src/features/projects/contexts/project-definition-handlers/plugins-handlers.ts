import { type ProjectDefinition } from "../../models/project-definition.models";
import { type HandlerType } from "./types";
import { type Plugin } from "../../../model/microservices/models";
import { type Service } from "../../../model/service/models";
import { type DispatcherType, projectDefinitionActions } from "../project-definition.dispatcher";
import { type Node } from "reactflow";

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
      id: "MariaDB_{{installingOnMicroserviceId}}",
      name: "MariaDB",
      showName: true,
      type: "imageNode",
      url: "https://www.computerhope.com/jargon/d/database.png",
      width: 150,
      height: 150,

      services: [
        {
          id: "MariaDB_{{installingOnMicroserviceId}}_DBService",
          name: "DBService",
          functions: [
            {
              id: "Method1",
              name: "get",
              returnType: "int",
            } as any,
          ],
        },
      ],

      dependencies: [],
    },
  ],
  communications: [
    {
      source: "{{installingOnMicroserviceId}}",
      target: "MariaDB_{{installingOnMicroserviceId}}",
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

const installPluginHandler: HandlerType<{
  microserviceId: string;
  plugin: Plugin;
}> = (projectDefinition: ProjectDefinition, { microserviceId, plugin }) => {
  return (dispatcher: DispatcherType) => {
    const microserviceNode = findMicroserviceNode(projectDefinition, microserviceId);
    const isInstalled = microserviceNode.data.plugins.some(
      (installedPlugin) => installedPlugin.name === plugin.name
    );
    if (isInstalled) return;

    const keyValues = { installingOnMicroserviceId: microserviceId };
    const nodeMiddleX = microserviceNode.position.x + microserviceNode.width / 2;
    const nodeMiddleY = microserviceNode.position.y + microserviceNode.height / 2;

    const metadata = dbPluginMetadata;

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
      });
    }

    dispatcher(projectDefinitionActions.installPlugin, {
      microserviceId,
      plugin,
    });
  };
};

// Remove

const uninstallPluginHandler: HandlerType<{
  microserviceId: string;
  plugin: Plugin;
}> = (projectDefinition: ProjectDefinition, { microserviceId, plugin }) => {
  return (dispatcher: DispatcherType) => {
    const microserviceData = projectDefinition.microservices.nodes.find(
      (node) => node.id === microserviceId
    ).data;

    const keyValues = { installingOnMicroserviceId: microserviceId };
    const metadata = dbPluginMetadata;

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
          edge.source === formKey(source, keyValues) && edge.target === formKey(target, keyValues)
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
  };
};

export { installPluginHandler, updatePluginHandler, uninstallPluginHandler };
