import { type FC, type PropsWithChildren } from "react";

type SectionProps = PropsWithChildren & {
  name: string;
};

export const Section: FC<SectionProps> = ({ name, children }) => {
  return (
    <div className="mb-5">
      <div className="text-semibold text-lg">{name}</div>
      <div className="mt-1 mb-2 border-b w-full border-gray-300" />
      {children}
    </div>
  );
};
