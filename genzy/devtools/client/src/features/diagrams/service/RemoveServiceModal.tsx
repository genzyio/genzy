import { type FC, useEffect, useState } from "react";
import { type Node } from "reactflow";
import { type Service } from "./models";
import { ConfirmationModal } from "../../../core/components/confirmation-modal";

export type RemoveServiceModalInstance = {
  openFor: (node: Node<Service>) => any;
};

type RemoveServiceModalProps = {
  onInit: (instance: RemoveServiceModalInstance) => any;
  handleRemove: (node: Node<Service>) => any;
};

export const RemoveServiceModal: FC<RemoveServiceModalProps> = ({ onInit, handleRemove }) => {
  const [instance] = useState({} as RemoveServiceModalInstance);
  const [serviceToRemove, setServiceToRemove] = useState<Node<Service>>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    onInit && onInit(instance);
  }, []);

  useEffect(() => {
    instance.openFor = (node: Node<Service>) => {
      setServiceToRemove(node);
      setIsModalOpen(true);
    };
  }, [setServiceToRemove, setIsModalOpen]);

  const onRemove = async () => {
    await handleRemove(serviceToRemove);

    setIsModalOpen(false);
    setServiceToRemove(undefined);
  };

  const onCancel = () => {
    setIsModalOpen(false);
    setServiceToRemove(undefined);
  };

  const [serviceName, setServiceName] = useState<string>("");
  useEffect(() => {
    const newSelectedServiceName = serviceToRemove?.data?.name ?? "";

    setServiceName((currentServiceName) => newSelectedServiceName || currentServiceName);
  }, [serviceToRemove, setServiceName]);

  return (
    <ConfirmationModal
      title={`Delete ${serviceName}`}
      isOpen={isModalOpen}
      onYes={onRemove}
      onClose={onCancel}
    >
      <span>
        Are you sure that you want to delete {serviceName}. By deleting {serviceName}, all
        references will be removed.
      </span>
    </ConfirmationModal>
  );
};
