import { useState } from "react";
import { Handle, Position } from "reactflow";
import { Attribute, Class } from "./models";

interface ClassNodeProps {
  data: Class;
  selected: boolean;
  id: string;
}

const ClassNode: React.FC<ClassNodeProps> = ({ data, selected, id }) => {
  const [classData, setClassData] = useState(data);

  const handleAttributeChange = (index: number, field: "name" | "type", value: string) => {
    classData.attributes[index][field] = value;
    setClassData({ ...classData });
  };

  const handleAddAttribute = () => {
    setClassData({
      ...classData,
      attributes: [
        ...classData.attributes,
        { name: "", type: "String", isCollection: false, id: `${+new Date()}` },
      ],
    });
  };

  return (
    <div
      className="p-2"
      style={{
        border: selected ? "2px solid #aaa" : "1px solid #555",
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="bg-red-600"
        isConnectable={true}
        id="t"
      />
      <input
        className="border px-2 py-1 w-full text-center"
        value={classData.name}
        onChange={(e) => setClassData({ ...classData, name: e.target.value })}
      />
      {classData.attributes.map((attribute, index) => (
        <div key={attribute.id} className="flex items-center w-full">
          <input
            className="border w-auto"
            value={attribute.name}
            onChange={(e) => handleAttributeChange(index, "name", e.target.value)}
            placeholder="Attribute Name"
          />
          <select
            className="border"
            value={attribute.type}
            onChange={(e) => handleAttributeChange(index, "type", e.target.value)}
          >
            <option value="String">String</option>
            <option value="Number">Number</option>
            <option value="Boolean">Boolean</option>
            <option value="Handle">Handle</option>
          </select>
          {attribute.type === "Handle" && (
            <Handle
              type="source"
              position={Position.Right}
              isConnectable={true}
              id={attribute.id}
              style={{ top: index * 23 + 35 }}
            />
          )}
        </div>
      ))}
      <button className="bg-gray-700 text-white" onClick={handleAddAttribute}>
        +
      </button>
    </div>
  );
};

export default ClassNode;
