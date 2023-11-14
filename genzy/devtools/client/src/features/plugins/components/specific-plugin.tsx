import { type FC, useState, useMemo, useEffect } from "react";
import type { Dependency, NPMPackage, Version } from "../api/specific-plugin.contracts";
import { usePlugin } from "../hooks/usePlugin";
import { Select } from "../../../core/components/select";
import { Button } from "../../../core/components/button";
import { KeywordsList } from "./keywords";
import { NewTabLink } from "./new-tab-link";
import { Section } from "./section";
import moment from "moment";
import { useIsPluginInstalled } from "../hooks/useIsPluginInstalled";
import { useProjectDefinitionContext } from "../../project-workspace/contexts/project-definition.context";
import { projectDefinitionActions } from "../../project-workspace/contexts/project-definition.dispatcher";
import { useMicroserviceContext } from "../../diagrams/common/contexts/microservice.context";
import { useNotifications } from "../../../core/hooks/useNotifications";
import { Loader } from "./loader";
import { useOutletContext } from "react-router-dom";

type DependenciesProps = {
  depedencies: Dependency[];
};

const Dependencies: FC<DependenciesProps> = ({ depedencies }) => {
  return (
    <div className="flex flex-wrap gap-y-3">
      {depedencies.map(({ name, version }) => (
        <NewTabLink
          key={name}
          to={`https://www.npmjs.com/package/${name}/v/${version}`}
          className="mr-3"
        >
          {name} v{version}
        </NewTabLink>
      ))}
    </div>
  );
};

type PluginHeaderProps = NPMPackage;

const PluginHeader: FC<PluginHeaderProps> = ({ name, latestVersion, lastModified, repository }) => {
  return (
    <div className="space-y-1 ">
      <NewTabLink
        to={`https://www.npmjs.com/package/${name}/v/${latestVersion}`}
        className="font-medium text-xl"
      >
        {name}
      </NewTabLink>
      <div className="flex text-gray-600">
        {latestVersion} •<span className="text-green-600 mx-1">Public</span> •{" "}
        {moment(lastModified).fromNow()}
      </div>
      {!!repository && (
        <NewTabLink to={repository} className="text-gray-600 text-sm">
          {repository}
        </NewTabLink>
      )}
    </div>
  );
};

type VersionInfoProps = Version;

const VersionInfo: FC<VersionInfoProps> = ({
  description,
  keywords,
  dependencies,
  devDependencies,
}) => {
  return (
    <>
      <div className="my-2 border-b w-full border-gray-300 pb-2" />
      <Section name="Informations">
        <div className="space-y-1">
          <div className="text-sm">{description}</div>
          <KeywordsList keywords={keywords} />
        </div>
      </Section>

      <Section name={`Dependencies (${dependencies.length})`}>
        <Dependencies depedencies={dependencies} />
      </Section>

      <Section name={`Dev Dependencies (${devDependencies.length})`}>
        <Dependencies depedencies={devDependencies} />
      </Section>
    </>
  );
};

export const SpecificPlugin: FC<{ pluginName: string }> = ({ pluginName }) => {
  const notificator = useNotifications();
  const { microserviceId } = useMicroserviceContext();
  const { dispatcher } = useProjectDefinitionContext();
  const [close] = useOutletContext<[() => any]>();
  const { isInstalled, installedVersion } = useIsPluginInstalled(pluginName);

  const { plugin, isFetching } = usePlugin(pluginName);
  const [versionValue, setVersionValue] = useState("");

  const versionOptions = useMemo(
    () => plugin.versions?.map((version) => version.value) ?? [],
    [plugin]
  );

  const version = useMemo(
    () => plugin.versions?.find((version) => version.value === versionValue),
    [plugin, versionValue]
  );

  const installPlugin = async () => {
    await dispatcher(projectDefinitionActions.installPlugin, {
      microserviceId,
      plugin: {
        name: pluginName,
        version: versionValue,
      },
    });

    notificator.success(`You have installed plugin ${pluginName}.`);
    close();
  };

  const updatePlugin = async () => {
    await dispatcher(projectDefinitionActions.updatePlugin, {
      microserviceId,
      plugin: {
        name: pluginName,
        version: versionValue,
      },
    });

    notificator.success(`You have updated plugin ${pluginName}.`);
    close();
  };

  const uninstallPlugin = async () => {
    await dispatcher(projectDefinitionActions.uninstallPlugin, {
      microserviceId,
      plugin: {
        name: pluginName,
        version: versionValue,
      },
    });

    notificator.success(`You have uninstalled plugin ${pluginName}.`);
    close();
  };

  if (isFetching) {
    return (
      <div className="mt-[70px]">
        <Loader />
      </div>
    );
  } else {
    !versionValue && setVersionValue(installedVersion || plugin.latestVersion);
  }

  return (
    <>
      <div className="flex w-full items-center">
        <div className="w-[65%]">
          <PluginHeader {...plugin} />
        </div>

        <div className="flex space-x-1 w-[35%] items-center">
          <div className="flex-1 mr-1">
            <Select options={versionOptions} value={versionValue} onChange={setVersionValue} />
          </div>
          <div className="flex space-x-1">
            {!isInstalled && <Button onClick={installPlugin}>Install</Button>}
            {isInstalled && installedVersion !== versionValue && (
              <Button onClick={updatePlugin}>Update</Button>
            )}
            {isInstalled && <Button onClick={uninstallPlugin}>Uninstall</Button>}
          </div>
        </div>
      </div>

      {!!version && <VersionInfo {...version} />}
    </>
  );
};
