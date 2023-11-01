import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

type ProjectNavigation = {
  openProject: (projectName: string) => void;
  closeProject: () => void;
};

const useProjectNavigation = (): ProjectNavigation => {
  const navigate = useNavigate();

  const openProject = useCallback(
    (projectName: string) => {
      navigate(`/projects/${projectName}`);
    },
    [navigate]
  );

  const closeProject = useCallback(() => {
    navigate("/projects");
  }, [navigate]);

  return {
    openProject,
    closeProject,
  };
};

export { useProjectNavigation };
