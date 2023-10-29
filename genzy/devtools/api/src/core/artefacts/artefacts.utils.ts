import fs from "fs";
import { config } from "../../config";

function doesArtefactsFolderExist(): boolean {
  return fs.existsSync(config.userArtefactsPath);
}

function createArtefactsFolder() {
  fs.mkdirSync(config.userArtefactsPath);
}

function ensureArtefactsFolderExist() {
  if (doesArtefactsFolderExist()) {
    return;
  }

  createArtefactsFolder();
}

export { doesArtefactsFolderExist, createArtefactsFolder, ensureArtefactsFolderExist };
