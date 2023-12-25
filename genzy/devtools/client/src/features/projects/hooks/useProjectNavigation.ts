import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAction } from "../../../core/hooks/useAction";
import { modifyRecentlyOpened } from "../api/recently-opened.actions";

type ProjectNavigation = {
  openProject: (projectName: string) => void;
  closeProject: () => void;
};

const useProjectNavigation = (): ProjectNavigation => {
  const navigate = useNavigate();
  const modifyRecentlyOpenedAction = useAction<string>(modifyRecentlyOpened, {
    onSuccess: () => {},
    onError: () => {},
  });

  const openProject = useCallback(
    (projectName: string) => {
      navigate(`/projects/${projectName}`);
      modifyRecentlyOpenedAction(projectName);
    },
    [navigate, modifyRecentlyOpenedAction]
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
