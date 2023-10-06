import { useState, type FC } from "react";
import { type Microservice, type Language, type Service } from "./models";
import { TextField } from "../../../components/text-field";
import { Select } from "../../../components/select";
import { Button } from "../../../components/button";
import { IDENTIFIER_REGEX } from "../../../patterns";
import { EditService } from "./EditService";
import { useSequenceGenerator } from "../../../hooks/useStringSequence";
import { useValidationContext } from "../common/contexts/validation-context";
import { useDirtyCheckContext } from "../common/contexts/dirty-check-context";
import { useWatchModeContext } from "../../projects/contexts/watch-mode.context";
import { useChangeTrackerContext } from "../../projects/contexts/change-tracker-context";
import { Languages } from "./constants";

type MicroserviceDrawerProps = {
  microserviceId: string;
  microservice: Microservice;
  onMicroserviceUpdate: (microservice: Microservice) => any;
  nameExists: (name: string) => boolean;
};

const LanguageOptions = Object.entries(Languages).map(([extension, name]) => ({
  label: name,
  value: extension,
}));

export const MicroserviceDrawer: FC<MicroserviceDrawerProps> = ({
  microserviceId,
  microservice: initialMicroservice,
  onMicroserviceUpdate,
  nameExists,
}) => {
  const { isDirty, setCurrentState } = useDirtyCheckContext();
  const { isValid, setValidityFor } = useValidationContext();
  const { isMicroserviceActive } = useWatchModeContext();
  const { states } = useChangeTrackerContext();
  const microserviceActive = isMicroserviceActive(microserviceId);
  const microserviceNotSavedYet = states[microserviceId] === "ADDED";

  const [microserviceName, setMicroserviceName] = useState(initialMicroservice.name);
  const [version, setVersion] = useState(initialMicroservice.version);
  const [language, setLanguage] = useState<Language | "">(initialMicroservice.language || "");
  const [description, setDescription] = useState(initialMicroservice.description);
  const [basePath, setBasePath] = useState(initialMicroservice.basePath);
  const [services, setServices] = useState([...initialMicroservice.services]);
  const nextName = useSequenceGenerator(services, (service) => service.name, "Service");

  const handleMicroserviceNameUpdate = (newMicroserviceName: string) => {
    setMicroserviceName(newMicroserviceName);
    setCurrentState((state: any) => ({ ...state, name: newMicroserviceName }));
  };

  const handleMicroserviceVersionUpdate = (newVersion: string) => {
    setVersion(newVersion);
    setCurrentState((state: any) => ({ ...state, version: newVersion }));
  };

  const handleMicroserviceLanguageUpdate = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setCurrentState((state: any) => ({ ...state, language: newLanguage }));
  };

  const handleMicroserviceDescriptionUpdate = (newDescription: string) => {
    setDescription(newDescription);
    setCurrentState((state: any) => ({ ...state, description: newDescription }));
  };

  const handleMicroserviceBasePathUpdate = (newBasePath: string) => {
    setBasePath(newBasePath);
    setCurrentState((state: any) => ({ ...state, basePath: newBasePath }));
  };

  const handleAddService = () => {
    const newService: Service = {
      id: `${+new Date()}`,
      name: nextName(),
      type: "CONTROLLER",
    };
    const newServices = [...services, newService];
    setServices(newServices);
    setCurrentState((state: any) => ({ ...state, services: newServices }));
  };

  const handleUpdateService = (updatedService: Service) => {
    const newServices = services.map((service) => {
      if (service.id === updatedService.id)
        return {
          ...service,
          name: updatedService.name,
          type: updatedService.type,
        };
      return service;
    });
    setServices(newServices);
    setCurrentState((state: any) => ({ ...state, services: newServices }));
  };

  const handleDeleteService = (id: string) => {
    const newServices = services.filter((s) => s.id !== id);
    setServices(newServices);
    setCurrentState((state: any) => ({ ...state, services: newServices }));
  };

  const handleSave = () => {
    onMicroserviceUpdate({
      name: microserviceName,
      version,
      language,
      description,
      basePath,
      services,
      plugins: initialMicroservice.plugins,
    });
  };

  const isIdentifier = IDENTIFIER_REGEX.test(microserviceName);
  const hasUniqueName = !nameExists(microserviceName);

  const isValidMicroservice = isIdentifier && hasUniqueName;
  setValidityFor(microserviceId, isValidMicroservice);

  return (
    <div className="mx-4">
      <div className="flex mb-1 w-full">
        <div className="flex space-x-2 w-full">
          <div className="flex-1">
            <TextField
              label="Name"
              disabled={microserviceActive}
              value={microserviceName}
              onChange={handleMicroserviceNameUpdate}
              error={
                (!isIdentifier && "Must be an identifier") || (!hasUniqueName && "Already exists")
              }
            />
          </div>

          <TextField value={version} onChange={handleMicroserviceVersionUpdate} label="Version" />

          <Select
            label="Language"
            placeholder=""
            disabled={!microserviceNotSavedYet}
            value={language}
            options={LanguageOptions}
            onChange={handleMicroserviceLanguageUpdate}
          />
        </div>
      </div>
      <div className="mb-1 w-full">
        <TextField
          value={description}
          onChange={handleMicroserviceDescriptionUpdate}
          label="Description"
        />
      </div>
      <div className="mb-5 w-full">
        <TextField value={basePath} onChange={handleMicroserviceBasePathUpdate} label="Base Path" />
      </div>

      {!!services?.length && <p>Services</p>}
      {services.map((service, index) => (
        <EditService
          key={service.id}
          service={service}
          onChange={(changedService) => {
            handleUpdateService({ id: service.id, ...changedService });
          }}
          onDelete={() => handleDeleteService(service.id)}
          nameExists={(newServiceName) =>
            services.some((service, i) => i !== index && service.name === newServiceName)
          }
        />
      ))}
      <div className="flex justify-between">
        <Button type="button" onClick={handleAddService} className="text-sm mt-3">
          New service
        </Button>

        <div className="space-x-1">
          <Button
            type="button"
            className="text-sm mt-3"
            disabled={!isValid || !isDirty}
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
