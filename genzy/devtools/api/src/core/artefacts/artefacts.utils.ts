import { config } from "../../config";
import { ensureFolderExists } from "../utils/fs";

function ensureArtefactsFolderExist() {
  ensureFolderExists(config.userArtefactsPath);
}

export { ensureArtefactsFolderExist };
