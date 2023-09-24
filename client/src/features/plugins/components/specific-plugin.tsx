import { type FC, useState, useMemo } from "react";
import type { Dependency, NPMPackage, Version } from "../api/specific-plugin.contracts";
import { useSpecificPlugin } from "../hooks/useSpecificPlugin";
import { Select } from "../../../components/select";
import { Button } from "../../../components/button";
import { KeywordsList } from "./keywords";
import { NewTabLink } from "./new-tab-link";
import { Section } from "./section";
import moment from "moment";

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
  const { plugin, isFetching } = useSpecificPlugin(pluginName);
  const [versionValue, setVersionValue] = useState("");

  const versionOptions = useMemo(
    () => plugin.versions?.map((version) => version.value) ?? [],
    [plugin]
  );

  const version = useMemo(
    () => plugin.versions?.find((version) => version.value === versionValue),
    [plugin, versionValue]
  );

  if (isFetching) {
    return <></>;
  } else {
    !versionValue && setVersionValue(plugin.latestVersion);
  }

  return (
    <>
      <div className="flex w-full items-center">
        <div className="w-[70%]">
          <PluginHeader {...plugin} />
        </div>

        <div className="flex space-x-1 w-[30%] items-center">
          <div className="flex-1">
            <Select options={versionOptions} value={versionValue} onChange={setVersionValue} />
          </div>
          <div>
            <Button>Install</Button>
          </div>
        </div>
      </div>

      {!!version && <VersionInfo {...version} />}
    </>
  );
};
