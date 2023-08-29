import { useProjectContext } from "../../projects/contexts/project.context";
import { type Class } from "./models";

interface ClassNodeProps {
  data: Class;
  selected: boolean;
  id: string;
}

const ClassNode: React.FC<ClassNodeProps> = ({ data, selected, id }) => {
  const projectContext = useProjectContext();
  const typeName = (typeValue: string) => {
    const foundType = projectContext.projectDefinition.classes.nodes.find(
      (node) => node.id === typeValue
    );
    if (foundType) {
      return foundType.data.name;
    }
    return typeValue;
  };

  return (
    <div className="p-4 rounded-lg border border-violet-400/80 bg-white flex flex-col gap-y-3">
      <h2 className="w-full text-center text-xl my-2">{data.name}</h2>
      {data.attributes.map((attribute) => (
        <div key={attribute.id} className="flex w-full p-1 rounded-md border border-gray-400">
          <span>
            {attribute.name}
            {attribute.isOptional ? "?" : ""}: {typeName(attribute.type)}
            {attribute.isCollection ? "[]" : ""}
          </span>
        </div>
      ))}
      {data.methods.length > 0 ? <hr></hr> : <></>}
      {data.methods.map((method) => (
        <div key={method.id} className="flex w-full p-1 rounded-md border border-gray-400">
          <span>
            {method.name}
            {"("}
            {method.parameters
              .map(
                (p) =>
                  p.name +
                  (p.isOptional ? "?" : "") +
                  ": " +
                  typeName(p.type) +
                  (p.isCollection ? "[]" : "")
              )
              .join(", ")}
            {")"}: {typeName(method.returnValue)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ClassNode;
