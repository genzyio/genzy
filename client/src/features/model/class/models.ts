export type DataType = string;

export type Attribute = {
  name: string;
  type: DataType;
  isCollection: boolean;
  id: string;
};

export type Class = {
  name: string;
  attributes: Attribute[];
};
