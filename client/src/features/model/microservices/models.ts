type Microservice = {
  name: string;
  version: string;
  language: Language | "";
  description: string;
  basePath: string;
  services: Service[];
  plugins: Plugin[];
};

type Language = "js" | "ts";

type Service = {
  id: string;
  name: string;
  type: "LOCAL" | "CONTROLLER" | "API_INTEGRATION";
};

type Plugin = {
  name: string;
  version: string;
};

type Communication = {
  services: string[];
};

export type { Microservice, Language, Service, Plugin, Communication };
