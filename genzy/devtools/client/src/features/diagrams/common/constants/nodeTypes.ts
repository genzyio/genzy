import { MicroserviceNode } from "../../microservices/nodes/MicroserviceNode";
import { ImageNode } from "../../microservices/nodes/ImageNode";
import { ServiceNode } from "../../service/nodes/ServiceNode";
import { RemoteProxyNode } from "../../service/nodes/RemoteProxyNode";
import { PlugableServiceNode } from "../../service/nodes/PlugableServiceNode";
import { ClassNode } from "../../class/nodes/ClassNode";

const nodeTypes = {
  microserviceNode: MicroserviceNode,
  imageNode: ImageNode,
  serviceNode: ServiceNode,
  remoteProxyNode: RemoteProxyNode,
  plugableServiceNode: PlugableServiceNode,
  classNode: ClassNode,
};

export default nodeTypes;
