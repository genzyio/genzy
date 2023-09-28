type Microservice = {
  name: string;
  description: string;
  basePath: string;
  version: string;
  services: Service[];
  plugins: Plugin[];
};

type Service = {
  id: string;
  name: string;
  type: "LOCAL" | "CONTROLLER";
};

type Communication = {
  services: string[];
};

type Plugin = {
  name: string;
  version: string;
};

export type { Microservice, Communication, Service, Plugin };
