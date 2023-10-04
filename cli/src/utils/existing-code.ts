import { JSTSParser } from "../parser/js-ts";
import type { ExtendedServiceInfo } from "../types";
import { pathExists, readFileSync } from "./general";

export function handleExistingCode(
  path: string,
  service: ExtendedServiceInfo,
  existingMethodsNotInMeta: string[]
) {
  const { methodBodyMap, wholeMethodMap } = getExistingMethods(path, service);
  const methodsFromMeta = new Set(service.actions.map((action) => action.name));
  const existingMethods = [...methodBodyMap.keys()]
    .filter(
      (methodName) =>
        !methodsFromMeta.has(methodName) && methodName !== "constructor"
    )
    .map((methodName) => wholeMethodMap.get(methodName));

  existingMethodsNotInMeta.push(...existingMethods);

  service.actions.forEach((action) => {
    // TODO handle type
    const existingAction = action as any;
    existingAction.existingBody = methodBodyMap.get(action.name);
  });
}

export function getExistingMethods(
  path: string,
  controller: ExtendedServiceInfo
): {
  methodBodyMap: Map<string, string>;
  wholeMethodMap: Map<string, string>;
} {
  const methodBodyMap = new Map<string, string>();
  const wholeMethodMap = new Map<string, string>();
  if (pathExists(path)) {
    try {
      const classObj = JSTSParser.parse(readFileSync(path)).classes.find(
        (x) => x.name === controller.name
      );
      classObj.sections
        // TODO capture in-between sections, like comments as well
        .filter((section) => section.type === "method")
        .forEach((method) => {
          wholeMethodMap.set(
            method.name,
            `${method.privateMatch ?? ""} ${method.asyncMatch ?? ""} ${
              method.overrideMatch ?? ""
            } ${method.name} ${method.params} ${method.body}`
          );
          methodBodyMap.set(method.name, method.body);
        });
    } catch (error) {
      console.log("Parsing error: ", readFileSync(path), error);
    }
  }
  return { methodBodyMap, wholeMethodMap };
}
