import { type Node, type Edge } from "reactflow";
import { type Microservice, type Communication } from "../../model/microservices/models";
import { type Service } from "../../model/service/models";
import { type Class } from "../../model/class/models";

type ProjectDefinition = {
  microservices: DiagramDefinition<Node<Microservice>, Edge<Communication>>;
  services: Record<string, DiagramDefinition<Node<Service>>>;
  classes: Record<string, Omit<DiagramDefinition<Node<Class>>, "edges">>;
};

type DiagramDefinition<NT = any, ET = any> = {
  nodes: NT[];
  edges: ET[];
  viewport: any;
};

export type { ProjectDefinition, DiagramDefinition };
