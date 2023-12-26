import { type FC, type PropsWithChildren } from "react";

type NodeBaseProps = PropsWithChildren & {
  header?: string | JSX.Element;
  title: string | JSX.Element;
  description?: string | JSX.Element;
  borderColor: string;
};

export const NodeBase: FC<NodeBaseProps> = ({
  header,
  title,
  description,
  borderColor,
  children,
}) => {
  return (
    <div
      className={`p-4 rounded-lg border-2 bg-brand-node-dark ${borderColor} flex flex-col gap-y-2`}
    >
      <div className="text-center w-full my-2">
        {header && <p className="text-xs text-gray-400">{header}</p>}

        <h2 className={typeof title === "string" ? "text-xl" : "flex justify-center"}>{title}</h2>

        {!!description && <h6 className="text-center text-xs text-gray-500">{description}</h6>}
      </div>

      {children}
    </div>
  );
};
