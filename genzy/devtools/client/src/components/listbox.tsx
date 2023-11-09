import { type FC, type ComponentProps, Fragment, useMemo } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { classNames } from "../utils/classNames";

export type ListboxTemplateProps<T> = {
  selected?: boolean;
  active?: boolean;
  disabled?: boolean;
  data: T;
};

type ListboxOption<T> = {
  value: string;
  data: T;
};

export type ListboxProps = {
  label?: string;
  options: ListboxOption<any>[];
  template: JSX.ElementType;
  disabled?: boolean;
  onChange: (newValue: string) => any;
} & Omit<ComponentProps<"select">, "onChange">;

const CustomListbox: FC<ListboxProps> = ({
  label,
  value,
  options,
  template: Template,
  disabled = false,
  onChange,
}) => {
  const selectedItem = useMemo(
    () => options.find((option) => option.value === value)?.data,
    [options, value]
  );

  return (
    <div>
      <Listbox disabled={disabled} value={value} onChange={onChange}>
        {({ open }) => (
          <>
            {label && (
              <Listbox.Label className="block text-sm font-medium leading-6">{label}</Listbox.Label>
            )}
            <div className="relative mt-1">
              <Listbox.Button
                className={classNames(
                  "relative h-9 min-w-[9em] w-full cursor-default pl-3 pr-10 py-1.5 rounded-md border-0 bg-brand-node-dark shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6 select-arrow-down",
                  disabled ? "opacity-70" : ""
                )}
              >
                <span className="flex items-center">
                  {selectedItem ? (
                    <Template
                      active={false}
                      selected={false}
                      disabled={disabled}
                      data={selectedItem}
                    />
                  ) : (
                    <></>
                  )}
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md border-[1px] border-gray-500 bg-brand-node-dark py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {options.map(({ value, data }) => (
                    <Listbox.Option
                      key={value}
                      className={({ active }) =>
                        classNames(
                          active ? "bg-gray-500 text-white" : "text-gray-200",
                          "relative cursor-default select-none py-2 pl-2 pr-7"
                        )
                      }
                      value={value}
                    >
                      {({ selected, active }) => (
                        <div>
                          <Template active={active} selected={selected} data={data} />
                          {selected ? (
                            <span
                              className={classNames(
                                active ? "text-white" : "text-gray-200",
                                "absolute inset-y-0 right-0 flex items-center pr-2"
                              )}
                            >
                              <CheckIcon className="h-4 w-4" aria-hidden="true" />
                            </span>
                          ) : null}
                        </div>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    </div>
  );
};

export { CustomListbox as Listbox };
