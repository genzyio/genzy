import { type FC, useEffect, useState } from "react";
import { type Node } from "reactflow";
import { type Microservice } from "./models";
import { ConfirmationModal } from "@core/components/confirmation-modal";

export type RemoveMicroserviceModalInstance = {
  openFor: (node: Node<Microservice>) => any;
};

type RemoveMicroserviceModalProps = {
  onInit: (instance: RemoveMicroserviceModalInstance) => any;
  handleRemove: (node: Node<Microservice>) => any;
};

export const RemoveMicroserviceModal: FC<RemoveMicroserviceModalProps> = ({
  onInit,
  handleRemove,
}) => {
  const [instance] = useState({} as RemoveMicroserviceModalInstance);
  const [microserviceToRemove, setMicroserviceToRemove] = useState<Node<Microservice>>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    onInit && onInit(instance);
  }, []);

  useEffect(() => {
    instance.openFor = (node: Node<Microservice>) => {
      setMicroserviceToRemove(node);
      setIsModalOpen(true);
    };
  }, [setMicroserviceToRemove, setIsModalOpen]);

  const onRemove = async () => {
    await handleRemove(microserviceToRemove);

    setIsModalOpen(false);
    setMicroserviceToRemove(undefined);
  };

  const onCancel = () => {
    setIsModalOpen(false);
    setMicroserviceToRemove(undefined);
  };

  const [microserviceName, setMicroserviceName] = useState<string>("");
  useEffect(() => {
    const newSelectedMicroserviceName = microserviceToRemove?.data?.name ?? "";

    setMicroserviceName(
      (currentMicroserviceName) => newSelectedMicroserviceName || currentMicroserviceName
    );
  }, [microserviceToRemove, setMicroserviceName]);

  return (
    <ConfirmationModal
      title={`Delete ${microserviceName}`}
      isOpen={isModalOpen}
      onYes={onRemove}
      onClose={onCancel}
    >
      <span>
        Are you sure that you want to delete {microserviceName}. By deleting {microserviceName}, all
        communication will be removed.
      </span>
    </ConfirmationModal>
  );
};
