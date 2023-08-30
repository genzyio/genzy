import { type FC } from "react";

type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => any;
};

export const Checkbox: FC<CheckboxProps> = ({ label, checked, onChange }) => {
  return (
    <>
      <div className="flex space-x-2">
        <div>
          <input
            name={label}
            type="checkbox"
            checked={checked || false}
            onChange={(e) => onChange(e.target.checked)}
          />
        </div>
        <label className="text-lg font-medium text-gray-700" htmlFor={label}>
          {label}
        </label>
      </div>
    </>
  );
};
