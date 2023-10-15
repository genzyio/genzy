"use strict";(self.webpackChunk_genzy_io_docs=self.webpackChunk_genzy_io_docs||[]).push([[182],{3905:(e,r,t)=>{t.d(r,{Zo:()=>l,kt:()=>m});var n=t(7294);function o(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function i(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function a(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?i(Object(t),!0).forEach((function(r){o(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function s(e,r){if(null==e)return{};var t,n,o=function(e,r){if(null==e)return{};var t,n,o={},i=Object.keys(e);for(n=0;n<i.length;n++)t=i[n],r.indexOf(t)>=0||(o[t]=e[t]);return o}(e,r);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)t=i[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var c=n.createContext({}),p=function(e){var r=n.useContext(c),t=r;return e&&(t="function"==typeof e?e(r):a(a({},r),e)),t},l=function(e){var r=p(e.components);return n.createElement(c.Provider,{value:r},e.children)},u="mdxType",f={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},d=n.forwardRef((function(e,r){var t=e.components,o=e.mdxType,i=e.originalType,c=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),u=p(t),d=o,m=u["".concat(c,".").concat(d)]||u[d]||f[d]||i;return t?n.createElement(m,a(a({ref:r},l),{},{components:t})):n.createElement(m,a({ref:r},l))}));function m(e,r){var t=arguments,o=r&&r.mdxType;if("string"==typeof e||o){var i=t.length,a=new Array(i);a[0]=d;var s={};for(var c in r)hasOwnProperty.call(r,c)&&(s[c]=r[c]);s.originalType=e,s[u]="string"==typeof e?e:o,a[1]=s;for(var p=2;p<i;p++)a[p]=t[p];return n.createElement.apply(null,a)}return n.createElement.apply(null,t)}d.displayName="MDXCreateElement"},1001:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>c,contentTitle:()=>a,default:()=>f,frontMatter:()=>i,metadata:()=>s,toc:()=>p});var n=t(7462),o=(t(7294),t(3905));const i={title:"How it works",sidebar_position:2,slug:"/how-it-works/"},a=void 0,s={unversionedId:"framework/Introduction/how-it-works",id:"framework/Introduction/how-it-works",title:"How it works",description:"Under the hood, Genzy is using JavaScript's Proxy API to intercept all method calls and gather the required information for registring the routes.",source:"@site/docs/framework/01-Introduction/how-it-works.md",sourceDirName:"framework/01-Introduction",slug:"/how-it-works/",permalink:"/docs/0.0.1-alpha/how-it-works/",draft:!1,tags:[],version:"current",sidebarPosition:2,frontMatter:{title:"How it works",sidebar_position:2,slug:"/how-it-works/"},sidebar:"sidebar",previous:{title:"Introduction",permalink:"/docs/0.0.1-alpha/"},next:{title:"Guides",permalink:"/docs/0.0.1-alpha/guides/"}},c={},p=[],l={toc:p},u="wrapper";function f(e){let{components:r,...t}=e;return(0,o.kt)(u,(0,n.Z)({},l,t,{components:r,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Under the hood, Genzy is using JavaScript's ",(0,o.kt)("a",{parentName:"p",href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy"},"Proxy API")," to intercept all method calls and gather the required information for registring the routes."),(0,o.kt)("p",null,"Genzy keeps all services in it's own internal service registry, and implements ",(0,o.kt)("a",{parentName:"p",href:"https://en.wikipedia.org/wiki/Dependency_inversion_principle"},"Dependency Inversion")," principle. The registry contains all services from a GenzyContainer, and is injected as a first parameter of every service constructor."),(0,o.kt)("p",null,"Client is using Axios for sending HTTP requests."),(0,o.kt)("p",null,"Server is using ",(0,o.kt)("a",{parentName:"p",href:"https://expressjs.com/"},"Express")," for creating a web API. It implements the custom logic for creating ",(0,o.kt)("a",{parentName:"p",href:"https://www.openapis.org/"},"OpenAPI")," documentation based on the information gathered from the GenzyContainer services. ",(0,o.kt)("a",{parentName:"p",href:"https://swagger.io/"},"SwaggerUI")," is created using the ",(0,o.kt)("a",{parentName:"p",href:"https://www.npmjs.com/package/swagger-ui-express"},"swagger-ui-express")," library."))}f.isMDXComponent=!0}}]);