"use strict";(self.webpackChunk_genzy_io_docs=self.webpackChunk_genzy_io_docs||[]).push([[300],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>y});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),u=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},c=function(e){var t=u(e.components);return r.createElement(l.Provider,{value:t},e.children)},p="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),p=u(n),m=a,y=p["".concat(l,".").concat(m)]||p[m]||d[m]||o;return n?r.createElement(y,s(s({ref:t},c),{},{components:n})):r.createElement(y,s({ref:t},c))}));function y(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,s=new Array(o);s[0]=m;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i[p]="string"==typeof e?e:a,s[1]=i;for(var u=2;u<o;u++)s[u]=n[u];return r.createElement.apply(null,s)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},5162:(e,t,n)=>{n.d(t,{Z:()=>s});var r=n(7294),a=n(4334);const o={tabItem:"tabItem_Ymn6"};function s(e){let{children:t,hidden:n,className:s}=e;return r.createElement("div",{role:"tabpanel",className:(0,a.Z)(o.tabItem,s),hidden:n},t)}},4866:(e,t,n)=>{n.d(t,{Z:()=>w});var r=n(7462),a=n(7294),o=n(4334),s=n(2466),i=n(6550),l=n(1980),u=n(7392),c=n(12);function p(e){return function(e){return a.Children.map(e,(e=>{if(!e||(0,a.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}(e).map((e=>{let{props:{value:t,label:n,attributes:r,default:a}}=e;return{value:t,label:n,attributes:r,default:a}}))}function d(e){const{values:t,children:n}=e;return(0,a.useMemo)((()=>{const e=t??p(n);return function(e){const t=(0,u.l)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,n])}function m(e){let{value:t,tabValues:n}=e;return n.some((e=>e.value===t))}function y(e){let{queryString:t=!1,groupId:n}=e;const r=(0,i.k6)(),o=function(e){let{queryString:t=!1,groupId:n}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!n)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return n??null}({queryString:t,groupId:n});return[(0,l._X)(o),(0,a.useCallback)((e=>{if(!o)return;const t=new URLSearchParams(r.location.search);t.set(o,e),r.replace({...r.location,search:t.toString()})}),[o,r])]}function f(e){const{defaultValue:t,queryString:n=!1,groupId:r}=e,o=d(e),[s,i]=(0,a.useState)((()=>function(e){let{defaultValue:t,tabValues:n}=e;if(0===n.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!m({value:t,tabValues:n}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${n.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const r=n.find((e=>e.default))??n[0];if(!r)throw new Error("Unexpected error: 0 tabValues");return r.value}({defaultValue:t,tabValues:o}))),[l,u]=y({queryString:n,groupId:r}),[p,f]=function(e){let{groupId:t}=e;const n=function(e){return e?`docusaurus.tab.${e}`:null}(t),[r,o]=(0,c.Nk)(n);return[r,(0,a.useCallback)((e=>{n&&o.set(e)}),[n,o])]}({groupId:r}),h=(()=>{const e=l??p;return m({value:e,tabValues:o})?e:null})();(0,a.useLayoutEffect)((()=>{h&&i(h)}),[h]);return{selectedValue:s,selectValue:(0,a.useCallback)((e=>{if(!m({value:e,tabValues:o}))throw new Error(`Can't select invalid tab value=${e}`);i(e),u(e),f(e)}),[u,f,o]),tabValues:o}}var h=n(2389);const g={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};function b(e){let{className:t,block:n,selectedValue:i,selectValue:l,tabValues:u}=e;const c=[],{blockElementScrollPositionUntilNextRender:p}=(0,s.o5)(),d=e=>{const t=e.currentTarget,n=c.indexOf(t),r=u[n].value;r!==i&&(p(t),l(r))},m=e=>{let t=null;switch(e.key){case"Enter":d(e);break;case"ArrowRight":{const n=c.indexOf(e.currentTarget)+1;t=c[n]??c[0];break}case"ArrowLeft":{const n=c.indexOf(e.currentTarget)-1;t=c[n]??c[c.length-1];break}}t?.focus()};return a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":n},t)},u.map((e=>{let{value:t,label:n,attributes:s}=e;return a.createElement("li",(0,r.Z)({role:"tab",tabIndex:i===t?0:-1,"aria-selected":i===t,key:t,ref:e=>c.push(e),onKeyDown:m,onClick:d},s,{className:(0,o.Z)("tabs__item",g.tabItem,s?.className,{"tabs__item--active":i===t})}),n??t)})))}function v(e){let{lazy:t,children:n,selectedValue:r}=e;const o=(Array.isArray(n)?n:[n]).filter(Boolean);if(t){const e=o.find((e=>e.props.value===r));return e?(0,a.cloneElement)(e,{className:"margin-top--md"}):null}return a.createElement("div",{className:"margin-top--md"},o.map(((e,t)=>(0,a.cloneElement)(e,{key:t,hidden:e.props.value!==r}))))}function k(e){const t=f(e);return a.createElement("div",{className:(0,o.Z)("tabs-container",g.tabList)},a.createElement(b,(0,r.Z)({},e,t)),a.createElement(v,(0,r.Z)({},e,t)))}function w(e){const t=(0,h.Z)();return a.createElement(k,(0,r.Z)({key:String(t)},e))}},2103:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>l,default:()=>y,frontMatter:()=>i,metadata:()=>u,toc:()=>p});var r=n(7462),a=(n(7294),n(3905)),o=n(4866),s=n(5162);const i={title:"Parameter Configuration",sidebar_position:3,slug:"/service-class-params-config/"},l=void 0,u={unversionedId:"framework/Advanced-Guides/Services/service-class-params-config",id:"framework/Advanced-Guides/Services/service-class-params-config",title:"Parameter Configuration",description:"If you'd like the service methods to be able to receive query and/or path parameters, you can customize them in a $genzy property.",source:"@site/docs/framework/03-Advanced-Guides/06-Services/service-class-params-config.md",sourceDirName:"framework/03-Advanced-Guides/06-Services",slug:"/service-class-params-config/",permalink:"/docs/0.0.1-alpha/service-class-params-config/",draft:!1,tags:[],version:"current",lastUpdatedAt:1697391667,formattedLastUpdatedAt:"Oct 15, 2023",sidebarPosition:3,frontMatter:{title:"Parameter Configuration",sidebar_position:3,slug:"/service-class-params-config/"},sidebar:"sidebar",previous:{title:"Route Configuration",permalink:"/docs/0.0.1-alpha/service-class-routes-config/"},next:{title:"Types Configuration",permalink:"/docs/0.0.1-alpha/service-class-types-config/"}},c={},p=[],d={toc:p},m="wrapper";function y(e){let{components:t,...n}=e;return(0,a.kt)(m,(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"If you'd like the service methods to be able to receive ",(0,a.kt)("a",{parentName:"p",href:"https://en.wikipedia.org/wiki/Query_string"},"query")," and/or ",(0,a.kt)("a",{parentName:"p",href:"https://rapidapi.com/blog/api-glossary/parameters/path/"},"path")," parameters, you can customize them in a ",(0,a.kt)("inlineCode",{parentName:"p"},"$genzy")," property."),(0,a.kt)("p",null,"If you're using ",(0,a.kt)("a",{parentName:"p",href:"https://www.typescriptlang.org/"},"TypeScript")," you can define configuration using ",(0,a.kt)("a",{parentName:"p",href:"https://www.typescriptlang.org/docs/handbook/decorators.html"},"TypeScript decorators"),"."),(0,a.kt)("admonition",{type:"note"},(0,a.kt)("p",{parentName:"admonition"},"If you're using decorators, make sure that you've set ",(0,a.kt)("inlineCode",{parentName:"p"},'"experimentalDecorators"')," option to ",(0,a.kt)("inlineCode",{parentName:"p"},"true")," in your ",(0,a.kt)("inlineCode",{parentName:"p"},"tsconfig.json")," file.")),(0,a.kt)(o.Z,{groupId:"lang",mdxType:"Tabs"},(0,a.kt)(s.Z,{value:"cjs",label:"CommonJS",default:!0,mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"class ExampleService {\n  $genzy = {\n    path: '/',\n    getAll: {\n      httpMethod: 'GET',\n      path: '/',\n      params: [\n        { source: 'query', name: \"pageNumber\" },\n        { source: 'query', name: \"pageSize\" },\n      ]\n    },\n    getById: {\n      httpMethod: 'GET',\n      path: '/:id',\n      params: [\n        { source: 'query', name: \"includeDetails\" }\n        { source: 'path', name: 'id' },\n      ]\n    },\n    add: {\n      httpMethod: 'POST',\n      path: '/',\n      params: [\n        { source: 'body', name: 'example' }\n      ]\n    },\n    update: {\n      httpMethod: 'PUT',\n      path: '/:id',\n      params: [\n        { source: 'path', name: 'id' },\n        { source: 'body', name: 'example' }\n      ]\n    },\n    delete: {\n      httpMethod: 'DELETE',\n      path: '/:id',\n      params: [\n        { source: 'path', name: 'id' },\n      ]\n    },\n  }\n  \n  async getAll(pageNumber, pageSize) {\n    return [];\n  }\n  async getById(includeDetails, id) {\n    return [];\n  }\n  async add(example) {\n    return example;\n  }\n  async update(id, example) {\n    return example;\n  }\n  async delete(id) {\n    return { id };\n  }\n}\n"))),(0,a.kt)(s.Z,{value:"mjs",label:"ES modules",mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"class ExampleService {\n  $genzy = {\n    path: '/',\n    getAll: {\n      httpMethod: 'GET',\n      path: '/',\n      params: [\n        { source: 'query', name: \"pageNumber\" },\n        { source: 'query', name: \"pageSize\" },\n      ]\n    },\n    getById: {\n      httpMethod: 'GET',\n      path: '/:id',\n      params: [\n        { source: 'query', name: \"includeDetails\" },\n        { source: 'path', name: 'id' },\n      ]\n    },\n    add: {\n      httpMethod: 'POST',\n      path: '/',\n      params: [\n        { source: 'body', name: 'example' }\n      ]\n    },\n    update: {\n      httpMethod: 'PUT',\n      path: '/:id',\n      params: [\n        { source: 'path', name: 'id' },\n        { source: 'body', name: 'example' }\n      ]\n    },\n    delete: {\n      httpMethod: 'DELETE',\n      path: '/:id',\n      params: [\n        { source: 'path', name: 'id' },\n      ]\n    },\n  }\n  \n  async getAll(pageNumber, pageSize) {\n    return [];\n  }\n  async getById(includeDetails, id) {\n    return [];\n  }\n  async add(example) {\n    return example;\n  }\n  async update(id, example) {\n    return example;\n  }\n  async delete(id) {\n    return { id };\n  }\n}\n"))),(0,a.kt)(s.Z,{value:"ts",label:"TypeScript",mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { Controller, Get, Post, Put, Delete, Query, Path, Body } from \"@genzy/client\"; // or @genzy/api\n\n@Controller('/')\nclass ExampleService {\n  @Get()\n  async getAll(@Query('pageNumber') pageNumber: number, @Query('pageSize') pageSize: number): Promise<any[]> {\n    return [];\n  }\n  @Get('/:id')\n  async getById(@Query('includeDetails') includeDetails: boolean, @Path('id') id: string): Promise<any> {\n    return {};\n  }\n  @Post()\n  async add(@Body() example: any): Promise<any> {\n    return example;\n  }\n  @Put('/:id')\n  async update(@Path('id') id: string, @Body() example: any): Promise<any> {\n    return example;\n  }\n  @Delete('/:id')\n  async delete(@Path('id') id: string): Promise<any> {\n    return { id };\n  }\n}\n")))),(0,a.kt)("admonition",{type:"important"},(0,a.kt)("p",{parentName:"admonition"},"Configuration must be used both on the client and the server side, since it is used for telling ",(0,a.kt)("inlineCode",{parentName:"p"},"Genzy")," how and where to send the requests, or register the API routes.")))}y.isMDXComponent=!0}}]);