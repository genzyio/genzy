export function Service(rootPath: string) {
  return function (target: any): void {
    if(!target.prototype.$nimbly) target.prototype.$nimbly = {};
    target.prototype.$nimbly.rootPath = rootPath;
  }
}

export function Get(path: string = '') {
  return pathDecorator(path, 'get');
}

export function Post(path: string = '') {
  return pathDecorator(path, 'post', true);
}

export function Put(path: string = '') {
  return pathDecorator(path, 'put', true);
}

export function Delete(path: string = '') {
  return pathDecorator(path, 'delete');
}

export function Patch(path: string = '') {
  return pathDecorator(path, 'patch', true);
}

const pathDecorator = (path: string, method: string, body: boolean = false) => function (target: any, propertyKey: string): void {
  if(!target.$nimbly) target.$nimbly = {};
  target.$nimbly[propertyKey] = { path, method, body };
}