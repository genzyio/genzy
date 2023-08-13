import { type FC } from "react";

type TextFieldProps = {
  label?: string;
  helpText?: string;
  value: string;
  onChange: (newValue: string) => any;
  disabled?: boolean;
};

export const TextField: FC<TextFieldProps> = ({
  label = undefined,
  helpText = undefined,
  value,
  onChange,
  disabled = false,
}: any) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium leading-6 text-gray-900">{label}</label>
      )}
      <div className="mt-1">
        <input
          type="text"
          disabled={disabled ?? false}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
      {helpText && <p className="text-sm leading-6 text-gray-600">{helpText}</p>}
    </div>
  );
};
