"use strict";(self.webpackChunk_genzy_io_docs=self.webpackChunk_genzy_io_docs||[]).push([[49],{3905:(e,n,t)=>{t.d(n,{Zo:()=>u,kt:()=>y});var a=t(7294);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function o(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)t=i[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)t=i[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var l=a.createContext({}),p=function(e){var n=a.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):o(o({},n),e)),t},u=function(e){var n=p(e.components);return a.createElement(l.Provider,{value:n},e.children)},c="mdxType",d={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},m=a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,i=e.originalType,l=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),c=p(t),m=r,y=c["".concat(l,".").concat(m)]||c[m]||d[m]||i;return t?a.createElement(y,o(o({ref:n},u),{},{components:t})):a.createElement(y,o({ref:n},u))}));function y(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var i=t.length,o=new Array(i);o[0]=m;var s={};for(var l in n)hasOwnProperty.call(n,l)&&(s[l]=n[l]);s.originalType=e,s[c]="string"==typeof e?e:r,o[1]=s;for(var p=2;p<i;p++)o[p]=t[p];return a.createElement.apply(null,o)}return a.createElement.apply(null,t)}m.displayName="MDXCreateElement"},5162:(e,n,t)=>{t.d(n,{Z:()=>o});var a=t(7294),r=t(4334);const i={tabItem:"tabItem_Ymn6"};function o(e){let{children:n,hidden:t,className:o}=e;return a.createElement("div",{role:"tabpanel",className:(0,r.Z)(i.tabItem,o),hidden:t},n)}},4866:(e,n,t)=>{t.d(n,{Z:()=>T});var a=t(7462),r=t(7294),i=t(4334),o=t(2466),s=t(6550),l=t(1980),p=t(7392),u=t(12);function c(e){return function(e){return r.Children.map(e,(e=>{if(!e||(0,r.isValidElement)(e)&&function(e){const{props:n}=e;return!!n&&"object"==typeof n&&"value"in n}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}(e).map((e=>{let{props:{value:n,label:t,attributes:a,default:r}}=e;return{value:n,label:t,attributes:a,default:r}}))}function d(e){const{values:n,children:t}=e;return(0,r.useMemo)((()=>{const e=n??c(t);return function(e){const n=(0,p.l)(e,((e,n)=>e.value===n.value));if(n.length>0)throw new Error(`Docusaurus error: Duplicate values "${n.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[n,t])}function m(e){let{value:n,tabValues:t}=e;return t.some((e=>e.value===n))}function y(e){let{queryString:n=!1,groupId:t}=e;const a=(0,s.k6)(),i=function(e){let{queryString:n=!1,groupId:t}=e;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!t)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return t??null}({queryString:n,groupId:t});return[(0,l._X)(i),(0,r.useCallback)((e=>{if(!i)return;const n=new URLSearchParams(a.location.search);n.set(i,e),a.replace({...a.location,search:n.toString()})}),[i,a])]}function f(e){const{defaultValue:n,queryString:t=!1,groupId:a}=e,i=d(e),[o,s]=(0,r.useState)((()=>function(e){let{defaultValue:n,tabValues:t}=e;if(0===t.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(n){if(!m({value:n,tabValues:t}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${n}" but none of its children has the corresponding value. Available values are: ${t.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return n}const a=t.find((e=>e.default))??t[0];if(!a)throw new Error("Unexpected error: 0 tabValues");return a.value}({defaultValue:n,tabValues:i}))),[l,p]=y({queryString:t,groupId:a}),[c,f]=function(e){let{groupId:n}=e;const t=function(e){return e?`docusaurus.tab.${e}`:null}(n),[a,i]=(0,u.Nk)(t);return[a,(0,r.useCallback)((e=>{t&&i.set(e)}),[t,i])]}({groupId:a}),g=(()=>{const e=l??c;return m({value:e,tabValues:i})?e:null})();(0,r.useLayoutEffect)((()=>{g&&s(g)}),[g]);return{selectedValue:o,selectValue:(0,r.useCallback)((e=>{if(!m({value:e,tabValues:i}))throw new Error(`Can't select invalid tab value=${e}`);s(e),p(e),f(e)}),[p,f,i]),tabValues:i}}var g=t(2389);const h={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};function b(e){let{className:n,block:t,selectedValue:s,selectValue:l,tabValues:p}=e;const u=[],{blockElementScrollPositionUntilNextRender:c}=(0,o.o5)(),d=e=>{const n=e.currentTarget,t=u.indexOf(n),a=p[t].value;a!==s&&(c(n),l(a))},m=e=>{let n=null;switch(e.key){case"Enter":d(e);break;case"ArrowRight":{const t=u.indexOf(e.currentTarget)+1;n=u[t]??u[0];break}case"ArrowLeft":{const t=u.indexOf(e.currentTarget)-1;n=u[t]??u[u.length-1];break}}n?.focus()};return r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.Z)("tabs",{"tabs--block":t},n)},p.map((e=>{let{value:n,label:t,attributes:o}=e;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:s===n?0:-1,"aria-selected":s===n,key:n,ref:e=>u.push(e),onKeyDown:m,onClick:d},o,{className:(0,i.Z)("tabs__item",h.tabItem,o?.className,{"tabs__item--active":s===n})}),t??n)})))}function v(e){let{lazy:n,children:t,selectedValue:a}=e;const i=(Array.isArray(t)?t:[t]).filter(Boolean);if(n){const e=i.find((e=>e.props.value===a));return e?(0,r.cloneElement)(e,{className:"margin-top--md"}):null}return r.createElement("div",{className:"margin-top--md"},i.map(((e,n)=>(0,r.cloneElement)(e,{key:n,hidden:e.props.value!==a}))))}function x(e){const n=f(e);return r.createElement("div",{className:(0,i.Z)("tabs-container",h.tabList)},r.createElement(b,(0,a.Z)({},e,n)),r.createElement(v,(0,a.Z)({},e,n)))}function T(e){const n=(0,g.Z)();return r.createElement(x,(0,a.Z)({key:String(n)},e))}},5990:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>u,contentTitle:()=>l,default:()=>y,frontMatter:()=>s,metadata:()=>p,toc:()=>c});var a=t(7462),r=(t(7294),t(3905)),i=t(4866),o=t(5162);const s={title:"Types Configuration",sidebar_position:4,slug:"/service-class-types-config/"},l=void 0,p={unversionedId:"framework/Advanced-Guides/Services/service-class-types-config",id:"framework/Advanced-Guides/Services/service-class-types-config",title:"Types Configuration",description:"If you'd like Genzy to be able to generate a detailed OpenAPI documentation, with SwaggerUI that includes Type Definitions, you can define types in a $genzy property.",source:"@site/docs/framework/03-Advanced-Guides/06-Services/service-class-types-config.md",sourceDirName:"framework/03-Advanced-Guides/06-Services",slug:"/service-class-types-config/",permalink:"/docs/0.0.1-alpha/service-class-types-config/",draft:!1,tags:[],version:"current",lastUpdatedAt:1697391667,formattedLastUpdatedAt:"Oct 15, 2023",sidebarPosition:4,frontMatter:{title:"Types Configuration",sidebar_position:4,slug:"/service-class-types-config/"},sidebar:"sidebar",previous:{title:"Parameter Configuration",permalink:"/docs/0.0.1-alpha/service-class-params-config/"},next:{title:"GenzyContainer",permalink:"/docs/0.0.1-alpha/genzy-container/"}},u={},c=[],d={toc:c},m="wrapper";function y(e){let{components:n,...t}=e;return(0,r.kt)(m,(0,a.Z)({},d,t,{components:n,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"If you'd like ",(0,r.kt)("inlineCode",{parentName:"p"},"Genzy")," to be able to generate a detailed ",(0,r.kt)("a",{parentName:"p",href:"https://www.openapis.org/"},"OpenAPI")," documentation, with ",(0,r.kt)("a",{parentName:"p",href:"https://swagger.io/"},"SwaggerUI")," that includes ",(0,r.kt)("a",{parentName:"p",href:"https://swagger.io/docs/specification/data-models/data-types/"},"Type Definitions"),", you can define types in a ",(0,r.kt)("inlineCode",{parentName:"p"},"$genzy")," property."),(0,r.kt)("p",null,"If you're using ",(0,r.kt)("a",{parentName:"p",href:"https://www.typescriptlang.org/"},"TypeScript")," you can define configuration using ",(0,r.kt)("a",{parentName:"p",href:"https://www.typescriptlang.org/docs/handbook/decorators.html"},"TypeScript decorators"),"."),(0,r.kt)("admonition",{type:"note"},(0,r.kt)("p",{parentName:"admonition"},"If you're using decorators, make sure that you've set ",(0,r.kt)("inlineCode",{parentName:"p"},'"experimentalDecorators"')," option to ",(0,r.kt)("inlineCode",{parentName:"p"},"true")," in your ",(0,r.kt)("inlineCode",{parentName:"p"},"tsconfig.json")," file.")),(0,r.kt)(i.Z,{groupId:"lang",mdxType:"Tabs"},(0,r.kt)(o.Z,{value:"cjs",label:"CommonJS",default:!0,mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"const exampleTypeDefinition = {\n  $typeName: \"Example\",\n  $isArray: false,\n  name: \"string\",\n  age: \"number\"\n};\n\nconst exampleArrayTypeDefinition = {\n  ...exampleTypeDefinition,\n  $isArray: true,\n};\n\nclass ExampleService {\n  $genzy = {\n    path: '/',\n    getAll: {\n      httpMethod: 'GET',\n      path: '/',\n      params: [\n        { source: 'query', name: \"pageNumber\", type: 'string' },\n        { source: 'query', name: \"pageSize\", type: 'string' },\n      ],\n      result: exampleArrayTypeDefinition\n    },\n    getById: {\n      httpMethod: 'GET',\n      path: '/:id',\n      params: [\n        { source: 'query', name: \"includeDetails\", type: 'boolean' }\n        { source: 'path', name: 'id', type: 'string' },\n      ],\n      result: exampleTypeDefinition\n    },\n    add: {\n      httpMethod: 'POST',\n      path: '/',\n      params: [\n        { source: 'body', name: 'example', type: exampleTypeDefinition }\n      ],\n      result: exampleTypeDefinition\n    },\n    update: {\n      httpMethod: 'PUT',\n      path: '/:id',\n      params: [\n        { source: 'path', name: 'id', type: 'string' },\n        { source: 'body', name: 'example', type: exampleTypeDefinition }\n      ],\n      result: exampleTypeDefinition\n    },\n    delete: {\n      httpMethod: 'DELETE',\n      path: '/:id',\n      params: [\n        { source: 'path', name: 'id', type: 'string' },\n      ],\n      result: exampleTypeDefinition\n    },\n  }\n  \n  async getAll(pageNumber, pageSize) {\n    return [];\n  }\n  async getById(includeDetails, id) {\n    return [];\n  }\n  async add(example) {\n    return example;\n  }\n  async update(id, example) {\n    return example;\n  }\n  async delete(id) {\n    return { id };\n  }\n}\n"))),(0,r.kt)(o.Z,{value:"mjs",label:"ES modules",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"const exampleTypeDefinition = {\n  $typeName: \"Example\",\n  $isArray: false,\n  name: \"string\",\n  age: \"number\"\n};\n\nconst exampleArrayTypeDefinition = {\n  ...exampleTypeDefinition,\n  $isArray: true,\n};\n\nclass ExampleService {\n  $genzy = {\n    path: '/',\n    getAll: {\n      httpMethod: 'GET',\n      path: '/',\n      params: [\n        { source: 'query', name: \"pageNumber\", type: 'string' },\n        { source: 'query', name: \"pageSize\", type: 'string' },\n      ],\n      result: exampleArrayTypeDefinition\n    },\n    getById: {\n      httpMethod: 'GET',\n      path: '/:id',\n      params: [\n        { source: 'query', name: \"includeDetails\", type: 'boolean' }\n        { source: 'path', name: 'id', type: 'string' },\n      ],\n      result: exampleTypeDefinition\n    },\n    add: {\n      httpMethod: 'POST',\n      path: '/',\n      params: [\n        { source: 'body', name: 'example', type: exampleTypeDefinition }\n      ],\n      result: exampleTypeDefinition\n    },\n    update: {\n      httpMethod: 'PUT',\n      path: '/:id',\n      params: [\n        { source: 'path', name: 'id', type: 'string' },\n        { source: 'body', name: 'example', type: exampleTypeDefinition }\n      ],\n      result: exampleTypeDefinition\n    },\n    delete: {\n      httpMethod: 'DELETE',\n      path: '/:id',\n      params: [\n        { source: 'path', name: 'id', type: 'string' },\n      ],\n      result: exampleTypeDefinition\n    },\n  }\n  \n  async getAll(pageNumber, pageSize) {\n    return [];\n  }\n  async getById(includeDetails, id) {\n    return [];\n  }\n  async add(example) {\n    return example;\n  }\n  async update(id, example) {\n    return example;\n  }\n  async delete(id) {\n    return { id };\n  }\n}\n"))),(0,r.kt)(o.Z,{value:"ts",label:"TypeScript",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { Controller, Get, Post, Put, Delete, Query, Path, Body, string, number, boolean, type, Returns, ReturnsArrayOf } from \"@genzy/client\"; // or @genzy/api\n\nclass Example {\n  @string() name: string;\n  @int()age: number;\n}\n\n@Controller('/')\nclass ExampleService {\n  @Get()\n  @ReturnsArrayOf(Example)\n  async getAll(@Query('pageNumber') @int()pageNumber: number, @Query('pageSize') @int()pageSize: number): Promise<Example[]> {\n    return [];\n  }\n  @Get('/:id')\n  @Returns(Example)\n  async getById(@Query('includeDetails') @boolean()includeDetails: boolean, @Path('id') @string() id: string): Promise<Example> {\n    return {};\n  }\n  @Post()\n  @Returns(Example)\n  async add(@Body() @type(Example) example: Example): Promise<Example> {\n    return example;\n  }\n  @Put('/:id')\n  @Returns(Example)\n  async update(@Path('id') @string() id: string, @Body() @type(Example) example: Example): Promise<Example> {\n    return example;\n  }\n  @Delete('/:id')\n  @Returns(Example)\n  async delete(@Path('id') @string() id: string): Promise<Example> {\n    return { id };\n  }\n}\n")))),(0,r.kt)("admonition",{type:"important"},(0,r.kt)("p",{parentName:"admonition"},"Types configuration is used at the server side, since it is used for telling ",(0,r.kt)("inlineCode",{parentName:"p"},"Genzy")," how to set up a detailed ",(0,r.kt)("a",{parentName:"p",href:"https://www.openapis.org/"},"OpenAPI")," documentation, with ",(0,r.kt)("a",{parentName:"p",href:"https://swagger.io/"},"SwaggerUI")," that includes ",(0,r.kt)("a",{parentName:"p",href:"https://swagger.io/docs/specification/data-models/data-types/"},"Type Definitions"),".")))}y.isMDXComponent=!0}}]);