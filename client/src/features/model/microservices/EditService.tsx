import { type FC, useState } from "react";
import { type Service } from "./models";
import { TextField } from "../../../components/text-field";
import { ServiceCardCard } from "./ServiceCard";
import { IDENTIFIER_REGEX } from "../../../patterns";
import { RoundCard } from "../common/components/RoundCard";
import { Select } from "../../../components/select";
import { SERVICE_TYPE_DISPLAY_NAME } from "../service/models";

const serviceTypeOptions = Object.entries(SERVICE_TYPE_DISPLAY_NAME)
  .filter(([value, _]) => value !== "REMOTE_PROXY")
  .map(([value, label]) => ({
    value,
    label,
  }));

type EditFunctionProps = {
  service: Service;
  onSave: (serviceName: string, serviceType: "LOCAL" | "CONTROLLER") => any;
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
  const [serviceType, setServiceType] = useState(initialService.type);

  if (preview)
    return (
      <RoundCard className="py-2">
        <ServiceCardCard
          service={initialService}
          onEdit={() => setPreview(false)}
          onDelete={onDelete}
        />
      </RoundCard>
    );

  const isIdentifier = IDENTIFIER_REGEX.test(serviceName);
  const hasUniqueName = !nameExists(serviceName);

  const isValid = isIdentifier && hasUniqueName;

  return (
    <RoundCard className="py-2">
      <div className="space-y-2">
        <TextField
          label="Service Name"
          value={serviceName}
          onChange={setServiceName}
          error={(!isIdentifier && "Must be an identifier") || (!hasUniqueName && "Already exists")}
        />
        <Select
          label="Service Type"
          value={serviceType}
          onChange={(value: any) => setServiceType(value)}
          options={serviceTypeOptions}
        />
      </div>

      <div className="flex justify-end space-x-2 mt-5">
        <button
          disabled={!isValid}
          className={!isValid ? "text-gray-600" : ""}
          onClick={() => {
            setPreview(true);
            onSave(serviceName, serviceType);
          }}
        >
          Save
        </button>
        <button
          onClick={() => {
            setPreview(true);
            setServiceName(initialService.name);
            setServiceType(initialService.type);
          }}
        >
          Cancel
        </button>
      </div>
    </RoundCard>
  );
};
