import { ServiceMetaInfo } from "../../shared/types";
import * as tmpl from 'blueimp-tmpl';

const serviceTemplate = `
export class {%=o.name%} {
{% for (var i=0; i < o.routes.length; i++) { %}
  async {%=o.routes[i].methodName%}() {}
{% } %}
}`;

const indexTemplate = `
import { Nimble } from 'nimbly-client';
{% for (var i=0; i < o.services.length; i++) { %}import { {%=o.services[i].name%} as {%=o.services[i].name%}Local } from './{%=o.services[i].name%}';
{% } %}
const host = "{%=o.host%}";

export const {
{% for (var i=0; i < o.services.length; i++) { %}
  {%=o.services[i].name%},
{% } %}
} : {
{% for (var i=0; i < o.services.length; i++) { %}
  {%=o.services[i].name%}: {%=o.services[i].name%}Local;
{% } %}
} = new Nimble()
{% for (var i=0; i < o.services.length; i++) { %}.ofRemote({%=o.services[i].name%}Local, host)
{% } %}
`;


export function fileContentFrom(service: ServiceMetaInfo): string {
  return tmpl(serviceTemplate, service);
}

export function indexFileContentFrom(services: ServiceMetaInfo[], host: string): string {
  return tmpl(indexTemplate, {services, host});
}