import { MetaInfo, ServiceMetaInfo } from "./types.d";

export declare type ExtendedMetaInfo = Omit<MetaInfo, "services"> & {
  services: ExtendedServiceInfo[];
};
export declare type ExtendedServiceInfo = {
  type: "LocalService" | "RemoteProxy" | "Controller";
  extends?: string;
  dependencies: string[];
} & ServiceMetaInfo;

export declare function generateJSClient(
  meta: ExtendedMetaInfo,
  dirPath: string,
  host: string
): Promise<void>;
export declare function generateTSClient(
  meta: ExtendedMetaInfo,
  dirPath: string,
  host: string
): Promise<void>;
export declare function generateCSharpClient(
  meta: ExtendedMetaInfo,
  dirPath: string,
  host: string
): Promise<void>;
export declare function generateJSServer(
  meta: ExtendedMetaInfo,
  dirPath: string
): Promise<void>;
export declare function generateTSServer(
  meta: ExtendedMetaInfo,
  dirPath: string
): Promise<void>;
