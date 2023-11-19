import { type FC, useEffect, useState } from "react";
import { type Node } from "reactflow";
import { type Class } from "./models";
import { ConfirmationModal } from "../../../core/components/confirmation-modal";

export type RemoveClassModalInstance = {
  openFor: (node: Node<Class>) => any;
};

type RemoveClassModalProps = {
  onInit: (instance: RemoveClassModalInstance) => any;
  handleRemove: (node: Node<Class>) => any;
};

export const RemoveClassModal: FC<RemoveClassModalProps> = ({ onInit, handleRemove }) => {
  const [instance] = useState({} as RemoveClassModalInstance);
  const [classToRemove, setClassToRemove] = useState<Node<Class>>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    onInit && onInit(instance);
  }, []);

  useEffect(() => {
    instance.openFor = (node: Node<Class>) => {
      setClassToRemove(node);
      setIsModalOpen(true);
    };
  }, [setClassToRemove, setIsModalOpen]);

  const onRemove = async () => {
    await handleRemove(classToRemove);

    setIsModalOpen(false);
    setClassToRemove(undefined);
  };

  const onCancel = () => {
    setIsModalOpen(false);
    setClassToRemove(undefined);
  };

  const [className, setClassName] = useState<string>("");
  useEffect(() => {
    const newSelectedClassName = classToRemove?.data?.name ?? "";

    setClassName((currentClassName) => newSelectedClassName || currentClassName);
  }, [classToRemove, setClassName]);

  return (
    <ConfirmationModal
      title={`Delete ${className}`}
      isOpen={isModalOpen}
      onYes={onRemove}
      onClose={onCancel}
    >
      <span>
        Are you sure that you want to delete {className}? By removing {className}, all refferences
        to it will be updated to type any.
      </span>
    </ConfirmationModal>
  );
};
