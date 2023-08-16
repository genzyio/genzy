import { Handle, Position } from "reactflow";
import { type Service } from "./models";
import { MethodChip } from "./MethodChip";

interface ServiceNodeProps {
  data: Service;
  selected: boolean;
  id: string;
}

export const ServiceNode: React.FC<ServiceNodeProps> = ({ data: service, selected }) => {
  return (
    <div
      className={`p-4 rounded-lg ${
        selected ? "border-2 border-blue-400" : "border border-gray-400"
      } bg-white`}
    >
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
      <h2 className="w-full text-center text-xl mb-2">{service.name}</h2>
      {service.functions.map((fun) => (
        <div key={fun.id} className="flex w-full p-1 rounded-md border-2">
          <span className="w-14 mr-2">
            <MethodChip method={fun.method} small />
          </span>
          <span className="">{fun.route || "- " + fun.name}</span>
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
