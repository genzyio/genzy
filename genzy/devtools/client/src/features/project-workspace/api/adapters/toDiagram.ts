import { type AdaptedProjectDefinition } from "./fromDiagram";
import { type Node, type Edge, MarkerType } from "reactflow";
import { type ProjectDefinition } from "../../models/project-definition.models";
import { type Microservice, type Communication } from "@features/diagrams/microservices/models";
import { type Service } from "@features/diagrams/service/models";
import { type Class } from "@features/diagrams/class/models";
import { extractComplexTypes } from "../../utils/class-references";

export function adaptToDiagram(projectDefinition: AdaptedProjectDefinition): ProjectDefinition {
  const {
    data: microservicesData,
    metadata: { elements, viewports },
  } = projectDefinition;

  const diagram = Object.entries(microservicesData).reduce(
    (diagram, [microserviceId, microservice]) => {
      const microserviceNode = getMicroserviceNode({
        id: microserviceId,
        data: { ...microservice },
        metadata: elements[`microservices_${microserviceId}`],
      });
      diagram.microservices.nodes.push(microserviceNode);

      if (microservice.type === "microservice") {
        // Microservice Diagram Edges
        const communications = microservice.services
          .filter((service) => service.type === "REMOTE_PROXY")
          .map((remoteProxy, _, remoteProxies) => {
            const source = microserviceId;
            const target = remoteProxy.microserviceId;
            return getEdge({
              source,
              target,
              data: {
                services: remoteProxies
                  .filter((remoteProxy) => remoteProxy.microserviceId === target)
                  .map((remoteProxy) => remoteProxy.id),
              },
              selected: false,
            }) as Edge<Communication>;
          })
          .filter((communication, i, arr) => arr.findIndex((c) => c.id === communication.id) === i);
        diagram.microservices.edges.push(...communications);

        // Service Diagram
        const serviceNodes = microservice.services.map((service) => {
          return getServiceNode({
            id: service.id,
            data: { ...service },
            metadata: elements[`microservices_${microserviceId}_services_${service.id}`],
          });
        });

        const serviceEdges = microservice.services.flatMap((service) => {
          return service.dependencies.map((dependency) => {
            // TODO: AKO SU OBA PLUGBALE ONDA VRV MOGU DA KAZEM DA JE DEFAULT EDGE
            return getServiceEdge({ source: service.id, target: dependency });
          });
        });

        diagram.services[microserviceId] = {
          nodes: serviceNodes,
          edges: serviceEdges,
          viewport: viewports[`services_${microserviceId}`],
        };

        // Class Diagram
        const classNodes = microservice.classes.map((_class) => {
          return getClassNode({
            id: _class.id,
            data: { ..._class },
            metadata: elements[`microservices_${microserviceId}_classes_${_class.id}`],
          });
        });

        const classEdges = microservice.classes.flatMap((_class) => {
          return extractComplexTypes(_class)
            .filter((complexType) => _class.id !== complexType)
            .map((complexType) => {
              return getClassEdge({ source: _class.id, target: complexType });
            });
        });

        diagram.classes[microserviceId] = {
          nodes: classNodes,
          viewport: viewports[`classes_${microserviceId}`],
          edges: classEdges,
        };
      }

      return diagram;
    },
    {
      microservices: { nodes: [], edges: [], viewport: viewports["microservices"] },
      services: {},
      classes: {},
    }
  );

  const pluginCommunication = Object.entries(elements)
    .filter(([key]) => key.startsWith("communications"))
    .map(([_, communication]: [string, any]) => {
      return getEdge({
        ...communication,
        removable: false,
        selected: false,
      });
    });
  diagram.microservices.edges.push(...pluginCommunication);

  console.log(diagram);

  return diagram;
}

function getMicroserviceNode({ id, data, metadata }): Node<Microservice> {
  const microserviceData = { ...data };
  delete microserviceData.id;
  delete microserviceData.type;
  delete microserviceData.classes;

  microserviceData.services = microserviceData.services
    .filter((service) => !["PLUGABLE_SERVICE", "REMOTE_PROXY"].includes(service.type))
    .map((service) => ({
      id: service.id,
      name: service.name,
      type: service.type,
    }));

  return {
    id,
    position: metadata.position,
    data: microserviceData,
    type: metadata.type,
    width: metadata.width,
    height: metadata.height,
    selected: false,
    positionAbsolute: { ...metadata.position },
    dragging: false,
  };
}

function getServiceNode({ id, data, metadata }): Node<Service> {
  const serviceData = { ...data };
  delete serviceData.id;
  delete serviceData.dependencies;

  const serviceNode = {
    id,
    position: metadata.position,
    data: serviceData,
    type: metadata.type,
    width: metadata.width,
    height: metadata.height,
    selected: false,
    positionAbsolute: { ...metadata.position },
    dragging: false,
  };

  return serviceNode;
}

function getClassNode({ id, data, metadata }): Node<Class> {
  const classData = { ...data };
  delete classData.id;

  const classNode = {
    id,
    position: metadata.position,
    data: classData,
    type: metadata.type,
    width: metadata.width,
    height: metadata.height,
    selected: false,
    positionAbsolute: { ...metadata.position },
    dragging: false,
  };

  return classNode;
}

function getServiceEdge({ source, target }) {
  return getEdge({ source, target });
}

function getClassEdge({ source, target }) {
  return getEdge({ source, target, removable: false });
}

function getEdge({ source, target, data = {}, removable = true, selected = undefined }): Edge<any> {
  return {
    source,
    sourceHandle: "top",
    target,
    targetHandle: "bottom",
    id: `${source}_${target}`,
    data,
    type: removable ? "removableEdge" : "defaultEdge",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 30,
      height: 30,
    },
    ...(selected !== undefined ? { selected } : {}),
  };
}
