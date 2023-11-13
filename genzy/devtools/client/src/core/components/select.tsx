import { type FC, type ComponentProps, useMemo } from "react";

type Option = string | { value: string; label: string; category?: string };

type SelectProps = {
  label?: string;
  options: Option[];
  onChange: (newValue: string) => any;
} & Omit<ComponentProps<"select">, "onChange">;

export const Select: FC<SelectProps> = ({ label, options, onChange, placeholder, ...props }) => {
  const optionsByCategory = useMemo(() => {
    return options.reduce((acc: Record<string, Option[]>, option: Option) => {
      const category = typeof option === "string" ? "" : option.category || "";
      if (!acc[category]) acc[category] = [];
      acc[category].push(option);
      return acc;
    }, {});
  }, [options]);

  return (
    <div>
      {label && <label className="block text-sm font-medium leading-6">{label}</label>}
      <div className="mt-1">
        <select
          onChange={(e) => onChange(e.target.value)}
          {...props}
          className="block w-full rounded-md border-0 py-1.5 bg-brand-node-dark shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
        >
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {Object.entries(optionsByCategory).map(([category, options]) => {
            const OptionsList = options.map((option, i) =>
              typeof option === "string" ? (
                <option key={i} value={option}>
                  {option}
                </option>
              ) : (
                <option key={i} value={option.value}>
                  {option.label}
                </option>
              )
            );

            if (category) {
              return (
                <optgroup key={category} label={category}>
                  {OptionsList}
                </optgroup>
              );
            } else {
              return OptionsList;
            }
          })}
        </select>
      </div>
    </div>
  );
};
