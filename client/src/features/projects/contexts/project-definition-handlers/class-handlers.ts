import {
  type ProjectDefinition,
  type ClassDiagram,
  type ServiceDiagram,
} from "../../models/project-definition.models";
import { type HandlerType } from "./types";

const deleteClassHandler: HandlerType<{ microserviceId: string; classId: string }> = (
  projectDefinition: ProjectDefinition,
  { microserviceId, classId }
) => {
  const classDiagram = projectDefinition.classes[microserviceId];
  removeClassRefferencesFromClasses(classDiagram, classId);

  const serviceDiagram = projectDefinition.services[microserviceId];
  removeClassRefferencesFromServices(serviceDiagram, classId);
};

const removeClassRefferencesFromClasses = (classDiagram: ClassDiagram, classId: string) => {
  classDiagram.nodes?.forEach((node) => {
    const methods = node.data.methods;
    methods.forEach((method) => {
      if (method.returnValue === classId) {
        method.returnValue = "any";
      }

      method.parameters.forEach((parameter) => {
        if (parameter.type === classId) {
          parameter.type = "any";
        }
      });
    });

    const attributes = node.data.attributes;
    attributes.forEach((attribute) => {
      if (attribute.type === classId) {
        attribute.type = "any";
      }
    });
  });
};

const removeClassRefferencesFromServices = (serviceDiagram: ServiceDiagram, classId: string) => {
  serviceDiagram.nodes.forEach((node) => {
    const functions = node.data.functions;
    functions.forEach((_function) => {
      if (_function.returnType === classId) {
        _function.returnType = "any";
      }
      _function.params.forEach((param) => {
        if (param.type === classId) {
          param.type = "any";
        }
      });
    });
  });
};

export { deleteClassHandler };
