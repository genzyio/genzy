import { type FC } from "react";
import { Handle, Position } from "reactflow";
import { type Microservice } from "./models";
import { Button } from "../../../components/button";
import { useMicroserviceNodeContext } from "./MicroserviceNodeContext";

type MicroserviceNodeProps = {
  id: string;
  data: Microservice;
};

export const MicroserviceNode: FC<MicroserviceNodeProps> = ({
  id: microserviceId,
  data: microservice,
}) => {
  const { onServicesClick, onModelsClick } = useMicroserviceNodeContext();

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

      <div className="mt-3 flex gap-x-2">
        <Button type="button" onClick={() => onServicesClick(microserviceId)}>
          Services
        </Button>
        <Button type="button" onClick={() => onModelsClick(microserviceId)}>
          Models
        </Button>
      </div>

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
