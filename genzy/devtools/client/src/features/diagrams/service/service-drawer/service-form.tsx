import { type FC, useState } from "react";
import { type Service, type ServiceType } from "../models";
import { TextField } from "@core/components/text-field";
import { useValidationContext } from "../../common/contexts/validation.context";
import { IDENTIFIER_REGEX } from "../../../../patterns";
import { Select } from "@core/components/select";
import { SERVICE_TYPE_DISPLAY_NAME } from "../models";

const serviceTypeOptions = Object.entries(SERVICE_TYPE_DISPLAY_NAME)
  .filter(([value, _]) => !["REMOTE_PROXY", "PLUGABLE_SERVICE"].includes(value))
  .map(([value, label]) => ({
    value,
    label,
  }));

type ServiceFormProps = {
  serviceId: string;
  service: Service;
  onServicePartialUpdate: (servicePart: Partial<Service>) => any;
  nameExists: (name: string) => boolean;
};

export const ServiceForm: FC<ServiceFormProps> = ({
  serviceId,
  service: initialService,
  onServicePartialUpdate,
  nameExists,
}) => {
  const { setValidityFor } = useValidationContext();

  const [service, setService] = useState({ ...initialService });
  const showHost = ["API_INTEGRATION"].includes(service.type);
  const showBasePath = ["API_INTEGRATION", "CONTROLLER"].includes(service.type);

  const handleNameUpdate = (newName: string) => {
    setService((service) => ({ ...service, name: newName }));
    onServicePartialUpdate({ name: newName });
  };

  const handleTypeChange = (newType: ServiceType) => {
    setService((service) => ({ ...service, type: newType }));
    onServicePartialUpdate({ type: newType });
  };

  const handleHostChange = (newHost: string) => {
    setService((service) => ({ ...service, host: newHost }));
    onServicePartialUpdate({ host: newHost });
  };

  const handleBasePathUpdate = (newBasePath: string) => {
    setService((service) => ({ ...service, basePath: newBasePath }));
    onServicePartialUpdate({ basePath: newBasePath });
  };

  const isIdentifier = IDENTIFIER_REGEX.test(service.name);
  const hasUniqueName = !nameExists(service.name);

  const isValidService = isIdentifier && hasUniqueName;
  setValidityFor(serviceId, isValidService);

  return (
    <>
      <div className="flex mb-1 w-full space-x-2">
        <span className="w-2/3">
          <TextField
            label="Name"
            value={service.name}
            onChange={handleNameUpdate}
            error={
              (!isIdentifier && "Must be an identifier") || (!hasUniqueName && "Already exists")
            }
          />
        </span>
        <span className="w-1/3">
          <Select
            label="Type"
            value={service.type}
            onChange={(type) => handleTypeChange(type as ServiceType)}
            options={serviceTypeOptions}
          />
        </span>
      </div>
      <div className="flex w-full mb-5 space-x-2">
        <span className="w-1/2" hidden={!showHost}>
          <TextField value={service.host} onChange={handleHostChange} label="Host" />
        </span>
        <span className={showHost ? "w-1/2" : "flex-1"} hidden={!showBasePath}>
          <TextField value={service.basePath} onChange={handleBasePathUpdate} label="Base Path" />
        </span>
      </div>
    </>
  );
};
