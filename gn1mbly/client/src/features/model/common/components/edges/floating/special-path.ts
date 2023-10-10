type GetSpecialPathParams = {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
};

type SpecialPath = [path: string, labelX: number, labelY: number];

function getSpecialPath(
  { sourceX, sourceY, targetX, targetY }: GetSpecialPathParams,
  offset: number
): SpecialPath {
  const centerX = (sourceX + targetX) / 2;
  const centerY = (sourceY + targetY) / 2;

  return [
    `M ${sourceX} ${sourceY} Q ${centerX + offset} ${centerY + offset} ${targetX} ${targetY}`,
    centerX + offset / 2,
    centerY + offset / 2,
  ];
}

export { getSpecialPath };
