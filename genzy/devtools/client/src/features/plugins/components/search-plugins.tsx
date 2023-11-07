import { type FC, useState, useEffect } from "react";
import { type NPMPackageInfo } from "../api/search.contracts";
import { TextField } from "../../../components/text-field";
import { useDebounce } from "@uidotdev/usehooks";
import { useSearch } from "../hooks/useSearch";
import { KeywordsList } from "./keywords";
import moment from "moment";
import { LoadingRow } from "./loading-row";
import { useIsPluginInstalled } from "../hooks/useIsPluginInstalled";
import { usePluginsNavigation } from "../hooks/usePluginsNavigation";

const Plugin: FC<NPMPackageInfo> = ({ name, description, keywords, publisher, version, date }) => {
  const { openSpecificPlugin } = usePluginsNavigation();
  const { isInstalled } = useIsPluginInstalled(name);

  return (
    <div className="space-y-1">
      <div
        className="font-medium text-xl cursor-pointer hover:underline"
        onClick={() => openSpecificPlugin(name)}
      >
        {name} <span className="text-base">{isInstalled ? " (Installed)" : ""}</span>
      </div>

      {!!description && <div className="text-sm text-gray-600">{description}</div>}
      {!!keywords?.length && <KeywordsList keywords={keywords} />}

      <div className="flex text-gray-600">
        <span className="font-medium mr-1">{publisher.username || publisher.email}</span>
        published {version} • {moment(date).fromNow()}
      </div>
    </div>
  );
};

const LoadingPlugin: FC = () => {
  const [nameWidth] = useState(Math.floor(Math.random() * 31 + 10));
  const [descriptionWidth] = useState(Math.floor(Math.random() * 71 + 30));
  const [versionWidth] = useState(Math.floor(Math.random() * 51 + 20));

  return (
    <div className="space-y-2">
      <LoadingRow color={"gray-500"} height={20} width={nameWidth} />
      <LoadingRow color={"gray-500"} width={descriptionWidth} />
      <LoadingRow color={"gray-400"} width={versionWidth} />
    </div>
  );
};

export const SearchPlugins: FC = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 200);

  const { plugins, isFetching } = useSearch(debouncedSearch);
  const [loadingElements, setLoadingElemements] = useState<any[]>([]);
  useEffect(() => {
    setLoadingElemements(Array.from({ length: Math.floor(Math.random() * 5) + 2 }));
  }, [debouncedSearch]);

  return (
    <>
      <div className="mt-5">
        <div className="mb-2">
          <TextField autoFocus={true} title="Search packages" value={search} onChange={setSearch} />
        </div>

        {isFetching && !!debouncedSearch ? (
          <>
            {loadingElements?.map((_: any, index: number) => (
              <div key={index} className="mb-2 border-b w-full border-gray-300 pb-2">
                <LoadingPlugin />
              </div>
            ))}
          </>
        ) : (
          <>
            {plugins?.map((plugin: NPMPackageInfo, index: number) => (
              <div key={index} className="mb-2 border-b w-full border-gray-300 pb-2">
                <Plugin {...plugin} />
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
};
