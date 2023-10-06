import { type Class } from "../../../model/class/models";
import { type HandlerType } from "./types";
import {
  type ProjectDefinition,
  type ClassDiagram,
  type ServiceDiagram,
} from "../../models/project-definition.models";
import { createClassNode } from "../../../model/common/utils/nodeFactories";

// Add

const addClassHandler: HandlerType<{
  microserviceId: string;
  name: string;
}> = (projectDefinition: ProjectDefinition, { microserviceId, name }) => {
  const classDiagram = projectDefinition.classes[microserviceId];
  const newClassNode = createClassNode({
    microserviceId,
    name,
  });

  classDiagram.nodes.push(newClassNode);

  return newClassNode;
};

// Update

const updateClassHandler: HandlerType<{
  microserviceId: string;
  classId: string;
  class: Class;
}> = (projectDefinition: ProjectDefinition, { microserviceId, classId, class: _class }) => {
  const classDiagram = projectDefinition.classes[microserviceId];
  const classNode = classDiagram.nodes.find((node) => node.id === classId);

  classNode.data = _class;
};

// Delete

const deleteClassHandler: HandlerType<{ microserviceId: string; classId: string }> = (
  projectDefinition: ProjectDefinition,
  { microserviceId, classId }
) => {
  const classDiagram = projectDefinition.classes[microserviceId];
  removeClassRefferencesFromClasses(classDiagram, classId);

  const serviceDiagram = projectDefinition.services[microserviceId];
  removeClassRefferencesFromServices(serviceDiagram, classId);

  removeClassNode(classDiagram, classId);
};

const removeClassNode = (classDiagram: ClassDiagram, classId: string) => {
  classDiagram.nodes = classDiagram.nodes.filter((node) => node.id !== classId);
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

export { addClassHandler, updateClassHandler, deleteClassHandler };
