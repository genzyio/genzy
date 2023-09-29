import { exec } from "child_process";

type Package = {
  name: string;
  version: string;
};

function installPackage({ name, version }: Package, microservicePath: string): Promise<string> {
  return new Promise((res, rej) =>
    exec(`npm install ${name}@${version}`, { cwd: microservicePath }, (err, stdout, stderr) =>
      err ? rej(stderr) : res(stdout),
    ),
  );
}

function uninstallPackage({ name, version }: Package, microservicePath: string): Promise<string> {
  return new Promise((res, rej) =>
    exec(`npm uninstall ${name}@${version}`, { cwd: microservicePath }, (err, stdout, stderr) =>
      err ? rej(stderr) : res(stdout),
    ),
  );
}
export { installPackage, uninstallPackage };
