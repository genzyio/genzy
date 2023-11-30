import { type CompactMicroservice } from "./devtools.types";

type Node = { id: string; type: string; data: any };
type Edge = { source: string; target: string };

type Diagram = {
  nodes: Node[];
  edges: Edge[];
};

type ProjectDefinition = {
  microservices: Diagram;
  services: Record<string, Diagram>;
  classes: Record<string, Diagram>;
};

export function adaptFromProjectDefinitionToConverterInput(
  projectJson: ProjectDefinition,
): Record<CompactMicroservice["id"], CompactMicroservice> {
  const { microservices: microserviceDiagram, services: serviceDiagram, classes: classDiagram } = projectJson;

  return microserviceDiagram.nodes
    .filter((microserviceNode) => microserviceNode.type === "microserviceNode")
    .reduce((microservices: Record<CompactMicroservice["id"], CompactMicroservice>, microserviceNode) => {
      const microservice = convertNode(microserviceNode);
      const services = serviceDiagram[microservice.id].nodes.map(convertNode);
      const classes = classDiagram[microservice.id].nodes.map(convertNode);

      for (const service of services) {
        service.dependencies = findDependencies(serviceDiagram[microservice.id].edges, service.id);
      }

      microservices[microservice.id] = {
        ...microservice,
        services,
        classes,
      };

      return microservices;
    }, {});
}

function convertNode(node: Node): any {
  return {
    id: node.id,
    ...node.data,
  };
}

function findDependencies(edges: Edge[], serviceId: string): string[] {
  return edges.filter((edge) => edge.source === serviceId).map((edge) => edge.target);
}
