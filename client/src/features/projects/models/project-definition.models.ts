type ProjectDefinition = {
  nodes: any[];
  edges: any[];

  microservices: DiagramDefinition;
};

type DiagramDefinition = {
  nodes: any[];
  edges: any[];
};

export type { ProjectDefinition, DiagramDefinition };
