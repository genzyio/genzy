import { type FC } from "react";
import { type Service } from "../models";
import { TextField } from "@core/components/text-field";
import { Select } from "@core/components/select";
import { useValidationContext } from "../../common/contexts/validation-context";
import { IDENTIFIER_REGEX } from "../../../../patterns";
import { SERVICE_TYPE_DISPLAY_NAME } from "../../service/models";

const serviceTypeOptions = Object.entries(SERVICE_TYPE_DISPLAY_NAME)
  .filter(([value, _]) => !["REMOTE_PROXY", "PLUGABLE_SERVICE"].includes(value))
  .map(([value, label]) => ({
    value,
    label,
  }));

type ServiceFormProps = {
  service: Service;
  onChange: (service: Service) => any;
  nameExists: (name: string) => boolean;
};

export const ServiceForm: FC<ServiceFormProps> = ({ service, onChange, nameExists }) => {
  const { setValidityFor } = useValidationContext();

  const { name: serviceName, type: serviceType } = service;
  const changeServiceName = (name: string) => onChange({ ...service, name });
  const changeServiceType = (type: "LOCAL" | "CONTROLLER") => onChange({ ...service, type });

  const isIdentifier = IDENTIFIER_REGEX.test(serviceName);
  const hasUniqueName = !nameExists(serviceName);
  const isValidService = isIdentifier && hasUniqueName;
  setValidityFor(service.id, isValidService);

  return (
    <>
      <div className="space-y-2">
        <TextField
          label="Service Name"
          value={serviceName}
          onChange={changeServiceName}
          error={(!isIdentifier && "Must be an identifier") || (!hasUniqueName && "Already exists")}
        />
        <Select
          label="Service Type"
          value={serviceType}
          onChange={changeServiceType}
          options={serviceTypeOptions}
        />
      </div>
    </>
  );
};
