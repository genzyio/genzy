import { type FC, useState, SyntheticEvent } from "react";
import { TextField } from "../../../../components/text-field";
import { useAction } from "../../../../hooks/useAction";
import { type ImportProject } from "../../api/project.contracts";
import { importProject } from "../../api/project.actions";
import { useNotifications } from "../../../../hooks/useNotifications";
import { extractErrorMessage } from "../../../../utils/errors";

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
      <div className="border-b border-gray-900/10 pb-12">
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
        <button
          onClick={onCancel}
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Import
        </button>
      </div>
    </form>
  );
};
