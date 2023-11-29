import { type Node, type Edge, type Viewport } from "reactflow";
import { type Microservice, type Communication } from "../../diagrams/microservices/models";
import { type Service } from "../../diagrams/service/models";
import { type Class } from "../../diagrams/class/models";

type MicroserviceDiagram = DiagramDefinition<Microservice, Communication>;
type ServiceDiagram = DiagramDefinition<Service, any>;
type ClassDiagram = DiagramDefinition<Class, any>;

type ProjectDefinition = {
  microservices: MicroserviceDiagram;
  services: Record<string, ServiceDiagram>;
  classes: Record<string, ClassDiagram>;
};

type DiagramDefinition<NT = any, ET = any> = {
  nodes: Node<NT>[];
  edges: Edge<ET>[];
  viewport: Viewport;
};

export type {
  ProjectDefinition,
  DiagramDefinition,
  MicroserviceDiagram,
  ServiceDiagram,
  ClassDiagram,
};
