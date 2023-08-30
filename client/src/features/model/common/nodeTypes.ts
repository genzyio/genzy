import { ClassNode } from "../class/ClassNode";
import { MicroserviceNode } from "../microservices/MicroserviceNode";
import { RemoteProxyNode } from "../service/RemoteProxyNode";
import { ServiceNode } from "../service/ServiceNode";

const nodeTypes = {
  classNode: ClassNode,
  microserviceNode: MicroserviceNode,
  serviceNode: ServiceNode,
  remoteProxyNode: RemoteProxyNode,
};

export default nodeTypes;
