export type DataType = string;

export type Attribute = {
  id: string;
  name: string;
  type: DataType;
  isCollection: boolean;
  isOptional: boolean;
};

export type Parameter = {
  name: string;
  type: DataType;
  isCollection: boolean;
  isOptional: boolean;
};

export type Method = {
  id: string;
  name: string;
  parameters: Parameter[];
  returnValue: DataType;
  returnsCollection: boolean;
  isOptional: boolean;
};

export type Class = {
  microserviceId: string;
  name: string;
  attributes: Attribute[];
  methods: Method[];
};
