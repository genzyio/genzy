import { type FC, type PropsWithChildren, createContext, useContext, useState } from "react";
import { type Node } from "reactflow";
import { type Class } from "./models";

type TypesContextValues = {
  typesPerMicroservice: Record<string, any>;

  updateTypesPerMicroservice: (microserviceId: string) => (classNodes: Node<Class>[]) => any;
};

const TypesContext = createContext<TypesContextValues | null>(null);

export const useTypesContext = (microserviceId: string) => {
  const { typesPerMicroservice, updateTypesPerMicroservice } = useContext(TypesContext);

  const types = typesPerMicroservice[microserviceId] || [];

  const getTypeLabel = (value: string) => {
    return types.find((option) => option.value === value)?.label ?? "";
  };
  const updateTypes = updateTypesPerMicroservice(microserviceId);

  return {
    types,
    getTypeLabel,
    updateTypes,
  };
};

export const primitiveTypes = ["any", "int", "float", "boolean", "string"];
const primitiveTypeOptions = primitiveTypes.map((type) => ({
  label: type,
  value: type,
}));

export const TypesContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [typesPerMicroservice, setTypesPerMicroservice] = useState<any>({});

  const updateTypesPerMicroservice = (microserviceId: string) => {
    return (classNodes: Node<Class>[]) => {
      const classTypeOptions = classNodes?.map((classNode) => ({
        label: classNode.data.name,
        value: classNode.id,
      }));

      setTypesPerMicroservice({
        ...typesPerMicroservice,
        [microserviceId]: [...primitiveTypeOptions, ...classTypeOptions],
      });
    };
  };

  return (
    <TypesContext.Provider value={{ typesPerMicroservice, updateTypesPerMicroservice }}>
      {children}
    </TypesContext.Provider>
  );
};
