import { type FC, useEffect, useState } from "react";
import { type Edge } from "reactflow";
import { type Communication } from "./models";
import { useProjectDefinitionContext } from "@features/project-workspace/contexts/project-definition.context";
import { ConfirmationModal } from "@core/components/confirmation-modal";

export type RemoveCommunicationModalInstance = {
  openFor: (edge: Edge<Communication>) => any;
};

type RemoveCommunicationModalProps = {
  onInit: (instance: RemoveCommunicationModalInstance) => any;
  handleRemove: (edge: Edge<Communication>) => any;
};

export const RemoveCommunicationModal: FC<RemoveCommunicationModalProps> = ({
  onInit,
  handleRemove,
}) => {
  const { nodes } = useProjectDefinitionContext().projectDefinition.microservices;

  const [instance] = useState({} as RemoveCommunicationModalInstance);
  const [communicationToRemove, setCommunicationToRemove] = useState<Edge<Communication>>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    onInit && onInit(instance);
  }, []);

  useEffect(() => {
    instance.openFor = (edge: Edge<Communication>) => {
      setCommunicationToRemove(edge);
      setIsModalOpen(true);
    };
  }, [setCommunicationToRemove, setIsModalOpen]);

  const onRemove = async () => {
    await handleRemove(communicationToRemove);

    setIsModalOpen(false);
    setCommunicationToRemove(undefined);
  };

  const onCancel = () => {
    setIsModalOpen(false);
    setCommunicationToRemove(undefined);
  };

  const [targetMicroserviceName, setTargetMicroserviceName] = useState<string>("");
  useEffect(() => {
    const newTargetMicroservice = nodes.find((node) => node.id === communicationToRemove?.target);
    const newTargetMicroserviceName = newTargetMicroservice?.data?.name ?? "";

    setTargetMicroserviceName(
      (currentTargetMicroserviceName) => newTargetMicroserviceName || currentTargetMicroserviceName
    );
  }, [communicationToRemove, setTargetMicroserviceName]);

  return (
    <ConfirmationModal
      title={`Stop communication with ${targetMicroserviceName}`}
      isOpen={isModalOpen}
      onYes={onRemove}
      onClose={onCancel}
    >
      <span>
        Are you sure that you want to stop communication with {targetMicroserviceName}. By stopping
        communication, all remote proxies to this microservice will be removed.
      </span>
    </ConfirmationModal>
  );
};
