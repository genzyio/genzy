import { type ComponentProps, type FC } from "react";

type SelectProps = {
  label?: string;
  options: (string | { value: string; label: string })[];
  onChange: (newValue: string) => any;
} & Omit<ComponentProps<"select">, "onChange">;

export const Select: FC<SelectProps> = ({ label, options, onChange, placeholder, ...props }) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium leading-6 text-gray-900">{label}</label>
      )}
      <div className="mt-1">
        <select
          onChange={(e) => onChange(e.target.value)}
          {...props}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        >
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {options.map((option, i) =>
            typeof option === "string" ? (
              <option key={i} value={option}>
                {option}
              </option>
            ) : (
              <option key={i} value={option.value}>
                {option.label}
              </option>
            )
          )}
        </select>
      </div>
    </div>
  );
};
