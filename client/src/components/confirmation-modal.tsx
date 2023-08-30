import { type FC } from "react";
import { Button } from "./button";
import { Modal, type ModalProps } from "./modal";

type ConfirmationModalProps = ModalProps & {
  onYes: () => void;
};

export const ConfirmationModal: FC<ConfirmationModalProps> = ({
  title,
  isOpen,
  onYes,
  onClose,
  children,
}) => {
  return (
    <>
      <Modal title={title} isOpen={isOpen} onClose={onClose}>
        {children}
        <div className="flex justify-end mt-2">
          <div className="mr-2">
            <Button type="button" onClick={onYes}>
              Yes
            </Button>
          </div>
          <div>
            <Button type="button" onClick={onClose}>
              No
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
