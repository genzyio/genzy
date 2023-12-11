import fs from "fs";

function loadObject<T>(path: string): T {
  const objectContent = fs.readFileSync(path).toString();

  return JSON.parse(objectContent) as T;
}

function saveObject<T>(obj: T, path: string) {
  const objectContent = JSON.stringify(obj, null, 2);

  fs.writeFileSync(path, objectContent);
}

function ensureFolderExists(path: string) {
  if (fs.existsSync(path)) {
    return;
  }

  fs.mkdirSync(path);
}

function ensureFileExists(path: string, initialContent: string | object) {
  if (fs.existsSync(path)) {
    return;
  }

  if (typeof initialContent === "string") {
    fs.writeFileSync(path, initialContent);
  } else {
    saveObject(initialContent, path);
  }
}

function removeFolder(path: string) {
  fs.rmSync(path, { recursive: true, force: true });
}

export { loadObject, saveObject, ensureFolderExists, ensureFileExists, removeFolder };
