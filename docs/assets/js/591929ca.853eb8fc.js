"use strict";(self.webpackChunk_genzy_io_docs=self.webpackChunk_genzy_io_docs||[]).push([[433],{3905:(e,t,n)=>{n.d(t,{Zo:()=>l,kt:()=>y});var r=n(7294);function c(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){c(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function a(e,t){if(null==e)return{};var n,r,c=function(e,t){if(null==e)return{};var n,r,c={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(c[n]=e[n]);return c}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(c[n]=e[n])}return c}var o=r.createContext({}),p=function(e){var t=r.useContext(o),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},l=function(e){var t=p(e.components);return r.createElement(o.Provider,{value:t},e.children)},f="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,c=e.mdxType,i=e.originalType,o=e.parentName,l=a(e,["components","mdxType","originalType","parentName"]),f=p(n),d=c,y=f["".concat(o,".").concat(d)]||f[d]||u[d]||i;return n?r.createElement(y,s(s({ref:t},l),{},{components:n})):r.createElement(y,s({ref:t},l))}));function y(e,t){var n=arguments,c=t&&t.mdxType;if("string"==typeof e||c){var i=n.length,s=new Array(i);s[0]=d;var a={};for(var o in t)hasOwnProperty.call(t,o)&&(a[o]=t[o]);a.originalType=e,a[f]="string"==typeof e?e:c,s[1]=a;for(var p=2;p<i;p++)s[p]=n[p];return r.createElement.apply(null,s)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},7522:(e,t,n)=>{n.r(t),n.d(t,{contentTitle:()=>s,default:()=>f,frontMatter:()=>i,metadata:()=>a,toc:()=>o});var r=n(7462),c=(n(7294),n(3905));const i={title:"API Interceptors",sidebar_position:3,slug:"/api-interceptors/"},s=void 0,a={unversionedId:"categories/Interceptors/api",id:"categories/Interceptors/api",title:"API Interceptors",description:"Here is the list of API interceptor definition examples.",source:"@site/docs/categories/04-Interceptors/api.md",sourceDirName:"categories/04-Interceptors",slug:"/api-interceptors/",permalink:"/docs/v1/api-interceptors/",tags:[],version:"current",lastUpdatedAt:1697306351,formattedLastUpdatedAt:"10/14/2023",sidebarPosition:3,frontMatter:{title:"API Interceptors",sidebar_position:3,slug:"/api-interceptors/"},sidebar:"sidebar",previous:{title:"Initialization",permalink:"/docs/v1/client-initialization/"},next:{title:"Client Interceptors",permalink:"/docs/v1/client-interceptors/"}},o=[{value:"Intercept All Before",id:"intercept-all-before",children:[],level:3},{value:"Intercept Specific Before",id:"intercept-specific-before",children:[],level:3},{value:"Intercept Specific Before - Interceptor Class",id:"intercept-specific-before---interceptor-class",children:[],level:3},{value:"Intercept All After",id:"intercept-all-after",children:[],level:3},{value:"Intercept Specific After",id:"intercept-specific-after",children:[],level:3},{value:"Intercept Specific After - Interceptor Class",id:"intercept-specific-after---interceptor-class",children:[],level:3}],p={toc:o},l="wrapper";function f(e){let{components:t,...n}=e;return(0,c.kt)(l,(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,c.kt)("p",null,"Here is the list of API interceptor definition examples."),(0,c.kt)("h3",{id:"intercept-all-before"},"Intercept All Before"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-js"},"// Intercept all service handlers before they are called\nconst usersGenzyContainer = new GenzyContainer().ofLocal(UserService);\nconst app = new GenzyApi()\n  .interceptAll((req: Request, res: Response, next: NextFunction) => {\n    if(isTokenValid(req.headers.Authorization)) next();\n    else res.sendStatus(401);\n  })\n  .from(usersGenzyContainer);\n")),(0,c.kt)("h3",{id:"intercept-specific-before"},"Intercept Specific Before"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-js"},"// Intercept specific service handlers before they are called\nconst usersGenzyContainer = new GenzyContainer().ofLocal(UserService);\nconst app = new GenzyApi()\n  .intercept({\n    userService: {\n      createUser: (req: Request, res: Response, next: NextFunction) => {\n        if(isAdminUser(req.headers.Authorization)) next();\n        else res.sendStatus(401);\n      }\n    }\n  })\n  .from(usersGenzyContainer);\n")),(0,c.kt)("h3",{id:"intercept-specific-before---interceptor-class"},"Intercept Specific Before - Interceptor Class"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-js"},"// Intercept specific service handlers before they are called with Interceptor class\nclass UserServiceInterceptor {\n  createUser(req: Request, res: Response, next: NextFunction) {\n    if(isAdminUser(req.headers.Authorization)) next();\n    else res.sendStatus(401);\n  }\n}\nconst usersGenzyContainer = new GenzyContainer().ofLocal(UserService);\nconst app = new GenzyApi()\n  .intercept({\n    userService: {\n      createUser: UserServiceInterceptor\n    }\n  })\n  .from(usersGenzyContainer);\n")),(0,c.kt)("h3",{id:"intercept-all-after"},"Intercept All After"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-js"},'// Intercept all service handlers after they are called\nconst usersGenzyContainer = new GenzyContainer().ofLocal(UserService);\nconst app = new GenzyApi()\n  .interceptAllAfter((req: Request, res: Response, next: NextFunction) => {\n    res.body({ message: "Hello from Genzy." });\n  })\n  .from(usersGenzyContainer);\n')),(0,c.kt)("h3",{id:"intercept-specific-after"},"Intercept Specific After"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-js"},"// Intercept specific service handlers after they are called\nconst usersGenzyContainer = new GenzyContainer().ofLocal(UserService);\nconst app = new GenzyApi()\n  .interceptAfter({\n    userService: {\n      createUser: (req: Request, res: Response, next: NextFunction) => {\n        res.status(201);\n        next();\n      }\n    }\n  })\n  .from(usersGenzyContainer);\n")),(0,c.kt)("h3",{id:"intercept-specific-after---interceptor-class"},"Intercept Specific After - Interceptor Class"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-js"},"// Intercept specific service handlers after they are called with Interceptor class\nclass UserServiceInterceptor {\n  createUser(req: Request, res: Response, next: NextFunction) {\n    res.status(201);\n    next();\n  }\n}\nconst usersGenzyContainer = new GenzyContainer().ofLocal(UserService);\nconst app = new GenzyApi()\n  .interceptAfter({\n    userService: {\n      createUser: UserServiceInterceptor\n    }\n  })\n  .from(usersGenzyContainer);\n")))}f.isMDXComponent=!0}}]);