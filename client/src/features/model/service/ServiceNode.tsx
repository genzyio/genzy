import { Handle, Position } from "reactflow";
import { type Service } from "./models";
import { MethodChip } from "./MethodChip";
import { type FC } from "react";

const colors = {
  LOCAL: "bg-green-50 border-green-300",
  CONTROLLER: "bg-red-50 border-red-300",
  REMOTE_PROXY: "bg-blue-50 border-blue-300",
} as const;

type ServiceNodeProps = {
  data: Service;
  selected: boolean;
  id: string;
};

export const ServiceNode: FC<ServiceNodeProps> = ({ data: service, selected }) => {
  const showRoute = service.type !== "LOCAL";
  return (
    <div className={`p-4 rounded-lg border-2 ${colors[service.type]}`}>
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: "#555",
          width: "1rem",
          height: "1rem",
          top: -10,
        }}
        isConnectable={true}
      />
      <p className="text-xs text-gray-500">{service.type}</p>
      <h2 className="w-full text-center text-xl my-2">{service.name}</h2>
      {service.functions.map((fun) => (
        <div key={fun.id} className="flex w-full p-1 rounded-md border border-gray-400">
          {showRoute && (
            <span className="w-14 mr-2">
              <MethodChip method={fun.method} small />
            </span>
          )}
          <span className="">{showRoute ? fun.route : fun.name}</span>
        </div>
      ))}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: "#555",
          width: "1rem",
          height: "1rem",
          bottom: -10,
        }}
        isConnectable={true}
      />
    </div>
  );
};
