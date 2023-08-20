import { type FC } from "react";
import { Handle, Position } from "reactflow";
import { type Microservice } from "./models";

type MicroserviceNodeProps = {
  data: Microservice;
  selected: boolean;
  id: string;
};

export const MicroserviceNode: FC<MicroserviceNodeProps> = ({ data: microservice, selected }) => {
  return (
    <div className={`p-4 rounded-lg border-2 bg-green-50 border-green-300`}>
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

      <h2 className="w-full text-center text-xl my-2">{microservice.name}</h2>
      {microservice.services.map((service) => (
        <div key={service.id} className="flex w-full p-1 rounded-md border border-gray-400">
          <span>{service.name}</span>
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
