"use strict";(self.webpackChunk_genzy_io_docs=self.webpackChunk_genzy_io_docs||[]).push([[650],{3905:(e,n,t)=>{t.d(n,{Zo:()=>p,kt:()=>y});var a=t(7294);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function s(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function o(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?s(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):s(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function i(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},s=Object.keys(e);for(a=0;a<s.length;a++)t=s[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(a=0;a<s.length;a++)t=s[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var c=a.createContext({}),l=function(e){var n=a.useContext(c),t=n;return e&&(t="function"==typeof e?e(n):o(o({},n),e)),t},p=function(e){var n=l(e.components);return a.createElement(c.Provider,{value:n},e.children)},u="mdxType",m={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},d=a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,s=e.originalType,c=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),u=l(t),d=r,y=u["".concat(c,".").concat(d)]||u[d]||m[d]||s;return t?a.createElement(y,o(o({ref:n},p),{},{components:t})):a.createElement(y,o({ref:n},p))}));function y(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var s=t.length,o=new Array(s);o[0]=d;var i={};for(var c in n)hasOwnProperty.call(n,c)&&(i[c]=n[c]);i.originalType=e,i[u]="string"==typeof e?e:r,o[1]=i;for(var l=2;l<s;l++)o[l]=t[l];return a.createElement.apply(null,o)}return a.createElement.apply(null,t)}d.displayName="MDXCreateElement"},8215:(e,n,t)=>{t.d(n,{Z:()=>r});var a=t(7294);const r=function(e){let{children:n,hidden:t,className:r}=e;return a.createElement("div",{role:"tabpanel",hidden:t,className:r},n)}},9877:(e,n,t)=>{t.d(n,{Z:()=>p});var a=t(7462),r=t(7294),s=t(2389),o=t(5773),i=t(6010);const c={tabItem:"tabItem_LplD"};function l(e){const{lazy:n,block:t,defaultValue:s,values:l,groupId:p,className:u}=e,m=r.Children.map(e.children,(e=>{if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)})),d=l??m.map((e=>{let{props:{value:n,label:t,attributes:a}}=e;return{value:n,label:t,attributes:a}})),y=(0,o.lx)(d,((e,n)=>e.value===n.value));if(y.length>0)throw new Error(`Docusaurus error: Duplicate values "${y.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`);const v=null===s?s:s??m.find((e=>e.props.default))?.props.value??m[0]?.props.value;if(null!==v&&!d.some((e=>e.value===v)))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${v}" but none of its children has the corresponding value. Available values are: ${d.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);const{tabGroupChoices:g,setTabGroupChoices:f}=(0,o.UB)(),[h,b]=(0,r.useState)(v),z=[],{blockElementScrollPositionUntilNextRender:A}=(0,o.o5)();if(null!=p){const e=g[p];null!=e&&e!==h&&d.some((n=>n.value===e))&&b(e)}const k=e=>{const n=e.currentTarget,t=z.indexOf(n),a=d[t].value;a!==h&&(A(n),b(a),null!=p&&f(p,a))},G=e=>{let n=null;switch(e.key){case"ArrowRight":{const t=z.indexOf(e.currentTarget)+1;n=z[t]||z[0];break}case"ArrowLeft":{const t=z.indexOf(e.currentTarget)-1;n=z[t]||z[z.length-1];break}}n?.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.Z)("tabs",{"tabs--block":t},u)},d.map((e=>{let{value:n,label:t,attributes:s}=e;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:h===n?0:-1,"aria-selected":h===n,key:n,ref:e=>z.push(e),onKeyDown:G,onFocus:k,onClick:k},s,{className:(0,i.Z)("tabs__item",c.tabItem,s?.className,{"tabs__item--active":h===n})}),t??n)}))),n?(0,r.cloneElement)(m.filter((e=>e.props.value===h))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},m.map(((e,n)=>(0,r.cloneElement)(e,{key:n,hidden:e.props.value!==h})))))}function p(e){const n=(0,s.Z)();return r.createElement(l,(0,a.Z)({key:String(n)},e))}},9795:(e,n,t)=>{t.r(n),t.d(n,{contentTitle:()=>c,default:()=>d,frontMatter:()=>i,metadata:()=>l,toc:()=>p});var a=t(7462),r=(t(7294),t(3905)),s=t(9877),o=t(8215);const i={title:"GenzyApi",sidebar_position:8,slug:"/genzy-api/"},c=void 0,l={unversionedId:"categories/genzy-api",id:"categories/genzy-api",title:"GenzyApi",description:"What GenzyApi is",source:"@site/docs/categories/genzy-api.md",sourceDirName:"categories",slug:"/genzy-api/",permalink:"/docs/docs/v1/genzy-api/",tags:[],version:"current",lastUpdatedAt:1697304442,formattedLastUpdatedAt:"10/14/2023",sidebarPosition:8,frontMatter:{title:"GenzyApi",sidebar_position:8,slug:"/genzy-api/"},sidebar:"sidebar",previous:{title:"GenzyContainer",permalink:"/docs/docs/v1/genzy-container/"}},p=[{value:"What GenzyApi is",id:"what-genzyapi-is",children:[],level:2},{value:"Creating an API",id:"creating-an-api",children:[{value:"From Plain Local Services",id:"from-plain-local-services",children:[],level:3},{value:"From Plain Remote Services",id:"from-plain-remote-services",children:[],level:3},{value:"From Configured Local Services",id:"from-configured-local-services",children:[],level:3}],level:2}],u={toc:p},m="wrapper";function d(e){let{components:n,...i}=e;return(0,r.kt)(m,(0,a.Z)({},u,i,{components:n,mdxType:"MDXLayout"}),(0,r.kt)("h2",{id:"what-genzyapi-is"},"What GenzyApi is"),(0,r.kt)("p",null,"GenzyApi is responsible for automatically creating a ",(0,r.kt)("a",{parentName:"p",href:"https://en.wikipedia.org/wiki/Representational_state_transfer"},"RestAPI")," from a set of ",(0,r.kt)("a",{parentName:"p",href:"/docs/docs/v1/genzy-container/"},"GenzyContainers"),"."),(0,r.kt)("p",null,"It is also responsible for automatically building ",(0,r.kt)("a",{parentName:"p",href:"https://www.openapis.org/"},"OpenAPI")," documentation, and serving ",(0,r.kt)("a",{parentName:"p",href:"https://swagger.io/"},"SwaggerUI")," on route ",(0,r.kt)("inlineCode",{parentName:"p"},"/explorer"),"."),(0,r.kt)("h2",{id:"creating-an-api"},"Creating an API"),(0,r.kt)("h3",{id:"from-plain-local-services"},"From Plain Local Services"),(0,r.kt)(s.Z,{groupId:"lang",mdxType:"Tabs"},(0,r.kt)(o.Z,{value:"cjs",label:"CommonJS",default:!0,mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'const { GenzyContainer, GenzyApi } = require("@genzy/api");\n\nclass UserService {\n  async createUser(user) {\n    return user;\n  }\n}\n\nclass AccountService {\n  async getAllAccounts() {\n    return [];\n  }\n}\n\nconst usersGenzyContainer = new GenzyContainer().addLocalServices(\n  UserService,\n  AccountService\n);\n\nconst app = new GenzyApi().from(usersGenzyContainer);\napp.listen(3000);\n'))),(0,r.kt)(o.Z,{value:"js",label:"ES modules",default:!0,mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'import { GenzyContainer, GenzyApi } from "@genzy/api";\n\nclass UserService {\n  async createUser(user) {\n    return user;\n  }\n}\n\nclass AccountService {\n  async getAllAccounts() {\n    return [];\n  }\n}\n\nconst usersGenzyContainer = new GenzyContainer().addLocalServices(\n  UserService,\n  AccountService\n);\n\nconst app = new GenzyApi().from(usersGenzyContainer);\napp.listen(3000);\n'))),(0,r.kt)(o.Z,{value:"ts",label:"TypeScript",default:!0,mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},'import { GenzyContainer, GenzyApi } from "@genzy/api";\n\nclass UserService {\n  async createUser(user): Promise<any> {\n    return user;\n  }\n}\n\nclass AccountService {\n  async getAllAccounts(): Promise<any[]> {\n    return [];\n  }\n}\n\nconst usersGenzyContainer = new GenzyContainer().addLocalServices(\n  UserService,\n  AccountService\n);\n\nconst app = new GenzyApi().from(usersGenzyContainer);\napp.listen(3000);\n')))),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"img",src:t(2609).Z,width:"1458",height:"477"})),(0,r.kt)("h3",{id:"from-plain-remote-services"},"From Plain Remote Services"),(0,r.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"info")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},"An API can also be generated from a set of remote services, so that the API acts as an ",(0,r.kt)("a",{parentName:"p",href:"https://www.nginx.com/learn/api-gateway/"},"API Gateway"),"."))),(0,r.kt)(s.Z,{groupId:"lang",mdxType:"Tabs"},(0,r.kt)(o.Z,{value:"cjs",label:"CommonJS",default:!0,mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'const { GenzyContainer, GenzyApi } = require("@genzy/api");\n\nclass UserService {\n  async createUser(user) {}\n}\n\nclass AccountService {\n  async getAllAccounts() {}\n}\n\nconst usersGenzyContainer = new GenzyContainer().addRemoteServices(\n  "http://localhost:3000",\n  UserService,\n  AccountService\n);\n\nconst app = new GenzyApi().from(usersGenzyContainer);\napp.listen(3000);\n'))),(0,r.kt)(o.Z,{value:"js",label:"ES modules",default:!0,mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'import { GenzyContainer, GenzyApi } from "@genzy/api";\n\nclass UserService {\n  async createUser(user) {}\n}\n\nclass AccountService {\n  async getAllAccounts() {}\n}\n\nconst usersGenzyContainer = new GenzyContainer().addRemoteServices(\n  "http://localhost:3000",\n  UserService,\n  AccountService\n);\n\nconst app = new GenzyApi().from(usersGenzyContainer);\napp.listen(3000);\n'))),(0,r.kt)(o.Z,{value:"ts",label:"TypeScript",default:!0,mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},'import { GenzyContainer, GenzyApi } from "@genzy/api";\n\nclass UserService {\n  async createUser(user): Promise<any> {}\n}\n\nclass AccountService {\n  async getAllAccounts(): Promise<any[]> {}\n}\n\nconst usersGenzyContainer = new GenzyContainer().addRemoteServices(\n  "http://localhost:3000",\n  UserService,\n  AccountService\n);\n\nconst app = new GenzyApi().from(usersGenzyContainer);\napp.listen(3000);\n')))),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"img",src:t(2609).Z,width:"1458",height:"477"})),(0,r.kt)("h3",{id:"from-configured-local-services"},"From Configured Local Services"),(0,r.kt)(s.Z,{groupId:"lang",mdxType:"Tabs"},(0,r.kt)(o.Z,{value:"cjs",label:"CommonJS",default:!0,mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'const { GenzyContainer, GenzyApi } = require("@genzy/api");\n\nclass UserService {\n  $genzy = {\n    path: "/users",\n    createUser: {\n      httpMethod: "POST",\n      path: "/",\n      params: [{ name: "user", source: "body" }],\n    },\n  };\n  async createUser(user) {\n    return user;\n  }\n}\n\nclass AccountService {\n  $genzy = {\n    path: "/accounts",\n    getAllAccounts: {\n      method: "GET",\n      path: "/",\n    },\n  };\n  async getAllAccounts() {\n    return [];\n  }\n}\n\nconst usersGenzyContainer = new GenzyContainer().addLocalServices(\n  UserService,\n  AccountService\n);\n\nconst app = new GenzyApi().from(usersGenzyContainer);\napp.listen(3000);\n'))),(0,r.kt)(o.Z,{value:"js",label:"ES modules",default:!0,mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'import { GenzyContainer, GenzyApi } from "@genzy/api";\n\nclass UserService {\n  $genzy = {\n    path: "/users",\n    createUser: {\n      httpMethod: "POST",\n      path: "/",\n      params: [{ name: "user", source: "body" }],\n    },\n  };\n  async createUser(user) {\n    return user;\n  }\n}\n\nclass AccountService {\n  $genzy = {\n    path: "/accounts",\n    getAllAccounts: {\n      method: "GET",\n      path: "/",\n    },\n  };\n  async getAllAccounts() {\n    return [];\n  }\n}\n\nconst usersGenzyContainer = new GenzyContainer().addLocalServices(\n  UserService,\n  AccountService\n);\n\nconst app = new GenzyApi().from(usersGenzyContainer);\napp.listen(3000);\n'))),(0,r.kt)(o.Z,{value:"ts",label:"TypeScript",default:!0,mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},'import {\n  GenzyContainer,\n  GenzyApi,\n  Controller,\n  Get,\n  Post,\n  Body,\n} from "@genzy/api";\n\n@Controller("/users")\nclass UserService {\n  @Post()\n  async createUser(@Body() user): Promise<any> {\n    return user;\n  }\n}\n\n@Controller("/accounts")\nclass AccountService {\n  @Get()\n  async getAllAccounts(): Promise<any[]> {\n    return [];\n  }\n}\n\nconst usersGenzyContainer = new GenzyContainer().addLocalServices(\n  UserService,\n  AccountService\n);\n\nconst app = new GenzyApi().from(usersGenzyContainer);\napp.listen(3000);\n')))),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"img",src:t(8598).Z,width:"1459",height:"464"})))}d.isMDXComponent=!0},8598:(e,n,t)=>{t.d(n,{Z:()=>a});const a=t.p+"assets/images/configured_local-aaae8797fd23340564cedf2d76b49c2d.png"},2609:(e,n,t)=>{t.d(n,{Z:()=>a});const a=t.p+"assets/images/plain_local-d6e32634cad58cdcf6de40c1c418db9b.png"}}]);