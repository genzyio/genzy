import { type Node, type Edge } from "reactflow";
import { type Microservice, type Communication } from "../../diagrams/microservices/models";
import { type Service } from "../../diagrams/service/models";
import { type Class } from "../../diagrams/class/models";

type MicroserviceDiagram = DiagramDefinition<Node<Microservice>, Edge<Communication>>;
type ServiceDiagram = DiagramDefinition<Node<Service>, Edge<any>>;
type ClassDiagram = Omit<DiagramDefinition<Node<Class>>, "edges">;

type ProjectDefinition = {
  microservices: MicroserviceDiagram;
  services: Record<string, ServiceDiagram>;
  classes: Record<string, ClassDiagram>;
};

type DiagramDefinition<NT = any, ET = any> = {
  nodes: NT[];
  edges: ET[];
  viewport: any;
};

export type {
  ProjectDefinition,
  MicroserviceDiagram,
  ServiceDiagram,
  ClassDiagram,
  DiagramDefinition,
};
