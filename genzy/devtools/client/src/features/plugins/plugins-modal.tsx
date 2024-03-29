import { useCallback, useEffect } from "react";
import { Outlet, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useProjectContext } from "@features/project-workspace/contexts/project.context";
import { useProjectDefinitionContext } from "@features/project-workspace/contexts/project-definition.context";
import { MicroserviceContextProvider } from "@features/diagrams/common/contexts/microservice.context";
import { Modal } from "@core/components/modal";

export function PluginsModal() {
  const { project } = useProjectContext();
  const { nodes } = useProjectDefinitionContext().projectDefinition?.microservices ?? {};

  const { microserviceId, pluginName } = useParams();
  const navigate = useNavigate();
  const [onModalClose] = useOutletContext<[() => any]>();

  const onClose = useCallback(() => {
    onModalClose();
    navigate(`/projects/${project.name}`);
  }, [onModalClose, navigate]);

  if (!microserviceId) {
    return <></>;
  }

  useEffect(() => {
    if (!microserviceId) return;

    const microserviceNode = nodes.find((node) => node.id === microserviceId);
    if (microserviceNode) return;

    navigate(`/projects/${project.name}`);
  }, [microserviceId]);

  return (
    <>
      <MicroserviceContextProvider microserviceId={microserviceId}>
        <Modal
          title="Plugins"
          className="h-[600px] overflow-y-auto"
          isOpen={true}
          isLarge={true}
          onClose={onClose}
        >
          {pluginName ? <Outlet context={[onClose]} /> : <Outlet />}
        </Modal>
      </MicroserviceContextProvider>
    </>
  );
}
