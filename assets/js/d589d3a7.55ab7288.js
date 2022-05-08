"use strict";(self.webpackChunknimbly=self.webpackChunknimbly||[]).push([[162],{3905:function(e,t,n){n.d(t,{Zo:function(){return m},kt:function(){return d}});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=a.createContext({}),o=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},m=function(e){var t=o(e.components);return a.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,s=e.parentName,m=l(e,["components","mdxType","originalType","parentName"]),u=o(n),d=r,v=u["".concat(s,".").concat(d)]||u[d]||p[d]||i;return n?a.createElement(v,c(c({ref:t},m),{},{components:n})):a.createElement(v,c({ref:t},m))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,c=new Array(i);c[0]=u;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:r,c[1]=l;for(var o=2;o<i;o++)c[o]=n[o];return a.createElement.apply(null,c)}return a.createElement.apply(null,n)}u.displayName="MDXCreateElement"},9390:function(e,t,n){n.r(t),n.d(t,{contentTitle:function(){return s},default:function(){return u},frontMatter:function(){return l},metadata:function(){return o},toc:function(){return m}});var a=n(7462),r=n(3366),i=(n(7294),n(3905)),c=["components"],l={title:"Getting Started",slug:"/getting-started/"},s=void 0,o={unversionedId:"getting-started",id:"getting-started",title:"Getting Started",description:"NPM",source:"@site/docs/getting-started.md",sourceDirName:".",slug:"/getting-started/",permalink:"/nimbly/docs/v1/getting-started/",tags:[],version:"current",lastUpdatedAt:1652029593,formattedLastUpdatedAt:"5/8/2022",frontMatter:{title:"Getting Started",slug:"/getting-started/"}},m=[{value:"Setting up the server",id:"setting-up-the-server",children:[],level:2},{value:"Setting up the client",id:"setting-up-the-client",children:[],level:2}],p={toc:m};function u(e){var t=e.components,n=(0,r.Z)(e,c);return(0,i.kt)("wrapper",(0,a.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://nodei.co/npm/nimbly-client/"},(0,i.kt)("img",{parentName:"a",src:"https://nodei.co/npm/nimbly-client.png",alt:"NPM"})),"\n",(0,i.kt)("a",{parentName:"p",href:"https://nodei.co/npm/nimbly-api/"},(0,i.kt)("img",{parentName:"a",src:"https://nodei.co/npm/nimbly-api.png",alt:"NPM"}))),(0,i.kt)("h2",{id:"setting-up-the-server"},"Setting up the server"),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},"Initialize the project")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"npm init -y\n")),(0,i.kt)("ol",{start:2},(0,i.kt)("li",{parentName:"ol"},"Install ",(0,i.kt)("inlineCode",{parentName:"li"},"nimbly-api")," library")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"npm i -S nimbly-api\n")),(0,i.kt)("ol",{start:3},(0,i.kt)("li",{parentName:"ol"},"Implement ",(0,i.kt)("a",{parentName:"li",href:"/nimbly/docs/v1/service-class/"},"services"))),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"class UserService {\n  async createUser(user) {\n    // logic for adding the user\n    return user;\n  }\n}\n\nclass AccountService {\n  // UserService is automatically injected\n  constructor({ userService }) {\n    this.userService = userService;\n  }\n\n  async getAllAccounts() {\n    return [];\n  }\n\n  // take accountInfo object as parameter \n  async createAccount({username, firstName, lastName, email}) {\n    // logic for adding the account\n    const newAccount = {id: 1, username};\n    // call another service\n    this.userService.createUser({\n      accountId: newAccount.id,\n      firstName,\n      lastName,\n      email\n    })\n    return newAccount;\n  }\n}\n")),(0,i.kt)("ol",{start:4},(0,i.kt)("li",{parentName:"ol"},"Create a ",(0,i.kt)("a",{parentName:"li",href:"/nimbly/docs/v1/nimble/"},"Nimble")," of services")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"import { Nimble } from 'nimbly-api';\n\nconst usersNimble = new Nimble()\n  .ofLocal(UserService)\n  .andLocal(AccountService);\n\n// The instances are available for custom usage\nconst { userService, accountService } = usersNimble.services();\n")),(0,i.kt)("ol",{start:5},(0,i.kt)("li",{parentName:"ol"},"Create the ",(0,i.kt)("a",{parentName:"li",href:"/nimbly/docs/v1/nimbly-api/"},"NimblyApi"))),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"import { NimblyApi } from 'nimbly-api';\n\nconst app = new NimblyApi().from(usersNimble);\n\napp.listen(3000);\n")),(0,i.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"3 routes have been registered")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("ul",{parentName:"div"},(0,i.kt)("li",{parentName:"ul"},"POST /api/user-service/create-user"),(0,i.kt)("li",{parentName:"ul"},"GET /api/account-service/get-all-accounts"),(0,i.kt)("li",{parentName:"ul"},"POST /api/account-service/create-account")))),(0,i.kt)("h2",{id:"setting-up-the-client"},"Setting up the client"),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},"Initialize the project")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"npm init -y\n")),(0,i.kt)("ol",{start:2},(0,i.kt)("li",{parentName:"ol"},"Install ",(0,i.kt)("inlineCode",{parentName:"li"},"nimbly-client")," library")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"npm i -S nimbly-client\n")),(0,i.kt)("ol",{start:3},(0,i.kt)("li",{parentName:"ol"},"Define ",(0,i.kt)("a",{parentName:"li",href:"/nimbly/docs/v1/service-class/"},"services"))),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"class UserService {\n  async createUser(user) {}\n}\n\nclass AccountService {\n  async getAllAccounts() {}\n  async createAccount(account) {}\n}\n")),(0,i.kt)("ol",{start:4},(0,i.kt)("li",{parentName:"ol"},"Create a ",(0,i.kt)("a",{parentName:"li",href:"/nimbly/docs/v1/nimble/"},"Nimble")," of remote services")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"import { Nimble } from 'nimbly-client';\n\nconst host = 'http://localhost:3000';\n\nconst usersNimble = new Nimble()\n  .ofRemote(UserService, host)\n  .andRemote(AccountService, host);\n\n// The instances are available for custom usage\nconst { userService, accountService } = usersNimble.services();\n\n// Use the services\naccountService.createAccount({\n  username: 'test',\n  email: 'test@test.com',\n  firstName: 'Test',\n  lastName: 'Test',\n})\n.then(newAccount => console.log(newAccount)) // created account from server\n.catch(error => console.log(error));\n\n// Fetch all accounts\nconst allAccounts = await accountService.getAllAccounts();\n")),(0,i.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"2 requests have been sent")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("ul",{parentName:"div"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"POST")," /api/account-service/create-account"),(0,i.kt)("li",{parentName:"ul"},"body: ",(0,i.kt)("inlineCode",{parentName:"li"},"{ username: 'test', email: 'test@test.com', firstName: 'Test', lastName: 'Test' }")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"GET")," /api/account-service/get-all-accounts")))))}u.isMDXComponent=!0}}]);