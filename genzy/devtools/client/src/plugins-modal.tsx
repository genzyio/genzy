import { useEffect } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useProjectContext } from "./features/projects/contexts/project.context";
import { useProjectDefinitionContext } from "./features/projects/contexts/project-definition.context";
import { MicroserviceContextProvider } from "./features/model/microservices/MicroserviceContext";
import { PluginModal } from "./features/plugins/components/plugins-modal";

export function PluginsModal() {
  const { project } = useProjectContext();
  const { nodes } = useProjectDefinitionContext().projectDefinition?.microservices ?? {};

  const { microserviceId } = useParams();
  const navigate = useNavigate();
  const [onModalClose] = useOutletContext<[() => any]>();

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
      <MicroserviceContextProvider>
        <PluginModal
          key={microserviceId}
          microserviceId={microserviceId}
          isOpen={true}
          isLarge={true}
          onClose={() => {
            onModalClose();
            navigate(`/projects/${project.name}`);
          }}
        />
      </MicroserviceContextProvider>
    </>
  );
}
