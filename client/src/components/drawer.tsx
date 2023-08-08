import { type FC, type PropsWithChildren, useState } from "react";

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
        "fixed overflow-hidden z-30 inset-0 bg-gray-400 bg-opacity-25 transform ease-in-out" +
        (isOpen
          ? "transition-opacity opacity-100 duration-500 translate-x-0"
          : `transition-all delay-100 opacity-0 duration-1000 ${
              side === "left" ? "-translate-x-full" : "translate-x-full"
            }`)
      }
    >
      <div
        className={
          `border-l w-full ${large ? "md:max-w-4xl" : "sm:w-4/5 md:w-3/5 lg:w-2/5 xl:max-w-lg"} ${
            side === "left" ? "left-0" : "right-0"
          } absolute bg-white h-full shadow-xl delay-400 duration-500 ease-in-out transition-all transform` +
          (isOpen ? "translate-x-0" : "translate-x-full")
        }
      >
        <div className={`relative w-full pb-10 flex flex-col space-y-6 overflow-y-auto h-full`}>
          <div
            className={`flex ${
              side === "left" ? "flex-row-reverse" : "flex-row"
            } pl-4 pr-6 pt-8 pb-2 font-bold text-2xl text-blue-900 justify-between`}
          >
            {title && typeof title === "string" ? <span className="ml-3">{title}</span> : title}
            <button
              className="bg-white rounded-md text-blue-900 hover:text-blue-500"
              onClick={() => handleClose()}
            >
              <span className="sr-only">Close</span>
              X
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
