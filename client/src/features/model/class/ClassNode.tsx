import { type Class } from "./models";
import { useTypesContext } from "./TypesContext";
import { useMicroserviceContext } from "../microservices/MicroserviceContext";

interface ClassNodeProps {
  data: Class;
  selected: boolean;
  id: string;
}

const ClassNode: React.FC<ClassNodeProps> = ({ data, selected, id }) => {
  const { microserviceId } = useMicroserviceContext();
  const { getTypeLabel } = useTypesContext(microserviceId);

  return (
    <div className="p-4 rounded-lg border border-violet-400/80 bg-white flex flex-col gap-y-3">
      <h2 className="w-full text-center text-xl my-2">{data.name}</h2>
      {data.attributes.map((attribute) => (
        <div key={attribute.id} className="flex w-full p-1 rounded-md border border-gray-400">
          <span>
            {attribute.name}
            {attribute.isOptional ? "?" : ""}: {getTypeLabel(attribute.type)}
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
                  getTypeLabel(p.type) +
                  (p.isCollection ? "[]" : "")
              )
              .join(", ")}
            {")"}: {getTypeLabel(method.returnValue)}
            {method.returnsCollection ? "[]" : ""}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ClassNode;
