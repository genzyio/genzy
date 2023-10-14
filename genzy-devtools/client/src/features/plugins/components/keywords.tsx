import { type FC, useMemo } from "react";

type KeywordsListProps = {
  keywords: string[];
  maxCount?: number;
};

const KeywordsList: FC<KeywordsListProps> = ({ keywords, maxCount = 7 }) => {
  const uniqueKeywords = useMemo(
    () => Array.from(new Set(keywords?.slice(0, maxCount) ?? [])),
    [keywords, maxCount]
  );

  return (
    <div className="flex space-x-1">
      {uniqueKeywords.map((keyword) => {
        return <KeywordChip key={keyword} keyword={keyword} />;
      })}
    </div>
  );
};

type KeywordChipProps = {
  keyword: string;
};

const KeywordChip: FC<KeywordChipProps> = ({ keyword }) => {
  return (
    <div
      className={`border bg-gray-100 border-gray-300 rounded-md px-0.5 py-0.5 text-center text-xs flex items-center`}
    >
      {keyword}
    </div>
  );
};

export { KeywordsList };
