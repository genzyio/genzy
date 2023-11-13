import { type FC, useState, SyntheticEvent } from "react";
import { TextField } from "../../../../core/components/text-field";
import { useAction } from "../../../../core/hooks/useAction";
import { type CreateProject } from "../../api/project.contracts";
import { createProject } from "../../api/project.actions";
import { useNotifications } from "../../../../core/hooks/useNotifications";
import { extractErrorMessage } from "../../../../core/utils/errors";
import { Button } from "../../../../core/components/button";

type CreateProjectFormProps = {
  onSaved: (projectName: string) => any;
  onCancel: () => any;
};

export const CreateProjectForm: FC<CreateProjectFormProps> = ({ onSaved, onCancel }) => {
  const notificator = useNotifications();

  const [name, setName] = useState("");
  const [path, setPath] = useState("");

  const createProjectAction = useAction<CreateProject>(createProject, {
    onSuccess: () => {
      notificator.success("You have created a new project.");
      onSaved(name);
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
      <div className="border-b border-gray-300 pb-12">
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
        <button onClick={onCancel} type="button" className="text-sm leading-6 hover:text-gray-400">
          Cancel
        </button>
        <Button type="submit">Create</Button>
      </div>
    </form>
  );
};
