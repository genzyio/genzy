import { type FC } from "react";
import { type NodeProps } from "reactflow";
import { type Class } from "../models";
import { NodeBase } from "../../common/components/nodes/NodeBase";
import { AttributePreview } from "../class-drawer/attributes/AttributePreview";
import { MethodPreview } from "../class-drawer/methods/MethodPreview";

type ClassNodeProps = NodeProps<Class>;

export const ClassNode: FC<ClassNodeProps> = ({ data }) => {
  const { name, attributes, methods } = data;

  return (
    <NodeBase borderColor="border-violet-500/80" title={name}>
      <div className="space-y-2">
        {attributes.map((attribute) => (
          <div key={attribute.id} className="p-1 rounded-md border border-gray-400">
            <AttributePreview attribute={attribute} />
          </div>
        ))}
        {methods.length > 0 ? <hr /> : <></>}
        {methods.map((method) => (
          <div key={method.id} className="p-1 rounded-md border border-gray-400">
            <MethodPreview method={method} />
          </div>
        ))}
      </div>
    </NodeBase>
  );
};
