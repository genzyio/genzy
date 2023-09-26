type Microservice = {
  name: string;
  description: string;
  basePath: string;
  version: string;
  services: Service[];
};

type Service = {
  id: string;
  name: string;
  type: "LOCAL" | "CONTROLLER";
};

type Communication = {
  services: string[];
};

export type { Microservice, Communication, Service };
