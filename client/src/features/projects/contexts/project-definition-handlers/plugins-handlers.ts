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
          name: "DB Service",
          functions: [
            {
              id: "Method 1",
              name: "Test",
              returnType: "int",
            } as any,
          ],
        },

        {
          id: "MariaDB2_{{installingOnMicroserviceId}}_DBService2",
          name: "DB Service2",
          functions: [
            {
              id: "Method 2",
              name: "Test",
              returnType: "int",
            } as any,
          ],
        },
      ],

      dependencies: [
        {
          source: "MariaDB_{{installingOnMicroserviceId}}_DBService",
          target: "MariaDB2_{{installingOnMicroserviceId}}_DBService2",
        },
      ],
    },

    {
      id: "Posgres_{{installingOnMicroserviceId}}",
      name: "Posgres",
      showName: true,
      type: "imageNode",
      url: "https://icon2.cleanpng.com/20180315/ifq/kisspng-postgresql-logo-computer-software-database-open-source-vector-images-5aaa26e1a38cf4.7370214515211005136699.jpg",
      width: 150,
      height: 150,

      services: [],
      dependencies: [],
    },
    {
      id: "Rabbit_{{installingOnMicroserviceId}}",
      name: "Rabbit",
      showName: true,
      type: "imageNode",
      url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANoAAADnCAMAAABPJ7iaAAAAeFBMVEX/ZgD/////aQv/YwD/jV3/XwD/WAD/8u7/nHT/XQD/y7j/tpr/VgD/WwD/UwD/+vf/o37/wKn/x7P/poP/cSb/3dD/qIf/gkn/1cX/eTj/fkH/7OT/s5b/ro//dS//bRz/0L//5dv/u6H/jFr/mW//kmT/2cv/hU7dIu50AAADwklEQVR4nO3dXVPyMBCG4S0xpZGmgOVDgYIFhf//Dy3oy+uBlN2OGbOd5z7wcCeXZToOpikll+aL5YBuNlhNnhNxz5NV28zlYi6fKYnOP+pZas3tVRAZ6wdC3Cv5ezPTbR1AdO1M2xeta/haSV5K5mb5/ZFkimkg1rmGtuesoimd8MdmnjczD2ijpC54q2jW8cqd+sT8bREVdUDalvFp/Mpwpzr+yJdwtHnKXgb5J97QKZ9GebD7JFWWvwxz4A1d8j8IZBfBaCfBMsjxhgo+CGRWwWg7wTIoH3NmDtk3kYstGK3lD4bONMlVIwsaaKCBBhpooIEGGmigxUZjzQQNNNBAAw000EADDTTQQAMNNNBAA00ZLQUNNNBAAw000EADLQzNgwYaaKCBBhpooIEGGmigaabxHvICDTTQQAMNNB003jJAAw000EDrFY33T6iaefqNZGZwmmede7IXnKTS0NZR0OwbZ+ZAcoQJ2SoKGuX1/ZGV6KI1l20YBY3s3Y/PVHSQSpPZsR7TDE6jtP3kq/W76Pb4abPM45AC08jZt81otGmq/rVoKsvJZJJtc8EpSP/z7pD9WptjV1rzobTO3kh0A/meuTWxQ95Mu9LiLz31lkZ21Vsa+aq3NCrGvaW5fW9p5qG3NJr1lzYATWGgaQw0jYGmMdA0BprGQNMYaBoDTWOgaQw0jYGmMdA0BprGQNMYaBoDTWOgaSwu2s09aF12tUVEM94dFqMfWzw4L9bFQ0uXrW/SPZ6kW0hjoRl79xXBRyO7cJHQzIyx/Xi8Fe2QjYNmdoytxE07yXWLg5Yzn2IQPdESBc1teLIkGQkeIYiCxjtZ4ZIymhW8h7vk30lioHnBq+GP/IesYqBJnqkRvB44ChpfJnmpszoa/z4CWtBAA+0aaEEDDbRroAUNNNCugRY00EC7BlrQQAPtmjpaf7+HHOv6HtIf+bS5rqtmF3xapes7f8nRboKpUdBc+yFP35oKjoyLgkaeeZDWWHL4WBw088KjrfT9L5vskiM7KdyB0Nh29T3YeiY7fSwWGpk8a92GsM5y4VamaGjNhctn5fTxx6blTH5gXES0824m5/wPOddla11UtN8NNI2BpjHQNAaaxkDTGGgaA01joGkMNI2BpjHQNAaaxkDTGGgaA01joGkMNI2BprEB7f56CaHa0aHzi+7izhxo1OnlhPFnRzQs/noRYSqGlGTCN5zqyGUJCU/MUdL5tKCGNp717rq58wlPdN6RV+XOmt5kXX554/GFloyfyveHnvRePn5uZf4AhbVjkBQU2eYAAAAASUVORK5CYII=",
      width: 150,
      height: 150,

      services: [],
      dependencies: [],
    },
  ],
  communications: [
    {
      source: "{{installingOnMicroserviceId}}",
      target: "MariaDB_{{installingOnMicroserviceId}}",
    },

    {
      source: "{{installingOnMicroserviceId}}",
      target: "Posgres_{{installingOnMicroserviceId}}",
    },

    {
      source: "{{installingOnMicroserviceId}}",
      target: "Rabbit_{{installingOnMicroserviceId}}",
    },
  ],
};

