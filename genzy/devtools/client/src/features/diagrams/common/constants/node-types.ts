import { MicroserviceNode } from "../../microservices/nodes/microservice-node";
import { ImageNode } from "../../microservices/nodes/image-node";
import { ServiceNode } from "../../service/nodes/service-node";
import { RemoteProxyNode } from "../../service/nodes/remote-proxy-node";
import { PlugableServiceNode } from "../../service/nodes/plugable-service-node";
import { ClassNode } from "../../class/nodes/class-node";

const nodeTypes = {
  microserviceNode: MicroserviceNode,
  imageNode: ImageNode,
  serviceNode: ServiceNode,
  remoteProxyNode: RemoteProxyNode,
  plugableServiceNode: PlugableServiceNode,
  classNode: ClassNode,
};

export default nodeTypes;
