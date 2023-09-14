import type { MetaInfo, ServiceMetaInfo } from "../../shared/types";

export type ExtendedMetaInfo = Omit<MetaInfo, "services"> & {
  services: ExtendedServiceInfo[];
};

export type ExtendedServiceInfo = {
  type: "LocalService" | "RemoteProxy" | "Controller";
  extends?: string;
  dependencies: string[];
} & ServiceMetaInfo;
