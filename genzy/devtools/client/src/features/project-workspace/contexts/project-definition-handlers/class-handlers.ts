import { type DispatcherType, projectDefinitionActions } from "../project-definition.dispatcher";
import { type Class } from "../../../diagrams/class/models";
import { type HandlerType } from "./types";
import {
  type ProjectDefinition,
  type ClassDiagram,
  type ServiceDiagram,
} from "../../models/project-definition.models";
import { createClassNode } from "../../../diagrams/common/utils/nodeFactories";
import { findArrayDiff } from "../../../../core/utils/diff";
import { extractComplexTypes } from "../../utils/class-references";

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
  return async (dispatcher: DispatcherType) => {
    const classDiagram = projectDefinition.classes[microserviceId];
    const classNode = classDiagram.nodes.find((node) => node.id === classId);

    const oldComplexTypes = extractComplexTypes(classNode.data);
    const newComplexTypes = extractComplexTypes(_class);
    const { new: addedReferences, removed: removedReferences } = findArrayDiff<string>(
      oldComplexTypes,
      newComplexTypes
    );

    for (const addedReference of addedReferences) {
      if (classId === addedReference) {
        continue;
      }

      await dispatcher(projectDefinitionActions.addReference, {
        microserviceId,
        params: {
          source: classId,
          target: addedReference,
        },
      });
    }

    for (const removedReference of removedReferences) {
      await dispatcher(projectDefinitionActions.removeReference, {
        microserviceId,
        sourceClassId: classId,
        targetClassId: removedReference,
      });
    }

    classNode.data = _class;
  };
};

// Delete

const deleteClassHandler: HandlerType<{ microserviceId: string; classId: string }> = (
  projectDefinition: ProjectDefinition,
  { microserviceId, classId }
) => {
  return async (dispatcher: DispatcherType) => {
    const classDiagram = projectDefinition.classes[microserviceId];
    changeTypeForEveryRefferenceByClass(classDiagram, classId);

    const serviceDiagram = projectDefinition.services[microserviceId];
    changeTypeForEveryRefferenceByService(serviceDiagram, classId);

    await removeClassReferences(dispatcher, classDiagram, microserviceId, classId);
    removeClassNode(classDiagram, classId);
  };
};

function removeClassNode(classDiagram: ClassDiagram, classId: string) {
  classDiagram.nodes = classDiagram.nodes.filter((node) => node.id !== classId);
}

function changeTypeForEveryRefferenceByClass(classDiagram: ClassDiagram, classId: string) {
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
}

function changeTypeForEveryRefferenceByService(serviceDiagram: ServiceDiagram, classId: string) {
  serviceDiagram.nodes
    .filter((node) => !["REMOTE_PROXY", "PLUGABLE_SERVICE"].includes(node.data.type))
    .forEach((node) => {
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
}

async function removeClassReferences(
  dispatcher: DispatcherType,
  classDiagram: ClassDiagram,
  microserviceId: string,
  classId: string
) {
  const references = classDiagram.edges.filter(
    (edge) => edge.source === classId || edge.target === classId
  );
  for (const reference of references) {
    await dispatcher(projectDefinitionActions.removeReference, {
      microserviceId,
      sourceClassId: reference.source,
      targetClassId: reference.target,
    });
  }
}

export { addClassHandler, updateClassHandler, deleteClassHandler };
