import { useReducer, useEffect } from "react";
import { type Class, type Attribute, type DataType, type Method, type Parameter } from "../models";
import { useDirtyCheckContext } from "../../common/contexts/dirty-check.context";

type UpdateClassPart = {
  type: "UPDATE_CLASS_DATA";
  payload: Partial<Omit<Class, "attributes" | "methods">>;
};

type AddAttribute = {
  type: "ADD_ATTRIBUTE";
  payload: { attributeName: string };
};

type UpdateAttribute = {
  type: "UPDATE_ATTRIBUTE";
  payload: Attribute;
};

type DeleteAttribute = {
  type: "DELETE_ATTRIBUTE";
  payload: { id: Attribute["id"] };
};

type AddMethod = {
  type: "ADD_METHOD";
  payload: { methodName: string };
};

type UpdateMethod = {
  type: "UPDATE_METHOD";
  payload: Method;
};

type DeleteMethod = {
  type: "DELETE_METHOD";
  payload: { id: Method["id"] };
};

type ClassAction =
  | UpdateClassPart
  | AddAttribute
  | UpdateAttribute
  | DeleteAttribute
  | AddMethod
  | UpdateMethod
  | DeleteMethod;

const classReducer = (_class: Class, action: ClassAction) => {
  switch (action.type) {
    case "UPDATE_CLASS_DATA": {
      return {
        ..._class,
        ...action.payload,
      };
    }

    case "ADD_ATTRIBUTE": {
      const newAttribute = {
        id: `${+new Date()}`,
        name: action.payload.attributeName,
        type: "int" as DataType,
        isCollection: false,
        isOptional: false,
      };
      const newAttributes = [..._class.attributes, newAttribute];

      return {
        ..._class,
        attributes: newAttributes,
      };
    }

    case "UPDATE_ATTRIBUTE": {
      const updatedAttribute = action.payload;
      const newAttributes = _class.attributes.map((attribute) => {
        if (attribute.id === updatedAttribute.id) {
          return {
            ...updatedAttribute,
          };
        }

        return attribute;
      });

      return {
        ..._class,
        attributes: newAttributes,
      };
    }

    case "DELETE_ATTRIBUTE": {
      const deletedAttributeId = action.payload.id;
      const newAttributes = _class.attributes.filter(
        (attribute) => attribute.id !== deletedAttributeId
      );

      return {
        ..._class,
        attributes: newAttributes,
      };
    }

    case "ADD_METHOD": {
      const newMethod = {
        id: `${+new Date()}`,
        name: action.payload.methodName,
        parameters: [] as Parameter[],
        returnValue: "any",
      } as Method;
      const newMethods = [..._class.methods, newMethod];

      return {
        ..._class,
        methods: newMethods,
      };
    }

    case "UPDATE_METHOD": {
      const updatedMethod = action.payload;
      const newMethods = _class.methods.map((method) => {
        if (method.id === updatedMethod.id) {
          return {
            ...updatedMethod,
          };
        }

        return method;
      });

      return {
        ..._class,
        methods: newMethods,
      };
    }

    case "DELETE_METHOD": {
      const deletedMethodId = action.payload.id;
      const newMethods = _class.methods.filter((method) => method.id !== deletedMethodId);

      return {
        ..._class,
        methods: newMethods,
      };
    }

    default: {
      return _class;
    }
  }
};

export const useClassState = (initialClass: Class) => {
  const [_class, dispatch] = useReducer(classReducer, {
    ...initialClass,
    attributes: [...initialClass.attributes],
    methods: [...initialClass.methods],
  });
  const { setCurrentState } = useDirtyCheckContext();

  useEffect(() => {
    if (!_class) return;
    setCurrentState({ ..._class });
  }, [_class]);

  const actions = {
    updateClassData: (payload: UpdateClassPart["payload"]) => {
      dispatch({ type: "UPDATE_CLASS_DATA", payload });
    },
    addAttribute: (payload: AddAttribute["payload"]) => {
      dispatch({ type: "ADD_ATTRIBUTE", payload });
    },
    updateAttribute: (payload: UpdateAttribute["payload"]) => {
      dispatch({ type: "UPDATE_ATTRIBUTE", payload });
    },
    deleteAttribute: (payload: DeleteAttribute["payload"]) => {
      dispatch({ type: "DELETE_ATTRIBUTE", payload });
    },
    addMethod: (payload: AddMethod["payload"]) => {
      dispatch({ type: "ADD_METHOD", payload });
    },
    updateMethod: (payload: UpdateMethod["payload"]) => {
      dispatch({ type: "UPDATE_METHOD", payload });
    },
    deleteMethod: (payload: DeleteMethod["payload"]) => {
      dispatch({ type: "DELETE_METHOD", payload });
    },
  };

  return {
    class: _class,
    actions,
  };
};
