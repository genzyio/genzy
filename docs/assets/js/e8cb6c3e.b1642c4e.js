"use strict";(self.webpackChunk_genzy_io_docs=self.webpackChunk_genzy_io_docs||[]).push([[331],{3905:(e,n,t)=>{t.d(n,{Zo:()=>p,kt:()=>v});var a=t(7294);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function l(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function s(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?l(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):l(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function i(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},l=Object.keys(e);for(a=0;a<l.length;a++)t=l[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)t=l[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var o=a.createContext({}),c=function(e){var n=a.useContext(o),t=n;return e&&(t="function"==typeof e?e(n):s(s({},n),e)),t},p=function(e){var n=c(e.components);return a.createElement(o.Provider,{value:n},e.children)},d="mdxType",u={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},m=a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,l=e.originalType,o=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),d=c(t),m=r,v=d["".concat(o,".").concat(m)]||d[m]||u[m]||l;return t?a.createElement(v,s(s({ref:n},p),{},{components:t})):a.createElement(v,s({ref:n},p))}));function v(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var l=t.length,s=new Array(l);s[0]=m;var i={};for(var o in n)hasOwnProperty.call(n,o)&&(i[o]=n[o]);i.originalType=e,i[d]="string"==typeof e?e:r,s[1]=i;for(var c=2;c<l;c++)s[c]=t[c];return a.createElement.apply(null,s)}return a.createElement.apply(null,t)}m.displayName="MDXCreateElement"},8215:(e,n,t)=>{t.d(n,{Z:()=>r});var a=t(7294);const r=function(e){let{children:n,hidden:t,className:r}=e;return a.createElement("div",{role:"tabpanel",hidden:t,className:r},n)}},9877:(e,n,t)=>{t.d(n,{Z:()=>p});var a=t(7462),r=t(7294),l=t(2389),s=t(5773),i=t(6010);const o={tabItem:"tabItem_LplD"};function c(e){const{lazy:n,block:t,defaultValue:l,values:c,groupId:p,className:d}=e,u=r.Children.map(e.children,(e=>{if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)})),m=c??u.map((e=>{let{props:{value:n,label:t,attributes:a}}=e;return{value:n,label:t,attributes:a}})),v=(0,s.lx)(m,((e,n)=>e.value===n.value));if(v.length>0)throw new Error(`Docusaurus error: Duplicate values "${v.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`);const y=null===l?l:l??u.find((e=>e.props.default))?.props.value??u[0]?.props.value;if(null!==y&&!m.some((e=>e.value===y)))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${y}" but none of its children has the corresponding value. Available values are: ${m.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);const{tabGroupChoices:h,setTabGroupChoices:g}=(0,s.UB)(),[f,b]=(0,r.useState)(y),k=[],{blockElementScrollPositionUntilNextRender:x}=(0,s.o5)();if(null!=p){const e=h[p];null!=e&&e!==f&&m.some((n=>n.value===e))&&b(e)}const N=e=>{const n=e.currentTarget,t=k.indexOf(n),a=m[t].value;a!==f&&(x(n),b(a),null!=p&&g(p,a))},T=e=>{let n=null;switch(e.key){case"ArrowRight":{const t=k.indexOf(e.currentTarget)+1;n=k[t]||k[0];break}case"ArrowLeft":{const t=k.indexOf(e.currentTarget)-1;n=k[t]||k[k.length-1];break}}n?.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.Z)("tabs",{"tabs--block":t},d)},m.map((e=>{let{value:n,label:t,attributes:l}=e;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:f===n?0:-1,"aria-selected":f===n,key:n,ref:e=>k.push(e),onKeyDown:T,onFocus:N,onClick:N},l,{className:(0,i.Z)("tabs__item",o.tabItem,l?.className,{"tabs__item--active":f===n})}),t??n)}))),n?(0,r.cloneElement)(u.filter((e=>e.props.value===f))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},u.map(((e,n)=>(0,r.cloneElement)(e,{key:n,hidden:e.props.value!==f})))))}function p(e){const n=(0,l.Z)();return r.createElement(c,(0,a.Z)({key:String(n)},e))}},7046:(e,n,t)=>{t.r(n),t.d(n,{contentTitle:()=>o,default:()=>m,frontMatter:()=>i,metadata:()=>c,toc:()=>p});var a=t(7462),r=(t(7294),t(3905)),l=t(9877),s=t(8215);const i={title:"Service class",sidebar_position:1,slug:"/service-class/"},o=void 0,c={unversionedId:"categories/Services/service-class",id:"categories/Services/service-class",title:"Service class",description:"What Service class is",source:"@site/docs/categories/06-Services/service-class.md",sourceDirName:"categories/06-Services",slug:"/service-class/",permalink:"/docs/v1/service-class/",tags:[],version:"current",lastUpdatedAt:1697306351,formattedLastUpdatedAt:"10/14/2023",sidebarPosition:1,frontMatter:{title:"Service class",sidebar_position:1,slug:"/service-class/"},sidebar:"sidebar",previous:{title:"Usage",permalink:"/docs/v1/cli-usage/"},next:{title:"Route Configuration",permalink:"/docs/v1/service-class-routes-config/"}},p=[{value:"What Service class is",id:"what-service-class-is",children:[],level:2},{value:"Plain",id:"plain",children:[],level:2},{value:"Configured",id:"configured",children:[],level:2}],d={toc:p},u="wrapper";function m(e){let{components:n,...t}=e;return(0,r.kt)(u,(0,a.Z)({},d,t,{components:n,mdxType:"MDXLayout"}),(0,r.kt)("h2",{id:"what-service-class-is"},"What Service class is"),(0,r.kt)("p",null,"Service class is a JavaScript class that implements an arbitrary piece of business logic. It's methods can have parameters, and can also return results."),(0,r.kt)("p",null,"Genzy can generate a Web API or an HTTP Client from any Service Class."),(0,r.kt)("h2",{id:"plain"},"Plain"),(0,r.kt)("p",null,"Plain JavaScript classes can be used."),(0,r.kt)(l.Z,{groupId:"lang",mdxType:"Tabs"},(0,r.kt)(s.Z,{value:"cjs",label:"CommonJS",default:!0,mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"class ExampleService {\n  async getAll() {\n    return [];\n  }\n  async getById(id) {\n    return [];\n  }\n  async add(example) {\n    return example;\n  }\n  async update(example) {\n    return example;\n  }\n  async delete(id) {\n    return { id };\n  }\n}\n"))),(0,r.kt)(s.Z,{value:"mjs",label:"ES modules",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"class ExampleService {\n  async getAll() {\n    return [];\n  }\n  async getById(id) {\n    return [];\n  }\n  async add(example) {\n    return example;\n  }\n  async update(example) {\n    return example;\n  }\n  async delete(id) {\n    return { id };\n  }\n}\n"))),(0,r.kt)(s.Z,{value:"ts",label:"TypeScript",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"class ExampleService {\n  async getAll(): Promise<any[]> {\n    return [];\n  }\n  async getById(id: string): Promise<any> {\n    return {};\n  }\n  async add(example: any): Promise<any> {\n    return example;\n  }\n  async update(example: any): Promise<any> {\n    return example;\n  }\n  async delete(id: string): Promise<any> {\n    return { id };\n  }\n}\n")))),(0,r.kt)("h2",{id:"configured"},"Configured"),(0,r.kt)("p",null,"If you'd like the service, and its methods to be registered on a different route path from the default ones, you can customize them in a ",(0,r.kt)("inlineCode",{parentName:"p"},"$genzy")," property."),(0,r.kt)("p",null,"If you're using ",(0,r.kt)("a",{parentName:"p",href:"https://www.typescriptlang.org/"},"TypeScript")," you can define configuration using ",(0,r.kt)("a",{parentName:"p",href:"https://www.typescriptlang.org/docs/handbook/decorators.html"},"TypeScript decorators"),"."),(0,r.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"note")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},"If you're using decorators, make sure that you've set ",(0,r.kt)("inlineCode",{parentName:"p"},'"experimentalDecorators"')," option to ",(0,r.kt)("inlineCode",{parentName:"p"},"true")," in your ",(0,r.kt)("inlineCode",{parentName:"p"},"tsconfig.json")," file."))),(0,r.kt)(l.Z,{groupId:"lang",mdxType:"Tabs"},(0,r.kt)(s.Z,{value:"cjs",label:"CommonJS",default:!0,mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"class ExampleService {\n  $genzy = {\n    path: '/',\n    getAll: {\n      httpMethod: 'GET',\n      path: '/'\n    },\n    getById: {\n      httpMethod: 'GET',\n      path: '/:id'\n    },\n    add: {\n      httpMethod: 'POST',\n      path: '/'\n    },\n    update: {\n      httpMethod: 'PUT',\n      path: '/'\n    },\n    delete: {\n      httpMethod: 'DELETE',\n      path: '/:id'\n    },\n  }\n  \n  async getAll() {\n    return [];\n  }\n  async getById(id) {\n    return [];\n  }\n  async add(example) {\n    return example;\n  }\n  async update(example) {\n    return example;\n  }\n  async delete(id) {\n    return { id };\n  }\n}\n"))),(0,r.kt)(s.Z,{value:"mjs",label:"ES modules",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"class ExampleService {\n  $genzy = {\n    path: '/',\n    getAll: {\n      httpMethod: 'GET',\n      path: '/'\n    },\n    getById: {\n      httpMethod: 'GET',\n      path: '/:id'\n    },\n    add: {\n      httpMethod: 'POST',\n      path: '/'\n    },\n    update: {\n      httpMethod: 'PUT',\n      path: '/'\n    },\n    delete: {\n      httpMethod: 'DELETE',\n      path: '/:id'\n    },\n  }\n\n  async getAll() {\n    return [];\n  }\n  async getById(id) {\n    return [];\n  }\n  async add(example) {\n    return example;\n  }\n  async update(example) {\n    return example;\n  }\n  async delete(id) {\n    return { id };\n  }\n}\n"))),(0,r.kt)(s.Z,{value:"ts",label:"TypeScript",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { Controller, Get, Post, Put, Delete } from \"@genzy/client\"; // or @genzy/api\n\n@Controller('/')\nclass ExampleService {\n  @Get()\n  async getAll(): Promise<any[]> {\n    return [];\n  }\n  @Get('/:id')\n  async getById(id: string): Promise<any> {\n    return [];\n  }\n  @Post()\n  async add(example: any): Promise<any> {\n    return example;\n  }\n  @Put()\n  async update(example: any): Promise<any> {\n    return example;\n  }\n  @Delete('/:id')\n  async delete(id: string): Promise<any> {\n    return { id };\n  }\n}\n")))),(0,r.kt)("div",{className:"admonition admonition-important alert alert--info"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"important")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},"Configuration must be used both on the client and the server side, since it is used for telling ",(0,r.kt)("inlineCode",{parentName:"p"},"Genzy")," how and where to send the requests, or register the API routes."))))}m.isMDXComponent=!0}}]);