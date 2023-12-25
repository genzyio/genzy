import { type Node, type Edge, type Viewport } from "reactflow";
import { type ProjectDefinition } from "../../models/project-definition.models";
import { type Microservice as MicroserviceWithoutId } from "@features/diagrams/microservices/models";
import { type Service as ServiceWithoutId } from "@features/diagrams/service/models";
import { type Class as ClassWithoutId } from "@features/diagrams/class/models";

export type AdaptedProjectDefinition = {
  data: ProjectDefinitionData;
  metadata: ProjectDefinitionMetadata;
};

type ProjectDefinitionData = Record<string, Microservice>;

type ProjectDefinitionMetadata = {
  elements: Record<string, any>;
  viewports: Record<string, Viewport>;
};

type MicroserviceBase = Omit<MicroserviceWithoutId, "services"> & { id: string };

type Microservice = MicroserviceBase &
  (
    | {
        type: "microservice";
        services: Service[];
        classes: Class[];
      }
    | { type: "plugin" }
  );

type Service = ServiceWithoutId & { id: string; dependencies: string[] };
type Class = ClassWithoutId & { id: string };

export function adaptFromDiagram(projectDefinition: ProjectDefinition): AdaptedProjectDefinition {
  return {
    data: extractMicroserviceData(projectDefinition),
    metadata: {
      elements: extractElements(projectDefinition),
      viewports: extractViewports(projectDefinition),
    },
  };
}

function extractMicroserviceData(projectDefinition: ProjectDefinition) {
  const {
    microservices: microserviceDiagram,
    services: serviceDiagrams,
    classes: classDiagrams,
  } = projectDefinition;

  return microserviceDiagram.nodes.reduce(
    (microservicesData: Record<string, Microservice>, microserviceNode) => {
      if (microserviceNode.type === "microserviceNode") {
        const microservice = extractNodeData(microserviceNode);

        const serviceDiagram = serviceDiagrams[microserviceNode.id];
        const services = serviceDiagram.nodes.map((node) => extractNodeData<Service>(node));
        for (const service of services) {
          service.dependencies = findDependencies(serviceDiagram.edges, service.id);
        }

        const classDiagram = classDiagrams[microserviceNode.id];
        const classes = classDiagram.nodes.map((node) => extractNodeData<Class>(node));

        microservicesData[microservice.id] = {
          type: "microservice",
          ...microservice,
          services,
          classes,
        };
      } else {
        const microservice = extractNodeData(microserviceNode);

        microservicesData[microservice.id] = {
          type: "plugin",
          ...microservice,
        };
      }

      return microservicesData;
    },
    {}
  );
}

function extractNodeData<T = any>(node: Node<Partial<T>>): T & { id: string } {
  return {
    id: node.id,
    ...(node.data as T),
  };
}

function findDependencies(edges: Edge[], serviceId: string): string[] {
  return edges.filter((edge) => edge.source === serviceId).map((edge) => edge.target);
}

function extractElements(projectDefinition: ProjectDefinition) {
  return getElementsExtractor(projectDefinition)
    .addMicroservices()
    .addClasses()
    .addServices()
    .addCommunications()
    .get();
}

function getElementsExtractor(projectDefinition: ProjectDefinition) {
  const {
    microservices: microserviceDiagram,
    services: serviceDiagrams,
    classes: classDiagrams,
  } = projectDefinition;
  const elements: Record<string, any> = {};

  const findMicroserviceNode = (microserviceId: string) => {
    return microserviceDiagram.nodes.find((node) => node.id === microserviceId);
  };

  const extractor = {
    addMicroservices: () => {
      microserviceDiagram.nodes.forEach((microserviceNode) => {
        elements[`microservices_${microserviceNode.id}`] = extractNodeMetadata(microserviceNode);
      });

      return extractor;
    },

    addServices: () => {
      Object.entries(serviceDiagrams)
        .flatMap(([microserviceId, serviceDiagram]) =>
          serviceDiagram.nodes.map((node) => ({
            microserviceId,
            serviceNode: node,
          }))
        )
        .forEach(({ microserviceId, serviceNode }) => {
          elements[`microservices_${microserviceId}_services_${serviceNode.id}`] =
            extractNodeMetadata(serviceNode);
        });

      return extractor;
    },

    addClasses: () => {
      Object.entries(classDiagrams)
        .flatMap(([microserviceId, classDiagram]) =>
          classDiagram.nodes.map((node) => ({
            microserviceId,
            classNode: node,
          }))
        )
        .forEach(({ microserviceId, classNode }) => {
          elements[`microservices_${microserviceId}_classes_${classNode.id}`] =
            extractNodeMetadata(classNode);
        });

      return extractor;
    },

    addCommunications: () => {
      microserviceDiagram.edges
        .filter((edge) => {
          const sourceMicroservice = findMicroserviceNode(edge.source);
          const targetMicroservice = findMicroserviceNode(edge.target);
          return sourceMicroservice.type === "imageNode" || targetMicroservice.type === "imageNode";
        })
        .forEach((edge) => {
          elements[`communications_${edge.source}_${edge.target}`] = {
            source: edge.source,
            target: edge.target,
          };
        });

      return extractor;
    },

    get: () => elements,
  };

  return extractor;
}

function extractNodeMetadata(node: Node<any>): any {
  const metadata = { ...node };

  delete metadata["data"];
  delete metadata["selected"];
  delete metadata["dragging"];
  metadata["position"] && delete metadata["positionAbsolute"];

  return metadata;
}

function getViewportsExtractor(projectDefinition: ProjectDefinition) {
  const {
    microservices: microserviceDiagram,
    services: serviceDiagrams,
    classes: classDiagrams,
  } = projectDefinition;
  const viewports: Record<string, Viewport> = {};

  const extractor = {
    addMicroservice: () => {
      viewports["microservices"] = microserviceDiagram.viewport;

      return extractor;
    },

    addServices: () => {
      Object.entries(serviceDiagrams).forEach(
        ([microserviceId, diagram]) => (viewports[`services_${microserviceId}`] = diagram.viewport)
      );

      return extractor;
    },

    addClasses: () => {
      Object.entries(classDiagrams).forEach(
        ([microserviceId, diagram]) => (viewports[`classes_${microserviceId}`] = diagram.viewport)
      );

      return extractor;
    },

    get: () => viewports,
  };

  return extractor;
}

function extractViewports(projectDefinition: ProjectDefinition): Record<string, Viewport> {
  return getViewportsExtractor(projectDefinition)
    .addMicroservice()
    .addServices()
    .addClasses()
    .get();
}
