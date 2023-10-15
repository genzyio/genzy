"use strict";(self.webpackChunk_genzy_io_docs=self.webpackChunk_genzy_io_docs||[]).push([[106],{3905:(e,n,t)=>{t.d(n,{Zo:()=>u,kt:()=>m});var r=t(7294);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var d=r.createContext({}),s=function(e){var n=r.useContext(d),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},u=function(e){var n=s(e.components);return r.createElement(d.Provider,{value:n},e.children)},c="mdxType",p={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},f=r.forwardRef((function(e,n){var t=e.components,a=e.mdxType,o=e.originalType,d=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),c=s(t),f=a,m=c["".concat(d,".").concat(f)]||c[f]||p[f]||o;return t?r.createElement(m,i(i({ref:n},u),{},{components:t})):r.createElement(m,i({ref:n},u))}));function m(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var o=t.length,i=new Array(o);i[0]=f;var l={};for(var d in n)hasOwnProperty.call(n,d)&&(l[d]=n[d]);l.originalType=e,l[c]="string"==typeof e?e:a,i[1]=l;for(var s=2;s<o;s++)i[s]=t[s];return r.createElement.apply(null,i)}return r.createElement.apply(null,t)}f.displayName="MDXCreateElement"},1420:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>d,contentTitle:()=>i,default:()=>p,frontMatter:()=>o,metadata:()=>l,toc:()=>s});var r=t(7462),a=(t(7294),t(3905));const o={},i=void 0,l={unversionedId:"framework/Advanced-Guides/API-Plugins/Request-Validation",id:"framework/Advanced-Guides/API-Plugins/Request-Validation",title:"Request-Validation",description:"Adding validation of API requests",source:"@site/docs/framework/03-Advanced-Guides/03-API-Plugins/01-Request-Validation.md",sourceDirName:"framework/03-Advanced-Guides/03-API-Plugins",slug:"/framework/Advanced-Guides/API-Plugins/Request-Validation",permalink:"/docs/0.0.1-alpha/framework/Advanced-Guides/API-Plugins/Request-Validation",draft:!1,tags:[],version:"current",sidebarPosition:1,frontMatter:{},sidebar:"sidebar",previous:{title:"API Plugins",permalink:"/docs/0.0.1-alpha/framework/Advanced-Guides/API-Plugins/"},next:{title:"Redis-Connector",permalink:"/docs/0.0.1-alpha/framework/Advanced-Guides/API-Plugins/Redis-Connector"}},d={},s=[{value:"Adding validation of API requests",id:"adding-validation-of-api-requests",level:3}],u={toc:s},c="wrapper";function p(e){let{components:n,...t}=e;return(0,a.kt)(c,(0,r.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("h3",{id:"adding-validation-of-api-requests"},"Adding validation of API requests"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Zod validation that registers interceptors")),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("inlineCode",{parentName:"li"},"npm i -S genzy-zod-validation"))),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},'import { Plugin as GenzyZodValidationPlugin } from "genzy-zod-validation";\n\n// ...\n\nconst app = new GenzyApi()\n  .addPlugin(new GenzyZodValidationPlugin())\n  .buildAppFrom(controllers);\n\n// now types of request parameters (path, query and body) get validated\n')))}p.isMDXComponent=!0}}]);