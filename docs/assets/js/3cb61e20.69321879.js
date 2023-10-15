"use strict";(self.webpackChunk_genzy_io_docs=self.webpackChunk_genzy_io_docs||[]).push([[844],{3905:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>f});var a=r(7294);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,a,n=function(e,t){if(null==e)return{};var r,a,n={},i=Object.keys(e);for(a=0;a<i.length;a++)r=i[a],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)r=i[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var c=a.createContext({}),s=function(e){var t=a.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},p=function(e){var t=s(e.components);return a.createElement(c.Provider,{value:t},e.children)},d="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,i=e.originalType,c=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),d=s(r),m=n,f=d["".concat(c,".").concat(m)]||d[m]||u[m]||i;return r?a.createElement(f,o(o({ref:t},p),{},{components:r})):a.createElement(f,o({ref:t},p))}));function f(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var i=r.length,o=new Array(i);o[0]=m;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l[d]="string"==typeof e?e:n,o[1]=l;for(var s=2;s<i;s++)o[s]=r[s];return a.createElement.apply(null,o)}return a.createElement.apply(null,r)}m.displayName="MDXCreateElement"},4789:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>c,contentTitle:()=>o,default:()=>u,frontMatter:()=>i,metadata:()=>l,toc:()=>s});var a=r(7462),n=(r(7294),r(3905));const i={title:"Guides",sidebar_label:"Guides",slug:"/guides/"},o=void 0,l={unversionedId:"framework/Guides/index",id:"framework/Guides/index",title:"Guides",description:"Here's a way to ceate a simple API and generate the client code for accessing it.",source:"@site/docs/framework/02-Guides/index.md",sourceDirName:"framework/02-Guides",slug:"/guides/",permalink:"/docs/0.0.1-alpha/guides/",draft:!1,tags:[],version:"current",frontMatter:{title:"Guides",sidebar_label:"Guides",slug:"/guides/"},sidebar:"sidebar",previous:{title:"How it works",permalink:"/docs/0.0.1-alpha/how-it-works/"},next:{title:"Creating the API",permalink:"/docs/0.0.1-alpha/quickstart/api"}},c={},s=[{value:"Quickstart",id:"quickstart",level:2},{value:"In Depth",id:"in-depth",level:2}],p={toc:s},d="wrapper";function u(e){let{components:t,...r}=e;return(0,n.kt)(d,(0,a.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("p",null,"Here's a way to ceate a simple API and generate the client code for accessing it."),(0,n.kt)("h2",{id:"quickstart"},"Quickstart"),(0,n.kt)("ol",null,(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("a",{parentName:"li",href:"/docs/0.0.1-alpha/quickstart/api#creating-the-api"},"Creating the API")),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("a",{parentName:"li",href:"/docs/0.0.1-alpha/quickstart/client#generating-the-client"},"Generating the client"))),(0,n.kt)("h2",{id:"in-depth"},"In Depth"),(0,n.kt)("ol",null,(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("a",{parentName:"li",href:"/docs/0.0.1-alpha/server-installation/"},"Server")),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("a",{parentName:"li",href:"/docs/0.0.1-alpha/client-installation/"},"Client")),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("a",{parentName:"li",href:"../03-Advanced-Guides/03-API-Plugins"},"API Plugins"),(0,n.kt)("ol",{parentName:"li"},(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("a",{parentName:"li",href:"/docs/0.0.1-alpha/framework/Advanced-Guides/API-Plugins/Request-Validation"},"Adding validation of API requests")),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("a",{parentName:"li",href:"/docs/0.0.1-alpha/framework/Advanced-Guides/API-Plugins/Redis-Connector"},"Registering a service for accessing Redis Cache")),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("a",{parentName:"li",href:"/docs/0.0.1-alpha/framework/Advanced-Guides/API-Plugins/Creating-a-custom-plugin"},"Creating a custom Plugin")))),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("a",{parentName:"li",href:"#api-interceptors"},"Interceptors"),(0,n.kt)("ol",{parentName:"li"},(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("a",{parentName:"li",href:"/docs/0.0.1-alpha/framework/Advanced-Guides/Interceptors/server"},"API Interceptors")),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("a",{parentName:"li",href:"/docs/0.0.1-alpha/framework/Advanced-Guides/Interceptors/client"},"Client Interceptors")),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("a",{parentName:"li",href:"/docs/0.0.1-alpha/framework/Advanced-Guides/Interceptors/error"},"Error Mapping"))))))}u.isMDXComponent=!0}}]);