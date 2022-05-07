"use strict";(self.webpackChunknimbly=self.webpackChunknimbly||[]).push([[433],{3905:function(e,t,r){r.d(t,{Zo:function(){return p},kt:function(){return m}});var n=r(7294);function i(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function c(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function s(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?c(Object(r),!0).forEach((function(t){i(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):c(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function o(e,t){if(null==e)return{};var r,n,i=function(e,t){if(null==e)return{};var r,n,i={},c=Object.keys(e);for(n=0;n<c.length;n++)r=c[n],t.indexOf(r)>=0||(i[r]=e[r]);return i}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(n=0;n<c.length;n++)r=c[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}var a=n.createContext({}),l=function(e){var t=n.useContext(a),r=t;return e&&(r="function"==typeof e?e(t):s(s({},t),e)),r},p=function(e){var t=l(e.components);return n.createElement(a.Provider,{value:t},e.children)},f={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var r=e.components,i=e.mdxType,c=e.originalType,a=e.parentName,p=o(e,["components","mdxType","originalType","parentName"]),u=l(r),m=i,d=u["".concat(a,".").concat(m)]||u[m]||f[m]||c;return r?n.createElement(d,s(s({ref:t},p),{},{components:r})):n.createElement(d,s({ref:t},p))}));function m(e,t){var r=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var c=r.length,s=new Array(c);s[0]=u;var o={};for(var a in t)hasOwnProperty.call(t,a)&&(o[a]=t[a]);o.originalType=e,o.mdxType="string"==typeof e?e:i,s[1]=o;for(var l=2;l<c;l++)s[l]=r[l];return n.createElement.apply(null,s)}return n.createElement.apply(null,r)}u.displayName="MDXCreateElement"},7522:function(e,t,r){r.r(t),r.d(t,{contentTitle:function(){return a},default:function(){return u},frontMatter:function(){return o},metadata:function(){return l},toc:function(){return p}});var n=r(7462),i=r(3366),c=(r(7294),r(3905)),s=["components"],o={title:"API Interceptors",sidebar_position:3,slug:"/api-interceptors/"},a=void 0,l={unversionedId:"categories/Interceptors/api",id:"categories/Interceptors/api",title:"API Interceptors",description:"Here is the list of API interceptor definition examples.",source:"@site/docs/categories/04-Interceptors/api.md",sourceDirName:"categories/04-Interceptors",slug:"/api-interceptors/",permalink:"/nimbly/docs/v1/api-interceptors/",tags:[],version:"current",lastUpdatedAt:1651955421,formattedLastUpdatedAt:"5/7/2022",sidebarPosition:3,frontMatter:{title:"API Interceptors",sidebar_position:3,slug:"/api-interceptors/"},sidebar:"sidebar",previous:{title:"Initialization",permalink:"/nimbly/docs/v1/client-initialization/"},next:{title:"Client Interceptors",permalink:"/nimbly/docs/v1/client-interceptors/"}},p=[{value:"Intercept All Before",id:"intercept-all-before",children:[],level:3},{value:"Intercept Specific Before",id:"intercept-specific-before",children:[],level:3},{value:"Intercept Specific Before - Interceptor Class",id:"intercept-specific-before---interceptor-class",children:[],level:3},{value:"Intercept All After",id:"intercept-all-after",children:[],level:3},{value:"Intercept Specific After",id:"intercept-specific-after",children:[],level:3},{value:"Intercept Specific After - Interceptor Class",id:"intercept-specific-after---interceptor-class",children:[],level:3}],f={toc:p};function u(e){var t=e.components,r=(0,i.Z)(e,s);return(0,c.kt)("wrapper",(0,n.Z)({},f,r,{components:t,mdxType:"MDXLayout"}),(0,c.kt)("p",null,"Here is the list of API interceptor definition examples."),(0,c.kt)("h3",{id:"intercept-all-before"},"Intercept All Before"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-js"},"// Intercept all service handlers before they are called\nconst usersNimble = new Nimble().ofLocal(UserService);\nconst app = new NimblyApi()\n  .interceptAll((req: Request, res: Response, next: NextFunction) => {\n    if(isTokenValid(req.headers.Authorization)) next();\n    else res.sendStatus(401);\n  })\n  .from(usersNimble);\n")),(0,c.kt)("h3",{id:"intercept-specific-before"},"Intercept Specific Before"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-js"},"// Intercept specific service handlers before they are called\nconst usersNimble = new Nimble().ofLocal(UserService);\nconst app = new NimblyApi()\n  .intercept({\n    userService: {\n      createUser: (req: Request, res: Response, next: NextFunction) => {\n        if(isAdminUser(req.headers.Authorization)) next();\n        else res.sendStatus(401);\n      }\n    }\n  })\n  .from(usersNimble);\n")),(0,c.kt)("h3",{id:"intercept-specific-before---interceptor-class"},"Intercept Specific Before - Interceptor Class"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-js"},"// Intercept specific service handlers before they are called with Interceptor class\nclass UserServiceInterceptor {\n  createUser(req: Request, res: Response, next: NextFunction) {\n    if(isAdminUser(req.headers.Authorization)) next();\n    else res.sendStatus(401);\n  }\n}\nconst usersNimble = new Nimble().ofLocal(UserService);\nconst app = new NimblyApi()\n  .intercept({\n    userService: {\n      createUser: UserServiceInterceptor\n    }\n  })\n  .from(usersNimble);\n")),(0,c.kt)("h3",{id:"intercept-all-after"},"Intercept All After"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-js"},'// Intercept all service handlers after they are called\nconst usersNimble = new Nimble().ofLocal(UserService);\nconst app = new NimblyApi()\n  .interceptAllAfter((req: Request, res: Response, next: NextFunction) => {\n    res.body({ message: "Hello from Nimbly." });\n  })\n  .from(usersNimble);\n')),(0,c.kt)("h3",{id:"intercept-specific-after"},"Intercept Specific After"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-js"},"// Intercept specific service handlers after they are called\nconst usersNimble = new Nimble().ofLocal(UserService);\nconst app = new NimblyApi()\n  .interceptAfter({\n    userService: {\n      createUser: (req: Request, res: Response, next: NextFunction) => {\n        res.status(201);\n        next();\n      }\n    }\n  })\n  .from(usersNimble);\n")),(0,c.kt)("h3",{id:"intercept-specific-after---interceptor-class"},"Intercept Specific After - Interceptor Class"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-js"},"// Intercept specific service handlers after they are called with Interceptor class\nclass UserServiceInterceptor {\n  createUser(req: Request, res: Response, next: NextFunction) {\n    res.status(201);\n    next();\n  }\n}\nconst usersNimble = new Nimble().ofLocal(UserService);\nconst app = new NimblyApi()\n  .interceptAfter({\n    userService: {\n      createUser: UserServiceInterceptor\n    }\n  })\n  .from(usersNimble);\n")))}u.isMDXComponent=!0}}]);