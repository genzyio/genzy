"use strict";(self.webpackChunk_genzy_io_docs=self.webpackChunk_genzy_io_docs||[]).push([[162],{3905:(e,n,t)=>{t.d(n,{Zo:()=>m,kt:()=>u});var a=t(7294);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function l(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function p(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)t=i[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)t=i[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var o=a.createContext({}),s=function(e){var n=a.useContext(o),t=n;return e&&(t="function"==typeof e?e(n):l(l({},n),e)),t},m=function(e){var n=s(e.components);return a.createElement(o.Provider,{value:n},e.children)},c="mdxType",d={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},g=a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,i=e.originalType,o=e.parentName,m=p(e,["components","mdxType","originalType","parentName"]),c=s(t),g=r,u=c["".concat(o,".").concat(g)]||c[g]||d[g]||i;return t?a.createElement(u,l(l({ref:n},m),{},{components:t})):a.createElement(u,l({ref:n},m))}));function u(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var i=t.length,l=new Array(i);l[0]=g;var p={};for(var o in n)hasOwnProperty.call(n,o)&&(p[o]=n[o]);p.originalType=e,p[c]="string"==typeof e?e:r,l[1]=p;for(var s=2;s<i;s++)l[s]=t[s];return a.createElement.apply(null,l)}return a.createElement.apply(null,t)}g.displayName="MDXCreateElement"},9390:(e,n,t)=>{t.r(n),t.d(n,{contentTitle:()=>l,default:()=>c,frontMatter:()=>i,metadata:()=>p,toc:()=>o});var a=t(7462),r=(t(7294),t(3905));const i={title:"Getting Started",slug:"/getting-started/"},l=void 0,p={unversionedId:"getting-started",id:"getting-started",title:"Getting Started",description:"NPM",source:"@site/docs/getting-started.md",sourceDirName:".",slug:"/getting-started/",permalink:"/docs/docs/v1/getting-started/",tags:[],version:"current",lastUpdatedAt:1697304442,formattedLastUpdatedAt:"10/14/2023",frontMatter:{title:"Getting Started",slug:"/getting-started/"}},o=[{value:"Setting up the server",id:"setting-up-the-server",children:[],level:2}],s={toc:o},m="wrapper";function c(e){let{components:n,...i}=e;return(0,r.kt)(m,(0,a.Z)({},s,i,{components:n,mdxType:"MDXLayout"}),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"https://nodei.co/npm/@genzy/client/"},(0,r.kt)("img",{parentName:"a",src:"https://nodei.co/npm/@genzy/client.png",alt:"NPM"})),"\n",(0,r.kt)("a",{parentName:"p",href:"https://nodei.co/npm/@genzy/api/"},(0,r.kt)("img",{parentName:"a",src:"https://nodei.co/npm/@genzy/api.png",alt:"NPM"})),"\n",(0,r.kt)("a",{parentName:"p",href:"https://nodei.co/npm/@genzy/cli/"},(0,r.kt)("img",{parentName:"a",src:"https://nodei.co/npm/@genzy/cli.png",alt:"NPM"}))),(0,r.kt)("h2",{id:"setting-up-the-server"},"Setting up the server"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"Initialize the project")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"npm init -y\n")),(0,r.kt)("ol",{start:2},(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("a",{parentName:"li",href:"/docs/docs/v1/server-installation/"},"Install")," ",(0,r.kt)("inlineCode",{parentName:"li"},"@genzy/api")," library")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"npm i -S @genzy/api\n")),(0,r.kt)("ol",{start:3},(0,r.kt)("li",{parentName:"ol"},"Implement Example ",(0,r.kt)("a",{parentName:"li",href:"/docs/docs/v1/service-class/"},"service"))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},'// example.ts\nimport {\n  Controller,\n  Get,\n  Post,\n  Put,\n  Delete,\n  Query,\n  Path,\n  Body,\n  string,\n  number,\n  boolean,\n  type,\n  Returns,\n  ReturnsArrayOf,\n} from "@genzy/api";\n\nclass Example {\n  @string() name: string;\n  @number age: number;\n}\n\n@Controller("/examples")\nexport class ExampleService {\n  @Get()\n  @ReturnsArrayOf(Example)\n  async getAll(\n    @Query("pageNumber") @number pageNumber: number,\n    @Query("pageSize") @number pageSize: number\n  ): Promise<Example[]> {\n    return [];\n  }\n  @Get("/:id")\n  @Returns(Example)\n  async getById(\n    @Query("includeDetails") @boolean includeDetails: boolean,\n    @Path("id") @string() id: string\n  ): Promise<Example> {\n    return;\n  }\n  @Post()\n  @Returns(Example)\n  async add(@Body() @type(Example) example: Example): Promise<Example> {\n    return example;\n  }\n  @Put("/:id")\n  @Returns(Example)\n  async update(\n    @Path("id") @string() id: string,\n    @Body() @type(Example) example: Example\n  ): Promise<Example> {\n    return example;\n  }\n  @Delete("/:id")\n  @Returns(Example)\n  async delete(@Path("id") @string() id: string): Promise<Example> {\n    return;\n  }\n}\n')),(0,r.kt)("ol",{start:4},(0,r.kt)("li",{parentName:"ol"},"Create a ",(0,r.kt)("a",{parentName:"li",href:"/docs/docs/v1/genzy-container/"},"GenzyContainer")," of services and the ",(0,r.kt)("a",{parentName:"li",href:"/docs/docs/v1/genzy-api/"},"GenzyApi"))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},'// index.ts\nimport { GenzyContainer, GenzyApi } from "@genzy/api";\nimport { ExampleService } from "./example";\n\nconst container = new GenzyContainer().ofLocal(ExampleService);\n\nconst api = new GenzyApi({\n  genzyInfo: {\n    name: "Example Microservice",\n    version: "1.0.0",\n    description: "This is an example microservice.",\n  },\n}).from(container);\n\nconst PORT = 3000;\napi.listen(PORT, () => console.log(`Started listening on ${PORT}`));\n\ntype GenzyContainerServices = {\n  exampleService: ExampleService;\n};\n\n// The instances are available for custom usage\nconst { exampleService } = usersGenzyContainer.services();\n')),(0,r.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"5 routes have been registered")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("ul",{parentName:"div"},(0,r.kt)("li",{parentName:"ul"},"GET /api/examples"),(0,r.kt)("li",{parentName:"ul"},"GET /api/examples/{id}"),(0,r.kt)("li",{parentName:"ul"},"POST /api/examples"),(0,r.kt)("li",{parentName:"ul"},"PUT /api/examples/{id}"),(0,r.kt)("li",{parentName:"ul"},"DELETE /api/examples/{id}\n:::")),(0,r.kt)("p",{parentName:"div"},(0,r.kt)("img",{alt:"img",src:t(4357).Z,width:"1435",height:"691"})),(0,r.kt)("h2",{parentName:"div",id:"setting-up-the-client"},"Setting up the client"),(0,r.kt)("ol",{parentName:"div"},(0,r.kt)("li",{parentName:"ol"},"Initialize the project")),(0,r.kt)("pre",{parentName:"div"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"npm init -y\n")),(0,r.kt)("ol",{parentName:"div",start:2},(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("a",{parentName:"li",href:"/docs/docs/v1/client-installation/"},"Install")," ",(0,r.kt)("inlineCode",{parentName:"li"},"@genzy/client")," library")),(0,r.kt)("pre",{parentName:"div"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"npm i -S @genzy/client\n")),(0,r.kt)("ol",{parentName:"div",start:3},(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("a",{parentName:"li",href:"/docs/docs/v1/cli-installation/"},"Install")," ",(0,r.kt)("inlineCode",{parentName:"li"},"@genzy/cli")," CLI")),(0,r.kt)("pre",{parentName:"div"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"npm i -g @genzy/cli\n")),(0,r.kt)("ol",{parentName:"div",start:4},(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("a",{parentName:"li",href:"/docs/docs/v1/cli-usage/#typescript"},"Generate")," TypeScript client code")),(0,r.kt)("pre",{parentName:"div"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"genzy -l ts -h http://localhost:3000 -o ./services/example\n")))),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"services/example/index.ts"),(0,r.kt)("li",{parentName:"ul"},"services/example/ExampleService.ts\n:::")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},'// services/example/index.ts\n\n// Auto-generated by Genzy Client CLI\nimport { GenzyContainer } from "@genzy/client";\nimport { ExampleService as ExampleServiceLocal } from "./ExampleService";\n\nconst host = "http://localhost:3000";\n\nexport type GenzyContainerServices = {\n  exampleService: ExampleServiceLocal;\n};\n\nexport const { exampleService }: GenzyContainerServices = new GenzyContainer()\n  .ofRemote(ExampleServiceLocal, host)\n  .services();\n')),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},'// services/example/ExampleService.ts\n\n// Auto-generated by Genzy Client CLI\nimport {\n  Controller,\n  Get,\n  Post,\n  Put,\n  Delete,\n  Query,\n  Path,\n  Body,\n} from "@genzy/client";\n\nexport class Example {\n  name: string;\n  age: number;\n}\n\n@Controller("/examples")\nexport class ExampleService {\n  @Get("/")\n  async getAll(\n    @Query("pageNumber") pageNumber: number,\n    @Query("pageSize") pageSize: number\n  ) {}\n\n  @Get("/:id")\n  async getById(\n    @Query("includeDetails") includeDetails: string,\n    @Path("id") id: boolean\n  ) {}\n\n  @Post("/")\n  async add(@Body() body: Example) {}\n\n  @Put("/:id")\n  async update(@Path("id") id: string, @Body() body: Example) {}\n\n  @Delete("/:id")\n  async delete(@Path("id") id: string) {}\n}\n')),(0,r.kt)("ol",{start:5},(0,r.kt)("li",{parentName:"ol"},"Use the ExampleService elsewhere")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},'// somewhere.ts\n\nimport { exampleService } from "./services/example";\n\nexampleService.getAll().then(console.log).catch(console.log);\n')))}c.isMDXComponent=!0},4357:(e,n,t)=>{t.d(n,{Z:()=>a});const a=t.p+"assets/images/example_swagger-73bff255d4b029c2144aef5f96bc61e0.png"}}]);