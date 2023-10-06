type NPMPackageInfo = {
  name: string;
  version: string;
  description: string;
  keywords: string[];
  date: string;
  publisher: Publisher;
};

type Publisher = {
  username: string;
  email: string;
};

export type { NPMPackageInfo, Publisher };
