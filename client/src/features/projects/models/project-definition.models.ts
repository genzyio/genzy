type ProjectDefinition = {
  nodes: any[];
  edges: any[];

  microservices: DiagramDefinition;
  classes: Omit<DiagramDefinition, "edges">;
};

type DiagramDefinition = {
  nodes: any[];
  edges: any[];
};

export type { ProjectDefinition, DiagramDefinition };
