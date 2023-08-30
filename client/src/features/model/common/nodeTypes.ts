import { ClassNode } from "../class/ClassNode";
import { MicroserviceNode } from "../microservices/MicroserviceNode";
import { ServiceNode } from "../service/ServiceNode";

const nodeTypes = {
  classNode: ClassNode,
  microserviceNode: MicroserviceNode,
  serviceNode: ServiceNode,
};

export default nodeTypes;
