"use strict";(self.webpackChunk_genzy_io_docs=self.webpackChunk_genzy_io_docs||[]).push([[162],{3905:(e,t,n)=>{n.d(t,{Zo:()=>m,kt:()=>u});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function p(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var o=a.createContext({}),s=function(e){var t=a.useContext(o),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},m=function(e){var t=s(e.components);return a.createElement(o.Provider,{value:t},e.children)},c="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},g=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,o=e.parentName,m=p(e,["components","mdxType","originalType","parentName"]),c=s(n),g=r,u=c["".concat(o,".").concat(g)]||c[g]||d[g]||i;return n?a.createElement(u,l(l({ref:t},m),{},{components:n})):a.createElement(u,l({ref:t},m))}));function u(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,l=new Array(i);l[0]=g;var p={};for(var o in t)hasOwnProperty.call(t,o)&&(p[o]=t[o]);p.originalType=e,p[c]="string"==typeof e?e:r,l[1]=p;for(var s=2;s<i;s++)l[s]=n[s];return a.createElement.apply(null,l)}return a.createElement.apply(null,n)}g.displayName="MDXCreateElement"},9390:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>o,contentTitle:()=>l,default:()=>d,frontMatter:()=>i,metadata:()=>p,toc:()=>s});var a=n(7462),r=(n(7294),n(3905));const i={title:"Getting Started",slug:"/getting-started/"},l=void 0,p={unversionedId:"getting-started",id:"getting-started",title:"Getting Started",description:"NPM",source:"@site/docs/getting-started.md",sourceDirName:".",slug:"/getting-started/",permalink:"/docs/0.0.1-alpha/getting-started/",draft:!1,tags:[],version:"current",lastUpdatedAt:1697391667,formattedLastUpdatedAt:"Oct 15, 2023",frontMatter:{title:"Getting Started",slug:"/getting-started/"}},o={},s=[{value:"Setting up the server",id:"setting-up-the-server",level:2}],m={toc:s},c="wrapper";function d(e){let{components:t,...i}=e;return(0,r.kt)(c,(0,a.Z)({},m,i,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"https://nodei.co/npm/@genzy/client/"},(0,r.kt)("img",{parentName:"a",src:"https://nodei.co/npm/@genzy/client.png",alt:"NPM"})),"\n",(0,r.kt)("a",{parentName:"p",href:"https://nodei.co/npm/@genzy/api/"},(0,r.kt)("img",{parentName:"a",src:"https://nodei.co/npm/@genzy/api.png",alt:"NPM"})),"\n",(0,r.kt)("a",{parentName:"p",href:"https://nodei.co/npm/@genzy/cli/"},(0,r.kt)("img",{parentName:"a",src:"https://nodei.co/npm/@genzy/cli.png",alt:"NPM"}))),(0,r.kt)("h2",{id:"setting-up-the-server"},"Setting up the server"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"Initialize the project")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"npm init -y\n")),(0,r.kt)("ol",{start:2},(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("a",{parentName:"li",href:"/docs/0.0.1-alpha/server-installation/"},"Install")," ",(0,r.kt)("inlineCode",{parentName:"li"},"@genzy/api")," library")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"npm i -S @genzy/api\n")),(0,r.kt)("ol",{start:3},(0,r.kt)("li",{parentName:"ol"},"Implement Example ",(0,r.kt)("a",{parentName:"li",href:"/docs/0.0.1-alpha/service-class/"},"service"))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="example.ts"',title:'"example.ts"'},'import {\n  Controller,\n  Get,\n  Post,\n  Put,\n  Delete,\n  Query,\n  Path,\n  Body,\n  string,\n  number,\n  boolean,\n  type,\n  Returns,\n  ReturnsArrayOf,\n} from "@genzy/api";\n\nclass Example {\n  @string() name: string;\n  @int() age: number;\n}\n\n@Controller("/examples")\nexport class ExampleService {\n  @Get()\n  @ReturnsArrayOf(Example)\n  async getAll(\n    @Query("pageNumber") @int() pageNumber: number,\n    @Query("pageSize") @int() pageSize: number\n  ): Promise<Example[]> {\n    return [];\n  }\n  @Get("/:id")\n  @Returns(Example)\n  async getById(\n    @Query("includeDetails") @boolean() includeDetails: boolean,\n    @Path("id") @string() id: string\n  ): Promise<Example> {\n    return;\n  }\n  @Post()\n  @Returns(Example)\n  async add(@Body() @type(Example) example: Example): Promise<Example> {\n    return example;\n  }\n  @Put("/:id")\n  @Returns(Example)\n  async update(\n    @Path("id") @string() id: string,\n    @Body() @type(Example) example: Example\n  ): Promise<Example> {\n    return example;\n  }\n  @Delete("/:id")\n  @Returns(Example)\n  async delete(@Path("id") @string() id: string): Promise<Example> {\n    return;\n  }\n}\n')),(0,r.kt)("ol",{start:4},(0,r.kt)("li",{parentName:"ol"},"Create a ",(0,r.kt)("a",{parentName:"li",href:"/docs/0.0.1-alpha/genzy-container/"},"GenzyContainer")," of services and the ",(0,r.kt)("a",{parentName:"li",href:"/docs/0.0.1-alpha/genzy-api/"},"GenzyApi"))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="index.ts"',title:'"index.ts"'},'import { GenzyContainer, GenzyApi } from "@genzy/api";\nimport { ExampleService } from "./example";\n\nconst container = new GenzyContainer().addLocalService(ExampleService);\n\nconst api = new GenzyApi({\n  genzyInfo: {\n    name: "Example Microservice",\n    version: "1.0.0",\n    description: "This is an example microservice.",\n  },\n}).from(container);\n\nconst PORT = 3000;\napi.listen(PORT, () => console.log(`Started listening on ${PORT}`));\n\ntype GenzyContainerServices = {\n  exampleService: ExampleService;\n};\n\n// The instances are available for custom usage\nconst { exampleService } = usersGenzyContainer.services();\n')),(0,r.kt)("admonition",{title:"5 routes have been registered",type:"info"},(0,r.kt)("ul",{parentName:"admonition"},(0,r.kt)("li",{parentName:"ul"},"GET /api/examples"),(0,r.kt)("li",{parentName:"ul"},"GET /api/examples/{id}"),(0,r.kt)("li",{parentName:"ul"},"POST /api/examples"),(0,r.kt)("li",{parentName:"ul"},"PUT /api/examples/{id}"),(0,r.kt)("li",{parentName:"ul"},"DELETE /api/examples/{id}\n:::")),(0,r.kt)("p",{parentName:"admonition"},(0,r.kt)("img",{alt:"img",src:n(8129).Z,width:"1435",height:"691"})),(0,r.kt)("h2",{parentName:"admonition",id:"setting-up-the-client"},"Setting up the client"),(0,r.kt)("ol",{parentName:"admonition"},(0,r.kt)("li",{parentName:"ol"},"Initialize the project")),(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"npm init -y\n")),(0,r.kt)("ol",{parentName:"admonition",start:2},(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("a",{parentName:"li",href:"/docs/0.0.1-alpha/client-installation/"},"Install")," ",(0,r.kt)("inlineCode",{parentName:"li"},"@genzy/client")," library")),(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"npm i -S @genzy/client\n")),(0,r.kt)("ol",{parentName:"admonition",start:3},(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("a",{parentName:"li",href:"/docs/0.0.1-alpha/cli-installation/"},"Install")," ",(0,r.kt)("inlineCode",{parentName:"li"},"@genzy/cli")," CLI")),(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"npm i -g @genzy/cli\n")),(0,r.kt)("ol",{parentName:"admonition",start:4},(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("a",{parentName:"li",href:"./framework/05-CLI/cli-usage.md#typescript"},"Generate")," TypeScript client code")),(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"genzy -l ts -h http://localhost:3000 -o ./services/example\n"))),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"services/example/index.ts"),(0,r.kt)("li",{parentName:"ul"},"services/example/ExampleService.ts\n:::")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="services/example/index.ts"',title:'"services/example/index.ts"'},'// Auto-generated by Genzy Client CLI\nimport { GenzyContainer } from "@genzy/client";\nimport { ExampleService as ExampleServiceLocal } from "./ExampleService";\n\nconst host = "http://localhost:3000";\n\nexport type GenzyContainerServices = {\n  exampleService: ExampleServiceLocal;\n};\n\nexport const { exampleService }: GenzyContainerServices = new GenzyContainer()\n  .ofRemote(ExampleServiceLocal, host)\n  .services();\n')),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="services/example/ExampleService.ts"',title:'"services/example/ExampleService.ts"'},'// Auto-generated by Genzy Client CLI\nimport {\n  Controller,\n  Get,\n  Post,\n  Put,\n  Delete,\n  Query,\n  Path,\n  Body,\n} from "@genzy/client";\n\nexport class Example {\n  name: string;\n  age: number;\n}\n\n@Controller("/examples")\nexport class ExampleService {\n  @Get("/")\n  async getAll(\n    @Query("pageNumber") pageNumber: number,\n    @Query("pageSize") pageSize: number\n  ) {}\n\n  @Get("/:id")\n  async getById(\n    @Query("includeDetails") includeDetails: string,\n    @Path("id") id: boolean\n  ) {}\n\n  @Post("/")\n  async add(@Body() body: Example) {}\n\n  @Put("/:id")\n  async update(@Path("id") id: string, @Body() body: Example) {}\n\n  @Delete("/:id")\n  async delete(@Path("id") id: string) {}\n}\n')),(0,r.kt)("ol",{start:5},(0,r.kt)("li",{parentName:"ol"},"Use the ExampleService elsewhere")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="somewhere.ts"',title:'"somewhere.ts"'},'import { exampleService } from "./services/example";\n\nexampleService.getAll().then(console.log).catch(console.log);\n')))}d.isMDXComponent=!0},8129:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/example_swagger-73bff255d4b029c2144aef5f96bc61e0.png"}}]);