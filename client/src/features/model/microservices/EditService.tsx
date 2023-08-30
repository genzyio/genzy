import { type FC, useState } from "react";
import { type Service } from "./models";
import { TextField } from "../../../components/text-field";
import { ServiceCardCard } from "./ServiceCard";
import { IDENTIFIER_REGEX } from "../../../patterns";

type EditFunctionProps = {
  service: Service;
  onSave: (serviceName: string) => any;
  onDelete: () => any;
  nameExists: (name: string) => boolean;
};

export const EditService: FC<EditFunctionProps> = ({
  service: initialService,
  onSave,
  onDelete,
  nameExists,
}) => {
  const [preview, setPreview] = useState(true);
  const [serviceName, setServiceName] = useState(initialService.name);

  if (preview)
    return (
      <div className="py-2">
        <ServiceCardCard serviceName={serviceName} onEdit={() => setPreview(false)} />
      </div>
    );

  const isIdentifier = IDENTIFIER_REGEX.test(serviceName);
  const hasUniqueName = !nameExists(serviceName);

  const isValid = isIdentifier && hasUniqueName;

  return (
    <div className="border p-2 my-2">
      <div>
        <TextField
          value={serviceName}
          onChange={setServiceName}
          label="Service Name"
          error={(!isIdentifier && "Must be an identifier") || (!hasUniqueName && "Already exists")}
        />
      </div>

      <div className="flex justify-between mt-5">
        <div className="flex gap-x-2">
          <button
            disabled={!isValid}
            className={!isValid ? "text-gray-600" : ""}
            onClick={() => {
              setPreview(true);
              onSave(serviceName);
            }}
          >
            Save
          </button>
          <button
            onClick={() => {
              setPreview(true);
              setServiceName(initialService.name);
            }}
          >
            Cancel
          </button>
        </div>

        <button type="button" onClick={onDelete} className="text-red-500 p-1">
          Delete
        </button>
      </div>
    </div>
  );
};
