import { type FC, type PropsWithChildren, useState } from "react";
import { XMark } from "../icons/x-mark";

export const Drawer: FC<
  {
    open: boolean;
    onClose: () => unknown;
    title?: string | JSX.Element;
    side?: "right" | "left";
    large?: boolean;
  } & PropsWithChildren
> = ({ open, onClose, title, children, side = "right", large = false }) => {
  const [internalOpen, setInternalOpen] = useState(true);

  const isOpen = internalOpen && open;

  const handleClose = () => {
    setInternalOpen(false);
    setTimeout(() => {
      onClose();
      setInternalOpen(true);
    }, 500);
  };

  return (
    <div
      className={
        "fixed overflow-hidden z-30 inset-0 bg-brand-node-dark bg-opacity-25 transform ease-in-out" +
        (isOpen
          ? "transition-opacity opacity-100 duration-500 translate-x-0"
          : `transition-all delay-100 opacity-0 duration-1000 ${
              side === "left" ? "-translate-x-full" : "translate-x-full"
            }`)
      }
    >
      <div
        className={
          `border-l border-brand-node-gray w-full ${
            large ? "md:max-w-4xl" : "sm:w-4/5 md:w-3/5 lg:w-3/5 xl:max-w-xl"
          } ${
            side === "left" ? "left-0" : "right-0"
          } absolute bg-brand-node-dark h-full shadow-xl delay-400 duration-500 ease-in-out transition-all transform` +
          (isOpen ? "translate-x-0" : "translate-x-full")
        }
      >
        <div className={`relative w-full pb-10 flex flex-col space-y-6 overflow-y-auto h-full`}>
          <div
            className={`flex ${
              side === "left" ? "flex-row-reverse" : "flex-row"
            } pl-4 pr-6 pt-8 pb-2 font-bold text-2xl text-gray-300 justify-between`}
          >
            {title && typeof title === "string" ? <span className="ml-3">{title}</span> : title}
            <button
              className="rounded-md text-gray-300 hover:text-gray-200"
              onClick={() => handleClose()}
            >
              <XMark className="h-6 w-6" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
