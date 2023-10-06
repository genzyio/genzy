import { type ComponentProps, type FC } from "react";

type TextFieldProps = {
  label?: string;
  helpText?: string;
  onChange: (newValue: string) => any;
  error?: any;
} & Omit<ComponentProps<"input">, "onChange" | "type">;

export const TextField: FC<TextFieldProps> = ({ label, helpText, onChange, error, ...props }) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium leading-6 text-gray-900">{label}</label>
      )}
      <div className="mt-1">
        <input
          type="text"
          onChange={(e) => onChange(e.target.value)}
          {...props}
          className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset ${
            error ? "focus:ring-red-600" : "focus:ring-indigo-600"
          } sm:text-sm sm:leading-6`}
        />
      </div>
      {helpText && <p className="text-sm leading-6 text-gray-600">{helpText}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};
