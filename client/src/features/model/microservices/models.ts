type Microservice = {
  name: string;
  services: Service[];
};

type Service = {
  id: string;
  name: string;
};

type Communication = {
  services: string[];
};

export type { Microservice, Communication, Service };