const dbPluginMetadataPerProject: PluginMetadata = {
  microservices: [
    {
      id: "MariaDB",
      name: "MariaDB",
      showName: true,
      type: "imageNode",
      url: "https://www.computerhope.com/jargon/d/database.png",
      width: 150,
      height: 150,

      services: [
        {
          id: "MariaDB_{{installingOnMicroserviceId}}_DBService",
          name: "DB Service",
          functions: [
            {
              id: "Method 1",
              name: "Test",
              returnType: "int",
            } as any,
          ],
        },

        {
          id: "MariaDB2_{{installingOnMicroserviceId}}_DBService2",
          name: "DB Service2",
          functions: [
            {
              id: "Method 2",
              name: "Test",
              returnType: "int",
            } as any,
          ],
        },
      ],

      dependencies: [
        {
          source: "MariaDB_{{installingOnMicroserviceId}}_DBService",
          target: "MariaDB2_{{installingOnMicroserviceId}}_DBService2",
        },
      ],
    },

    {
      id: "Posgres",
      name: "Posgres",
      showName: true,
      type: "imageNode",
      url: "https://icon2.cleanpng.com/20180315/ifq/kisspng-postgresql-logo-computer-software-database-open-source-vector-images-5aaa26e1a38cf4.7370214515211005136699.jpg",
      width: 150,
      height: 150,

      services: [],
      dependencies: [],
    },
    {
      id: "Rabbit",
      name: "Rabbit",
      showName: true,
      type: "imageNode",
      url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANoAAADnCAMAAABPJ7iaAAAAeFBMVEX/ZgD/////aQv/YwD/jV3/XwD/WAD/8u7/nHT/XQD/y7j/tpr/VgD/WwD/UwD/+vf/o37/wKn/x7P/poP/cSb/3dD/qIf/gkn/1cX/eTj/fkH/7OT/s5b/ro//dS//bRz/0L//5dv/u6H/jFr/mW//kmT/2cv/hU7dIu50AAADwklEQVR4nO3dXVPyMBCG4S0xpZGmgOVDgYIFhf//Dy3oy+uBlN2OGbOd5z7wcCeXZToOpikll+aL5YBuNlhNnhNxz5NV28zlYi6fKYnOP+pZas3tVRAZ6wdC3Cv5ezPTbR1AdO1M2xeta/haSV5K5mb5/ZFkimkg1rmGtuesoimd8MdmnjczD2ijpC54q2jW8cqd+sT8bREVdUDalvFp/Mpwpzr+yJdwtHnKXgb5J97QKZ9GebD7JFWWvwxz4A1d8j8IZBfBaCfBMsjxhgo+CGRWwWg7wTIoH3NmDtk3kYstGK3lD4bONMlVIwsaaKCBBhpooIEGGmigxUZjzQQNNNBAAw000EADDTTQQAMNNNBAA00ZLQUNNNBAAw000EADLQzNgwYaaKCBBhpooIEGGmigaabxHvICDTTQQAMNNB003jJAAw000EDrFY33T6iaefqNZGZwmmede7IXnKTS0NZR0OwbZ+ZAcoQJ2SoKGuX1/ZGV6KI1l20YBY3s3Y/PVHSQSpPZsR7TDE6jtP3kq/W76Pb4abPM45AC08jZt81otGmq/rVoKsvJZJJtc8EpSP/z7pD9WptjV1rzobTO3kh0A/meuTWxQ95Mu9LiLz31lkZ21Vsa+aq3NCrGvaW5fW9p5qG3NJr1lzYATWGgaQw0jYGmMdA0BprGQNMYaBoDTWOgaQw0jYGmMdA0BprGQNMYaBoDTWOgaSwu2s09aF12tUVEM94dFqMfWzw4L9bFQ0uXrW/SPZ6kW0hjoRl79xXBRyO7cJHQzIyx/Xi8Fe2QjYNmdoytxE07yXWLg5Yzn2IQPdESBc1teLIkGQkeIYiCxjtZ4ZIymhW8h7vk30lioHnBq+GP/IesYqBJnqkRvB44ChpfJnmpszoa/z4CWtBAA+0aaEEDDbRroAUNNNCugRY00EC7BlrQQAPtmjpaf7+HHOv6HtIf+bS5rqtmF3xapes7f8nRboKpUdBc+yFP35oKjoyLgkaeeZDWWHL4WBw088KjrfT9L5vskiM7KdyB0Nh29T3YeiY7fSwWGpk8a92GsM5y4VamaGjNhctn5fTxx6blTH5gXES0824m5/wPOddla11UtN8NNI2BpjHQNAaaxkDTGGgaA01joGkMNI2BpjHQNAaaxkDTGGgaA01joGkMNI2BprEB7f56CaHa0aHzi+7izhxo1OnlhPFnRzQs/noRYSqGlGTCN5zqyGUJCU/MUdL5tKCGNp717rq58wlPdN6RV+XOmt5kXX554/GFloyfyveHnvRePn5uZf4AhbVjkBQU2eYAAAAASUVORK5CYII=",
      width: 150,
      height: 150,

      services: [],
      dependencies: [],
    },
    {
      id: "Rabbit2",
      name: "Rabbit",
      showName: true,
      type: "imageNode",
      url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANoAAADnCAMAAABPJ7iaAAAAeFBMVEX/ZgD/////aQv/YwD/jV3/XwD/WAD/8u7/nHT/XQD/y7j/tpr/VgD/WwD/UwD/+vf/o37/wKn/x7P/poP/cSb/3dD/qIf/gkn/1cX/eTj/fkH/7OT/s5b/ro//dS//bRz/0L//5dv/u6H/jFr/mW//kmT/2cv/hU7dIu50AAADwklEQVR4nO3dXVPyMBCG4S0xpZGmgOVDgYIFhf//Dy3oy+uBlN2OGbOd5z7wcCeXZToOpikll+aL5YBuNlhNnhNxz5NV28zlYi6fKYnOP+pZas3tVRAZ6wdC3Cv5ezPTbR1AdO1M2xeta/haSV5K5mb5/ZFkimkg1rmGtuesoimd8MdmnjczD2ijpC54q2jW8cqd+sT8bREVdUDalvFp/Mpwpzr+yJdwtHnKXgb5J97QKZ9GebD7JFWWvwxz4A1d8j8IZBfBaCfBMsjxhgo+CGRWwWg7wTIoH3NmDtk3kYstGK3lD4bONMlVIwsaaKCBBhpooIEGGmigxUZjzQQNNNBAAw000EADDTTQQAMNNNBAA00ZLQUNNNBAAw000EADLQzNgwYaaKCBBhpooIEGGmigaabxHvICDTTQQAMNNB003jJAAw000EDrFY33T6iaefqNZGZwmmede7IXnKTS0NZR0OwbZ+ZAcoQJ2SoKGuX1/ZGV6KI1l20YBY3s3Y/PVHSQSpPZsR7TDE6jtP3kq/W76Pb4abPM45AC08jZt81otGmq/rVoKsvJZJJtc8EpSP/z7pD9WptjV1rzobTO3kh0A/meuTWxQ95Mu9LiLz31lkZ21Vsa+aq3NCrGvaW5fW9p5qG3NJr1lzYATWGgaQw0jYGmMdA0BprGQNMYaBoDTWOgaQw0jYGmMdA0BprGQNMYaBoDTWOgaSwu2s09aF12tUVEM94dFqMfWzw4L9bFQ0uXrW/SPZ6kW0hjoRl79xXBRyO7cJHQzIyx/Xi8Fe2QjYNmdoytxE07yXWLg5Yzn2IQPdESBc1teLIkGQkeIYiCxjtZ4ZIymhW8h7vk30lioHnBq+GP/IesYqBJnqkRvB44ChpfJnmpszoa/z4CWtBAA+0aaEEDDbRroAUNNNCugRY00EC7BlrQQAPtmjpaf7+HHOv6HtIf+bS5rqtmF3xapes7f8nRboKpUdBc+yFP35oKjoyLgkaeeZDWWHL4WBw088KjrfT9L5vskiM7KdyB0Nh29T3YeiY7fSwWGpk8a92GsM5y4VamaGjNhctn5fTxx6blTH5gXES0824m5/wPOddla11UtN8NNI2BpjHQNAaaxkDTGGgaA01joGkMNI2BpjHQNAaaxkDTGGgaA01joGkMNI2BprEB7f56CaHa0aHzi+7izhxo1OnlhPFnRzQs/noRYSqGlGTCN5zqyGUJCU/MUdL5tKCGNp717rq58wlPdN6RV+XOmt5kXX554/GFloyfyveHnvRePn5uZf4AhbVjkBQU2eYAAAAASUVORK5CYII=",
      width: 150,
      height: 150,

      services: [],
      dependencies: [],
    },
  ],
  communications: [
    {
      source: "{{installingOnMicroserviceId}}",
      target: "MariaDB",
    },

    {
      source: "{{installingOnMicroserviceId}}",
      target: "Posgres",
    },

    {
      source: "{{installingOnMicroserviceId}}",
      target: "Rabbit",
    },

    {
      source: "{{installingOnMicroserviceId}}",
      target: "Rabbit2",
    },
  ],
};

