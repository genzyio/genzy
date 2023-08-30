type ProjectDefinition = {
  microservices: DiagramDefinition;
  services: Record<string, DiagramDefinition>;
  classes: Record<string, Omit<DiagramDefinition, "edges">>;
};

type DiagramDefinition = {
  nodes: any[];
  edges: any[];
  viewport: any;
};

export type { ProjectDefinition, DiagramDefinition };
