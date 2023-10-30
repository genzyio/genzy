import { type FC, useState, SyntheticEvent } from "react";
import { TextField } from "../../../../components/text-field";
import { useAction } from "../../../../hooks/useAction";
import { type ImportProject } from "../../api/project.contracts";
import { importProject } from "../../api/project.actions";
import { useNotifications } from "../../../../hooks/useNotifications";
import { extractErrorMessage } from "../../../../utils/errors";
import { Button } from "../../../../components/button";

type ImportProjectFormProps = {
  onSaved: (projectName: string) => any;
  onCancel: () => any;
};

export const ImportProjectForm: FC<ImportProjectFormProps> = ({ onSaved, onCancel }) => {
  const notificator = useNotifications();

  const [path, setPath] = useState("");

  const importProjectAction = useAction<ImportProject>(importProject, {
    onSuccess: (project) => {
      notificator.success("You have imported project.");
      onSaved(project.name);
    },
    onError: (error) => {
      notificator.error(extractErrorMessage(error));
    },
  });

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    importProjectAction({
      path,
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="border-b border-gray-300 pb-12">
        <div className="mt-10 grid gap-y-4">
          <TextField
            label="Path"
            value={path}
            onChange={setPath}
            helpText="Must be a valid path on your local machine."
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button onClick={onCancel} type="button" className="text-sm leading-6 ">
          Cancel
        </button>
        <Button type="submit">Import</Button>
      </div>
    </form>
  );
};
