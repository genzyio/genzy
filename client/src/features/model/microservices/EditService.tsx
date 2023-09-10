import { type FC, useState } from "react";
import { type Service } from "./models";
import { TextField } from "../../../components/text-field";
import { ServiceCardCard } from "./ServiceCard";
import { IDENTIFIER_REGEX } from "../../../patterns";
import { RoundCard } from "../common/components/RoundCard";
import { Select } from "../../../components/select";
import { SERVICE_TYPE_DISPLAY_NAME } from "../service/models";
import { ClosableWrapper } from "../common/components/ClosableWrapper";
import cloneDeep from "lodash.clonedeep";

const serviceTypeOptions = Object.entries(SERVICE_TYPE_DISPLAY_NAME)
  .filter(([value, _]) => value !== "REMOTE_PROXY")
  .map(([value, label]) => ({
    value,
    label,
  }));

type EditFunctionProps = {
  service: Service;
  onChange: (service: Service) => any;
  onDelete: () => any;
  nameExists: (name: string) => boolean;
};

export const EditService: FC<EditFunctionProps> = ({ service, onChange, onDelete, nameExists }) => {
  const [preview, setPreview] = useState(true);
  const [initialService, setInitialService] = useState(cloneDeep(service));

  const { name: serviceName, type: serviceType } = service;
  const changeServiceName = (name: string) => onChange({ ...service, name });
  const changeServiceType = (type: "LOCAL" | "CONTROLLER") => onChange({ ...service, type });

  if (preview)
    return (
      <RoundCard className="py-2">
        <ServiceCardCard service={service} onEdit={() => setPreview(false)} onDelete={onDelete} />
      </RoundCard>
    );

  const isIdentifier = IDENTIFIER_REGEX.test(serviceName);
  const hasUniqueName = !nameExists(serviceName);

  const isValid = isIdentifier && hasUniqueName;

  return (
    <RoundCard className="py-2">
      <ClosableWrapper
        hidden={!isValid}
        onClick={() => {
          setPreview(true);
          setInitialService(cloneDeep(service));
        }}
      >
        <div className="space-y-2">
          <TextField
            label="Service Name"
            value={serviceName}
            onChange={changeServiceName}
            error={
              (!isIdentifier && "Must be an identifier") || (!hasUniqueName && "Already exists")
            }
          />
          <Select
            label="Service Type"
            value={serviceType}
            onChange={changeServiceType}
            options={serviceTypeOptions}
          />
        </div>

        <div className="flex justify-end space-x-2 mt-5">
          <button
            onClick={() => {
              setPreview(true);
              onChange(initialService);
            }}
          >
            Cancel
          </button>
        </div>
      </ClosableWrapper>
    </RoundCard>
  );
};
