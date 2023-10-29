type NPMPackage = {
  name: string;
  latestVersion: string;
  lastModified: string;
  homepage: string;
  repository: string;
  versions: Version[];
};

type Version = {
  value: string;
  date: string;
  description: string;
  keywords: string[];
  dependencies: Dependency[];
  devDependencies: Dependency[];
};

type Dependency = {
  name: string;
  version: string;
};

export type { NPMPackage, Version, Dependency };
