import { exec } from "child_process";

type Plugin = {
  name: string;
  version: string;
};

function installPlugin({ name, version }: Plugin, microservicePath: string): Promise<string> {
  return new Promise((res, rej) =>
    exec(`npm install ${name}@${version}`, { cwd: microservicePath }, (err, stdout, stderr) =>
      err ? rej(stderr) : res(stdout),
    ),
  );
}

function uninstallPlugin({ name, version }: Plugin, microservicePath: string): Promise<string> {
  return new Promise((res, rej) =>
    exec(`npm uninstall ${name}@${version}`, { cwd: microservicePath }, (err, stdout, stderr) =>
      err ? rej(stderr) : res(stdout),
    ),
  );
}

export type { Plugin };

export { installPlugin, uninstallPlugin };
