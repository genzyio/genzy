import { type Node } from "reactflow";

function areCoordinatesDifferent({ x: x1, y: y1 }, { x: x2, y: y2 }) {
  return x1 !== x2 || y1 !== y2;
}
function isNodeMoved(firstNode: Node, secondNode: Node): boolean {
  if (!firstNode || !secondNode) return false;

  const isPositionDifferent = areCoordinatesDifferent(firstNode.position, secondNode.position);

  const hasPositionAbsolute = firstNode.positionAbsolute && secondNode.positionAbsolute;
  if (!hasPositionAbsolute) return isPositionDifferent;

  const isPositionAbsoluteDifferent = areCoordinatesDifferent(
    firstNode.positionAbsolute,
    secondNode.positionAbsolute
  );

  return isPositionDifferent || isPositionAbsoluteDifferent;
}

export { isNodeMoved };
