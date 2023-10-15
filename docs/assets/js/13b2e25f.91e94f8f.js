"use strict";(self.webpackChunk_genzy_io_docs=self.webpackChunk_genzy_io_docs||[]).push([[179],{3905:(e,t,r)=>{r.d(t,{Zo:()=>s,kt:()=>y});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function p(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var o=n.createContext({}),c=function(e){var t=n.useContext(o),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},s=function(e){var t=c(e.components);return n.createElement(o.Provider,{value:t},e.children)},u="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},k=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,i=e.originalType,o=e.parentName,s=p(e,["components","mdxType","originalType","parentName"]),u=c(r),k=a,y=u["".concat(o,".").concat(k)]||u[k]||m[k]||i;return r?n.createElement(y,l(l({ref:t},s),{},{components:r})):n.createElement(y,l({ref:t},s))}));function y(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=r.length,l=new Array(i);l[0]=k;var p={};for(var o in t)hasOwnProperty.call(t,o)&&(p[o]=t[o]);p.originalType=e,p[u]="string"==typeof e?e:a,l[1]=p;for(var c=2;c<i;c++)l[c]=r[c];return n.createElement.apply(null,l)}return n.createElement.apply(null,r)}k.displayName="MDXCreateElement"},5887:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>o,contentTitle:()=>l,default:()=>m,frontMatter:()=>i,metadata:()=>p,toc:()=>c});var n=r(7462),a=(r(7294),r(3905));const i={title:"Server API",sidebar_label:"API",sidebar_position:1,slug:"/server-api/"},l=void 0,p={unversionedId:"server-api",id:"server-api",title:"Server API",description:"Reference",source:"@site/docs/server-api.md",sourceDirName:".",slug:"/server-api/",permalink:"/docs/0.0.1-alpha/server-api/",draft:!1,tags:[],version:"current",lastUpdatedAt:1697306351,formattedLastUpdatedAt:"Oct 14, 2023",sidebarPosition:1,frontMatter:{title:"Server API",sidebar_label:"API",sidebar_position:1,slug:"/server-api/"},sidebar:"serverSidebar"},o={},c=[{value:"Reference",id:"reference",level:2},{value:"new GenzyApi(options)",id:"new-genzyapioptions",level:3},{value:"genzyApi.from(containers)",id:"genzyapifromcontainers",level:3},{value:"genzyApi.intercept(interceptors)",id:"genzyapiinterceptinterceptors",level:3},{value:"genzyApi.interceptAfter(interceptors)",id:"genzyapiinterceptafterinterceptors",level:3},{value:"genzyApi.interceptAll(callback)",id:"genzyapiinterceptallcallback",level:3},{value:"genzyApi.interceptAllAfter(callback)",id:"genzyapiinterceptallaftercallback",level:3},{value:"genzyApi.withErrors(errorRegistry)",id:"genzyapiwitherrorserrorregistry",level:3},{value:"Types",id:"types",level:2},{value:"GenzyInfo",id:"genzyinfo",level:3},{value:"InterceptorCallback",id:"interceptorcallback",level:3},{value:"CustomInterceptors",id:"custominterceptors",level:3},{value:"ErrorRegistry",id:"errorregistry",level:3}],s={toc:c},u="wrapper";function m(e){let{components:t,...r}=e;return(0,a.kt)(u,(0,n.Z)({},s,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h2",{id:"reference"},"Reference"),(0,a.kt)("p",null,"The following is the ",(0,a.kt)("inlineCode",{parentName:"p"},"GenzyApi")," class with all method signatures."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"export class GenzyApi {\n  constructor();\n  constructor(options: {app?: Application, genzyInfo?: GenzyInfo, basePath?: string});\n\n  public intercept(customInterceptors: CustomInterceptors<InterceptorCallback>): GenzyApi;\n  public interceptAfter(customInterceptors: CustomInterceptors<InterceptorCallback>): GenzyApi;\n  public interceptAll(callback: InterceptorCallback): GenzyApi;\n  public interceptAllAfter(callback: InterceptorCallback): GenzyApi;\n  public withErrors(errors: ErrorRegistry): GenzyApi;\n  public from(containers: GenzyContainer[]): Application;\n}\n")),(0,a.kt)("h3",{id:"new-genzyapioptions"},"new GenzyApi(options)"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},"Creates a new instance of GenzyApi.")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},(0,a.kt)("inlineCode",{parentName:"p"},"options")," ",(0,a.kt)("a",{parentName:"p",href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object"},(0,a.kt)("inlineCode",{parentName:"a"},"<Object>")))),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"app?")," ",(0,a.kt)("a",{parentName:"li",href:"http://expressjs.com/en/4x/api.html#app"},(0,a.kt)("inlineCode",{parentName:"a"},"<Application>"))))),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"genzyInfo?")," ",(0,a.kt)("a",{parentName:"li",href:"#genzyinfo"},(0,a.kt)("inlineCode",{parentName:"a"},"<GenzyInfo>"))))),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"basePath?")," ",(0,a.kt)("a",{parentName:"li",href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String"},(0,a.kt)("inlineCode",{parentName:"a"},"<string>")))))),(0,a.kt)("h3",{id:"genzyapifromcontainers"},"genzyApi.from(containers)"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},"Creates a new ",(0,a.kt)("a",{parentName:"p",href:"http://expressjs.com/en/4x/api.html#app"},"Express Application")," from a set of GenzyContainers.")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},(0,a.kt)("inlineCode",{parentName:"p"},"nimbles")," ",(0,a.kt)("a",{parentName:"p",href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array"},(0,a.kt)("inlineCode",{parentName:"a"},"<Array>"))))),(0,a.kt)("h3",{id:"genzyapiinterceptinterceptors"},"genzyApi.intercept(interceptors)"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},"Registers a set of custom ",(0,a.kt)("a",{parentName:"p",href:"#interceptorcallback"},"API interceptors")," that execute ",(0,a.kt)("inlineCode",{parentName:"p"},"before")," each request.")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},(0,a.kt)("inlineCode",{parentName:"p"},"interceptors")," ",(0,a.kt)("a",{parentName:"p",href:"#custominterceptors"},(0,a.kt)("inlineCode",{parentName:"a"},"<CustomInterceptors>"))))),(0,a.kt)("h3",{id:"genzyapiinterceptafterinterceptors"},"genzyApi.interceptAfter(interceptors)"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},"Registers a set of custom ",(0,a.kt)("a",{parentName:"p",href:"#interceptorcallback"},"API interceptors")," that execute ",(0,a.kt)("inlineCode",{parentName:"p"},"after")," each request.")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},(0,a.kt)("inlineCode",{parentName:"p"},"interceptors")," ",(0,a.kt)("a",{parentName:"p",href:"#custominterceptors"},(0,a.kt)("inlineCode",{parentName:"a"},"<CustomInterceptors>"))))),(0,a.kt)("h3",{id:"genzyapiinterceptallcallback"},"genzyApi.interceptAll(callback)"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},"Registers a custom ",(0,a.kt)("a",{parentName:"p",href:"#interceptorcallback"},"API interceptor")," that executes ",(0,a.kt)("inlineCode",{parentName:"p"},"before")," ",(0,a.kt)("i",null,"all")," requests.")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},(0,a.kt)("inlineCode",{parentName:"p"},"callback")," ",(0,a.kt)("a",{parentName:"p",href:"#interceptorcallback"},(0,a.kt)("inlineCode",{parentName:"a"},"<InterceptorCallback>"))))),(0,a.kt)("h3",{id:"genzyapiinterceptallaftercallback"},"genzyApi.interceptAllAfter(callback)"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},"Registers a custom ",(0,a.kt)("a",{parentName:"p",href:"#interceptorcallback"},"API interceptor")," that executes ",(0,a.kt)("inlineCode",{parentName:"p"},"after")," ",(0,a.kt)("i",null,"all")," requests.")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},(0,a.kt)("inlineCode",{parentName:"p"},"callback")," ",(0,a.kt)("a",{parentName:"p",href:"#interceptorcallback"},(0,a.kt)("inlineCode",{parentName:"a"},"<InterceptorCallback>"))))),(0,a.kt)("h3",{id:"genzyapiwitherrorserrorregistry"},"genzyApi.withErrors(errorRegistry)"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},"Registers a set of custom error status codes that set the response status based on the error that is thrown.")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},(0,a.kt)("inlineCode",{parentName:"p"},"errorRegistry")," ",(0,a.kt)("a",{parentName:"p",href:"#errorregistry"},(0,a.kt)("inlineCode",{parentName:"a"},"<ErrorRegistry>"))))),(0,a.kt)("h2",{id:"types"},"Types"),(0,a.kt)("h3",{id:"genzyinfo"},"GenzyInfo"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"type GenzyInfo = {\n  version?: string;\n  name?: string;\n  description?: string;\n  basePath?: string;\n}\n")),(0,a.kt)("h3",{id:"interceptorcallback"},"InterceptorCallback"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"type InterceptorCallback = (req: Request, res: Response, next: NextFunction) => any;\n")),(0,a.kt)("h3",{id:"custominterceptors"},"CustomInterceptors"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"type CustomInterceptors<TInterceptorCallback> = {\n  [classKey: string]: {\n    [methodKey: string]: TInterceptorCallback\n  }\n};\n")),(0,a.kt)("h3",{id:"errorregistry"},"ErrorRegistry"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"type ErrorRegistry = { [key: string]: number };\n")))}m.isMDXComponent=!0}}]);