const dbPluginMetadataPerProject2: PluginMetadata = {
  microservices: [
    {
      id: "MariaDB",
      name: "MariaDB",
      showName: true,
      type: "imageNode",
      url: "https://www.computerhope.com/jargon/d/database.png",
      width: 150,
      height: 150,

      services: [
        {
          id: "MariaDB_{{installingOnMicroserviceId}}_DBService",
          name: "DB Service",
          functions: [
            {
              id: "Method 1",
              name: "Test",
              returnType: "int",
            } as any,
          ],
        },

        {
          id: "MariaDB2_{{installingOnMicroserviceId}}_DBService2",
          name: "DB Service2",
          functions: [
            {
              id: "Method 2",
              name: "Test",
              returnType: "int",
            } as any,
          ],
        },
      ],

      dependencies: [
        {
          source: "MariaDB_{{installingOnMicroserviceId}}_DBService",
          target: "MariaDB2_{{installingOnMicroserviceId}}_DBService2",
        },
      ],
    },

    {
      id: "Posgres",
      name: "Posgres",
      showName: true,
      type: "imageNode",
      url: "https://icon2.cleanpng.com/20180315/ifq/kisspng-postgresql-logo-computer-software-database-open-source-vector-images-5aaa26e1a38cf4.7370214515211005136699.jpg",
      width: 150,
      height: 150,

      services: [],
      dependencies: [],
    },
    {
      id: "Rabbit",
      name: "Rabbit",
      showName: true,
      type: "imageNode",
      url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANoAAADnCAMAAABPJ7iaAAAAeFBMVEX/ZgD/////aQv/YwD/jV3/XwD/WAD/8u7/nHT/XQD/y7j/tpr/VgD/WwD/UwD/+vf/o37/wKn/x7P/poP/cSb/3dD/qIf/gkn/1cX/eTj/fkH/7OT/s5b/ro//dS//bRz/0L//5dv/u6H/jFr/mW//kmT/2cv/hU7dIu50AAADwklEQVR4nO3dXVPyMBCG4S0xpZGmgOVDgYIFhf//Dy3oy+uBlN2OGbOd5z7wcCeXZToOpikll+aL5YBuNlhNnhNxz5NV28zlYi6fKYnOP+pZas3tVRAZ6wdC3Cv5ezPTbR1AdO1M2xeta/haSV5K5mb5/ZFkimkg1rmGtuesoimd8MdmnjczD2ijpC54q2jW8cqd+sT8bREVdUDalvFp/Mpwpzr+yJdwtHnKXgb5J97QKZ9GebD7JFWWvwxz4A1d8j8IZBfBaCfBMsjxhgo+CGRWwWg7wTIoH3NmDtk3kYstGK3lD4bONMlVIwsaaKCBBhpooIEGGmigxUZjzQQNNNBAAw000EADDTTQQAMNNNBAA00ZLQUNNNBAAw000EADLQzNgwYaaKCBBhpooIEGGmigaabxHvICDTTQQAMNNB003jJAAw000EDrFY33T6iaefqNZGZwmmede7IXnKTS0NZR0OwbZ+ZAcoQJ2SoKGuX1/ZGV6KI1l20YBY3s3Y/PVHSQSpPZsR7TDE6jtP3kq/W76Pb4abPM45AC08jZt81otGmq/rVoKsvJZJJtc8EpSP/z7pD9WptjV1rzobTO3kh0A/meuTWxQ95Mu9LiLz31lkZ21Vsa+aq3NCrGvaW5fW9p5qG3NJr1lzYATWGgaQw0jYGmMdA0BprGQNMYaBoDTWOgaQw0jYGmMdA0BprGQNMYaBoDTWOgaSwu2s09aF12tUVEM94dFqMfWzw4L9bFQ0uXrW/SPZ6kW0hjoRl79xXBRyO7cJHQzIyx/Xi8Fe2QjYNmdoytxE07yXWLg5Yzn2IQPdESBc1teLIkGQkeIYiCxjtZ4ZIymhW8h7vk30lioHnBq+GP/IesYqBJnqkRvB44ChpfJnmpszoa/z4CWtBAA+0aaEEDDbRroAUNNNCugRY00EC7BlrQQAPtmjpaf7+HHOv6HtIf+bS5rqtmF3xapes7f8nRboKpUdBc+yFP35oKjoyLgkaeeZDWWHL4WBw088KjrfT9L5vskiM7KdyB0Nh29T3YeiY7fSwWGpk8a92GsM5y4VamaGjNhctn5fTxx6blTH5gXES0824m5/wPOddla11UtN8NNI2BpjHQNAaaxkDTGGgaA01joGkMNI2BpjHQNAaaxkDTGGgaA01joGkMNI2BprEB7f56CaHa0aHzi+7izhxo1OnlhPFnRzQs/noRYSqGlGTCN5zqyGUJCU/MUdL5tKCGNp717rq58wlPdN6RV+XOmt5kXX554/GFloyfyveHnvRePn5uZf4AhbVjkBQU2eYAAAAASUVORK5CYII=",
      width: 150,
      height: 150,

      services: [],
      dependencies: [],
    },
  ],
  communications: [
    {
      source: "{{installingOnMicroserviceId}}",
      target: "MariaDB",
    },

    {
      source: "{{installingOnMicroserviceId}}",
      target: "Posgres",
    },

    {
      source: "{{installingOnMicroserviceId}}",
      target: "Rabbit",
    },
  ],
};

let i = 0;

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
    // const metadata = i === 0 ? dbPluginMetadataPerProject2 : dbPluginMetadataPerProject;
    i++;

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
