"use strict";(self.webpackChunknimbly=self.webpackChunknimbly||[]).push([[4834],{3905:function(e,n,t){t.d(n,{Zo:function(){return u},kt:function(){return f}});var r=t(7294);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function l(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function a(e,n){if(null==e)return{};var t,r,i=function(e,n){if(null==e)return{};var t,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(i[t]=e[t]);return i}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var s=r.createContext({}),c=function(e){var n=r.useContext(s),t=n;return e&&(t="function"==typeof e?e(n):l(l({},n),e)),t},u=function(e){var n=c(e.components);return r.createElement(s.Provider,{value:n},e.children)},p={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},d=r.forwardRef((function(e,n){var t=e.components,i=e.mdxType,o=e.originalType,s=e.parentName,u=a(e,["components","mdxType","originalType","parentName"]),d=c(t),f=i,m=d["".concat(s,".").concat(f)]||d[f]||p[f]||o;return t?r.createElement(m,l(l({ref:n},u),{},{components:t})):r.createElement(m,l({ref:n},u))}));function f(e,n){var t=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var o=t.length,l=new Array(o);l[0]=d;var a={};for(var s in n)hasOwnProperty.call(n,s)&&(a[s]=n[s]);a.originalType=e,a.mdxType="string"==typeof e?e:i,l[1]=a;for(var c=2;c<o;c++)l[c]=t[c];return r.createElement.apply(null,l)}return r.createElement.apply(null,t)}d.displayName="MDXCreateElement"},7263:function(e,n,t){t.r(n),t.d(n,{contentTitle:function(){return s},default:function(){return d},frontMatter:function(){return a},metadata:function(){return c},toc:function(){return u}});var r=t(7462),i=t(3366),o=(t(7294),t(3905)),l=["components"],a={title:"Usage with bundlers",sidebar_position:10,slug:"/server-with-bundlers/"},s=void 0,c={unversionedId:"categories/Server/server-with-bundlers",id:"categories/Server/server-with-bundlers",title:"Usage with bundlers",description:"While less common than frontend bundling, it is totally possible to create a bundle for the server.",source:"@site/docs/categories/02-Server/server-with-bundlers.md",sourceDirName:"categories/02-Server",slug:"/server-with-bundlers/",permalink:"/nimbly/docs/v1/server-with-bundlers/",tags:[],version:"current",sidebarPosition:10,frontMatter:{title:"Usage with bundlers",sidebar_position:10,slug:"/server-with-bundlers/"},sidebar:"sidebar",previous:{title:"Application structure",permalink:"/nimbly/docs/v1/server-application-structure/"},next:{title:"Installation",permalink:"/nimbly/docs/v1/client-installation/"}},u=[{value:"Webpack 5",id:"webpack-5",children:[{value:"Without serving the client files",id:"without-serving-the-client-files",children:[],level:3},{value:"Including serving the client files",id:"including-serving-the-client-files",children:[],level:3}],level:2}],p={toc:u};function d(e){var n=e.components,t=(0,i.Z)(e,l);return(0,o.kt)("wrapper",(0,r.Z)({},p,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"While less common than frontend bundling, it is totally possible to create a bundle for the server."),(0,o.kt)("h2",{id:"webpack-5"},"Webpack 5"),(0,o.kt)("h3",{id:"without-serving-the-client-files"},"Without serving the client files"),(0,o.kt)("p",null,"Installation:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"npm install -D webpack webpack-cli socket.io bufferutil utf-8-validate\n")),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"index.js")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'const { Server } = require("socket.io");\n\nconst io = new Server({\n  serveClient: false\n});\n\nio.on("connection", socket => {\n  console.log(`connect ${socket.id}`);\n\n  socket.on("disconnect", (reason) => {\n    console.log(`disconnect ${socket.id} due to ${reason}`);\n  });\n});\n\nio.listen(3000);\n')),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"webpack.config.js")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'const path = require("path");\n\nmodule.exports = {\n  entry: "./index.js",\n  target: "node",\n  mode: "production",\n  output: {\n    path: path.resolve(__dirname, "dist"),\n    filename: "index.js",\n  }\n};\n')),(0,o.kt)("p",null,"Note: ",(0,o.kt)("inlineCode",{parentName:"p"},"bufferutil")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"utf-8-validate")," are two optional dependencies from the ",(0,o.kt)("inlineCode",{parentName:"p"},"ws"),' package. You can also set them as "external" with:'),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'const path = require("path");\n\nmodule.exports = {\n  entry: "./index.js",\n  target: "node",\n  mode: "production",\n  output: {\n    path: path.resolve(__dirname, "dist"),\n    filename: "index.js",\n  },\n  externals: {\n    bufferutil: "bufferutil",\n    "utf-8-validate": "utf-8-validate",\n  },\n};\n')),(0,o.kt)("p",null,"Documentation: ",(0,o.kt)("a",{parentName:"p",href:"https://webpack.js.org/configuration/externals/"},"https://webpack.js.org/configuration/externals/")),(0,o.kt)("h3",{id:"including-serving-the-client-files"},"Including serving the client files"),(0,o.kt)("p",null,"In that case, we'll have to use ",(0,o.kt)("a",{parentName:"p",href:"https://webpack.js.org/guides/asset-modules/"},"Asset modules")," and override the ",(0,o.kt)("inlineCode",{parentName:"p"},"sendFile")," function of the Socket.IO server:"),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"index.js")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'const { Server } = require("socket.io");\n\nconst clientFile = require("./node_modules/socket.io/client-dist/socket.io.min?raw");\nconst clientMap = require("./node_modules/socket.io/client-dist/socket.io.min.js.map?raw");\n\nServer.sendFile = (filename, req, res) => {\n  res.end(filename.endsWith(".map") ? clientMap : clientFile);\n};\n\nconst io = new Server();\n\nio.on("connection", socket => {\n  console.log(`connect ${socket.id}`);\n\n  socket.on("disconnect", (reason) => {\n    console.log(`disconnect ${socket.id} due to ${reason}`);\n  });\n});\n\nio.listen(3000);\n')),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"webpack.config.js")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'const path = require("path");\n\nmodule.exports = {\n  entry: "./index.js",\n  target: "node",\n  mode: "production",\n  output: {\n    path: path.resolve(__dirname, "dist"),\n    filename: "index.js",\n  },\n  module: {\n    rules: [\n      {\n        resourceQuery: /raw/,\n        type: "asset/source",\n      },\n    ],\n  },\n};\n')))}d.isMDXComponent=!0}}]);