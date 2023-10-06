import { MicroserviceNode } from "../../microservices/MicroserviceNode";
import { ImageNode } from "../../microservices/ImageNode";
import { ServiceNode } from "../../service/ServiceNode";
import { RemoteProxyNode } from "../../service/RemoteProxyNode";
import { PlugableServiceNode } from "../../service/PlugableServiceNode";
import { ClassNode } from "../../class/ClassNode";

const nodeTypes = {
  microserviceNode: MicroserviceNode,
  imageNode: ImageNode,
  serviceNode: ServiceNode,
  remoteProxyNode: RemoteProxyNode,
  plugableServiceNode: PlugableServiceNode,
  classNode: ClassNode,
};

export default nodeTypes;