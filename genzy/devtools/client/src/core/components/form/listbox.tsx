import { type FC, type ComponentProps, Fragment, useMemo } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { classNames } from "../../utils/class-names";

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
                  "relative h-9 w-full cursor-default pr-7 rounded-md border-0 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6 select-arrow-down",
                  disabled ? "opacity-70" : "",
                  getBackgroundColor(false, selectedItem)
                )}
              >
                {selectedItem ? (
                  <Template
                    active={false}
                    selected={false}
                    disabled={disabled}
                    data={selectedItem}
                  />
                ) : (
                  <div></div>
                )}
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options
                  className={
                    "absolute z-10 mt-1 max-h-56 py-1 w-full overflow-auto rounded-md border-[1px] border-gray-500 bg-brand-node-dark text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                  }
                >
                  {options.map(({ value, data }) => (
                    <Listbox.Option
                      key={value}
                      className={({ active }) =>
                        classNames(
                          active ? "text-white" : "text-gray-200",
                          "relative cursor-default select-none pr-7",
                          getBackgroundColor(active, data)
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

function getBackgroundColor(active: boolean, item: any) {
  const { bgColor, bgColorActive } = item?.styles ?? {};
  const backgroundColor = active ? bgColorActive || bgColor : bgColor;
  const defaultBackgroundColor = active ? "bg-gray-500" : "bg-brand-node-dark";

  return backgroundColor || defaultBackgroundColor;
}

export { CustomListbox as Listbox };
