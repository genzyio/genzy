import { type FC, useState } from "react";
import { type Microservice, type Language } from "../models";
import { TextField } from "../../../../core/components/text-field";
import { LanguagesListitem } from "./LanguagesListbox";
import { useWatchModeContext } from "../../../project-workspace/contexts/watch-mode.context";
import { useChangeTrackerContext } from "../../../project-workspace/contexts/change-tracker-context";
import { useValidationContext } from "../../common/contexts/validation-context";
import { IDENTIFIER_REGEX } from "../../../../patterns";

type MicroserviceFormProps = {
  microserviceId: string;
  microservice: Microservice;
  onMicroservicePartialUpdate: (microservicePart: Partial<Microservice>) => any;
  nameExists: (name: string) => boolean;
};

export const MicroserviceForm: FC<MicroserviceFormProps> = ({
  microserviceId,
  microservice: initialMicroservice,
  onMicroservicePartialUpdate,
  nameExists,
}) => {
  const { setValidityFor } = useValidationContext();
  const { isMicroserviceActive } = useWatchModeContext();
  const microserviceActive = isMicroserviceActive(microserviceId);
  const { isMSInState } = useChangeTrackerContext();
  const microserviceNotSavedYet = isMSInState(microserviceId, "ADDED");

  const [name, setName] = useState(initialMicroservice.name);
  const [version, setVersion] = useState(initialMicroservice.version);
  const [language, setLanguage] = useState<Language | "">(initialMicroservice.language || "");
  const [description, setDescription] = useState(initialMicroservice.description);
  const [basePath, setBasePath] = useState(initialMicroservice.basePath);

  const handleNameUpdate = (newName: string) => {
    setName(newName);
    onMicroservicePartialUpdate({ name: newName });
  };

  const handleVersionUpdate = (newVersion: string) => {
    setVersion(newVersion);
    onMicroservicePartialUpdate({ version: newVersion });
  };

  const handleLanguageUpdate = (newLanguage: Language) => {
    setLanguage(newLanguage);
    onMicroservicePartialUpdate({ language: newLanguage });
  };

  const handleDescriptionUpdate = (newDescription: string) => {
    setDescription(newDescription);
    onMicroservicePartialUpdate({ description: newDescription });
  };

  const handleBasePathUpdate = (newBasePath: string) => {
    setBasePath(newBasePath);
    onMicroservicePartialUpdate({ basePath: newBasePath });
  };

  const isIdentifier = IDENTIFIER_REGEX.test(name);
  const hasUniqueName = !nameExists(name);

  const isValidMicroservice = isIdentifier && hasUniqueName;
  setValidityFor(microserviceId, isValidMicroservice);

  return (
    <>
      <div className="flex mb-1 w-full">
        <div className="flex space-x-2 w-full">
          <div className="flex-1">
            <TextField
              label="Name"
              disabled={microserviceActive}
              value={name}
              onChange={handleNameUpdate}
              error={
                (!isIdentifier && "Must be an identifier") || (!hasUniqueName && "Already exists")
              }
            />
          </div>

          <TextField value={version} onChange={handleVersionUpdate} label="Version" />

          <LanguagesListitem
            className="w-[10em]"
            disabled={!microserviceNotSavedYet}
            value={language}
            onChange={handleLanguageUpdate}
          />
        </div>
      </div>
      <div className="mb-1 w-full">
        <TextField value={description} onChange={handleDescriptionUpdate} label="Description" />
      </div>
      <div className="mb-5 w-full">
        <TextField value={basePath} onChange={handleBasePathUpdate} label="Base Path" />
      </div>
    </>
  );
};
