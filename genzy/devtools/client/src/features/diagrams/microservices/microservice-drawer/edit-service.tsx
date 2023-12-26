import { type FC, useState } from "react";
import { type Service } from "../models";
import { ServiceCard } from "./service-card";
import { RoundCard } from "../../common/components/round-card";
import { ClosableWrapper } from "../../common/components/closable-wrapper";
import { useValidationContext } from "../../common/contexts/validation.context";
import { ServiceForm } from "./service-form";
import cloneDeep from "lodash.clonedeep";

type EditServiceProps = {
  service: Service;
  onChange: (service: Service) => any;
  onDelete: () => any;
  nameExists: (name: string) => boolean;
};

export const EditService: FC<EditServiceProps> = ({ service, onChange, onDelete, nameExists }) => {
  const { getValidityFor, setValidityFor } = useValidationContext();
  const isValidService = getValidityFor(service.id);

  const [preview, setPreview] = useState(true);
  const [initialService, setInitialService] = useState(cloneDeep(service));

  if (preview)
    return (
      <RoundCard className="py-2">
        <ServiceCard service={service} onEdit={() => setPreview(false)} onDelete={onDelete} />
      </RoundCard>
    );

  return (
    <RoundCard className="py-2">
      <ClosableWrapper
        hidden={!isValidService}
        onClick={() => {
          setPreview(true);
          setInitialService(cloneDeep(service));
        }}
      >
        <ServiceForm service={service} onChange={onChange} nameExists={nameExists} />

        <div className="flex justify-end space-x-2 mt-5">
          <button
            className="hover:text-gray-400"
            onClick={() => {
              setPreview(true);
              setValidityFor(service.id, true);
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
