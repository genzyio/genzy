import { type FC, useState, SyntheticEvent } from "react";
import { TextField } from "../../../../components/text-field";
import { useAction } from "../../../../hooks/useAction";
import { type CreateProject } from "../../api/project.contracts";
import { createProject } from "../../api/project.actions";
import { useNotifications } from "../../../../hooks/useNotifications";
import { extractErrorMessage } from "../../../../utils/errors";

type CreateProjectFormProps = {
  onSaved: () => any;
  onClosed: () => any;
};

export const CreateProjectForm: FC<CreateProjectFormProps> = ({ onSaved, onClosed }) => {
  const notificator = useNotifications();

  const [name, setName] = useState("");
  const [path, setPath] = useState("");

  const createProjectAction = useAction<CreateProject>(createProject, {
    onSuccess: () => {
      notificator.success("You have created a new project.");
      onSaved();
    },
    onError: (error) => {
      notificator.error(extractErrorMessage(error));
    },
  });

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    createProjectAction({
      name,
      path,
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="border-b border-gray-900/10 pb-12">
        <div className="mt-10 grid gap-y-4">
          <TextField label="Name" value={name} onChange={setName} />
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
          onClick={onClosed}
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </form>
  );
};
