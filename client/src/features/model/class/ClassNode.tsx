import { type FC } from "react";
import { type NodeProps } from "reactflow";
import { type Class } from "./models";
import { AttributePreview } from "./AttributePreview";
import { MethodPreview } from "./MethodPreview";

type ClassNodeProps = NodeProps<Class>;

export const ClassNode: FC<ClassNodeProps> = ({ data }) => {
  const { name, attributes, methods } = data;

  return (
    <div className="p-4 rounded-lg border-2 border-violet-400/80 bg-white flex flex-col gap-y-2">
      <h2 className="w-full text-center text-xl my-2">{name}</h2>
      {attributes.map((attribute) => (
        <div key={attribute.id} className="flex w-full p-1 rounded-md border border-gray-400">
          <AttributePreview attribute={attribute} />
        </div>
      ))}
      {methods.length > 0 ? <hr></hr> : <></>}
      {methods.map((method) => (
        <div key={method.id} className="flex w-full p-1 rounded-md border border-gray-400">
          <MethodPreview method={method} />
        </div>
      ))}
    </div>
  );
};
