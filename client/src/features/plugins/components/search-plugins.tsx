import { type FC, useState } from "react";
import { type NPMPackageInfo } from "../api/search.contracts";
import { TextField } from "../../../components/text-field";
import { useDebounce } from "@uidotdev/usehooks";
import { useSearch } from "../hooks/useSearch";
import { KeywordsList } from "./keywords";
import { SpecificPlugin } from "./specific-plugin";
import moment from "moment";

let openSpecificPlugin = undefined;

const Plugin: FC<NPMPackageInfo> = ({ name, description, keywords, publisher, version, date }) => {
  return (
    <div className="space-y-1">
      <div
        className="font-medium text-xl cursor-pointer hover:underline"
        onClick={() => openSpecificPlugin(name)}
      >
        {name}
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

export const SearchPlugins: FC = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 200);

  const { plugins } = useSearch(debouncedSearch);

  const [specificPlugin, setSpecificPlugin] = useState("");
  openSpecificPlugin = setSpecificPlugin;

  if (!!specificPlugin) {
    return <SpecificPlugin pluginName={specificPlugin}></SpecificPlugin>;
  }

  return (
    <>
      <div className="mt-5">
        <div className="mb-2">
          <TextField title="Search packages" value={search} onChange={setSearch} />
        </div>
        {plugins?.map((plugin: NPMPackageInfo, index: number) => (
          <div key={index} className="mb-2 border-b w-full border-gray-300 pb-2">
            <Plugin {...plugin} />
          </div>
        ))}
      </div>
    </>
  );
};
