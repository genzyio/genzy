import type {
  ComplexTypeProperties,
  MetaTypesRegistry,
} from "../../../shared/types";

export function sortedTypes(types: MetaTypesRegistry): any {
  const vals: { [key: string]: string[] } = {};
  Object.keys(types).map((typeName: string) => {
    vals[typeName] = typeDependsOn(types[typeName]);
  });
  const result = topologicalSort(vals);
  return { sorted: result, dependencies: vals };
}

function topologicalSort(graph: { [key: string]: string[] }): string[] {
  const visited: { [key: string]: boolean } = {};
  const stack: string[] = [];

  function dfs(vertex: string) {
    visited[vertex] = true;
    const neighbors = graph[vertex] || [];
    for (const neighbor of neighbors) {
      if (!visited[neighbor]) {
        dfs(neighbor);
      }
    }
    stack.push(vertex);
  }

  for (const vertex of Object.keys(graph)) {
    if (!visited[vertex]) {
      dfs(vertex);
    }
  }

  return stack;
}

function typeDependsOn(type: ComplexTypeProperties): string[] {
  return Object.values(type)
    .filter((field) => {
      return field["$typeName"] !== undefined;
    })
    .map((field) => field["$typeName"]);
}
