type ArrayDiff<T> = {
  new: T[];
  existing: T[];
  removed: T[];
};

function findArrayDiff<T>(
  oldArray: T[],
  newArray: T[],
  compareBy: (e: T) => any = (e) => e
): ArrayDiff<T> {
  const oldSet = new Set<T>(oldArray.map(compareBy));
  const newSet = new Set<T>(newArray.map(compareBy));

  return {
    new: newArray.filter((e) => !oldSet.has(compareBy(e))),
    existing: newArray.filter((e) => oldSet.has(compareBy(e))),
    removed: oldArray.filter((e) => !newSet.has(compareBy(e))),
  };
}

export { findArrayDiff };

export type { ArrayDiff };
