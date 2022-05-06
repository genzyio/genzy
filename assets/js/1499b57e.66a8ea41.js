"use strict";(self.webpackChunknimbly=self.webpackChunknimbly||[]).push([[1861],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return u}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},s=Object.keys(e);for(r=0;r<s.length;r++)n=s[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(r=0;r<s.length;r++)n=s[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),c=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},p=function(e){var t=c(e.components);return r.createElement(l.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,s=e.originalType,l=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),d=c(n),u=a,v=d["".concat(l,".").concat(u)]||d[u]||m[u]||s;return n?r.createElement(v,o(o({ref:t},p),{},{components:n})):r.createElement(v,o({ref:t},p))}));function u(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var s=n.length,o=new Array(s);o[0]=d;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i.mdxType="string"==typeof e?e:a,o[1]=i;for(var c=2;c<s;c++)o[c]=n[c];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},1067:function(e,t,n){n.r(t),n.d(t,{contentTitle:function(){return l},default:function(){return d},frontMatter:function(){return i},metadata:function(){return c},toc:function(){return p}});var r=n(7462),a=n(3366),s=(n(7294),n(3905)),o=["components"],i={title:"Listening to events",sidebar_position:2,slug:"/listening-to-events/"},l=void 0,c={unversionedId:"categories/Interceptors/listening-to-events",id:"categories/Interceptors/listening-to-events",title:"Listening to events",description:"There are several ways to handle events that are transmitted between the server and the client.",source:"@site/docs/categories/04-Interceptors/listening-to-events.md",sourceDirName:"categories/04-Interceptors",slug:"/listening-to-events/",permalink:"/nimbly/docs/v1/listening-to-events/",tags:[],version:"current",sidebarPosition:2,frontMatter:{title:"Listening to events",sidebar_position:2,slug:"/listening-to-events/"},sidebar:"sidebar",previous:{title:"Emitting events",permalink:"/nimbly/docs/v1/emitting-events/"},next:{title:"Broadcasting events",permalink:"/nimbly/docs/v1/broadcasting-events/"}},p=[{value:"EventEmitter methods",id:"eventemitter-methods",children:[{value:"socket.on(eventName, listener)",id:"socketoneventname-listener",children:[],level:3},{value:"socket.once(eventName, listener)",id:"socketonceeventname-listener",children:[],level:3},{value:"socket.off(eventName, listener)",id:"socketoffeventname-listener",children:[],level:3},{value:"socket.removeAllListeners(eventName)",id:"socketremovealllistenerseventname",children:[],level:3}],level:2},{value:"Catch-all listeners",id:"catch-all-listeners",children:[{value:"socket.onAny(listener)",id:"socketonanylistener",children:[],level:3},{value:"socket.prependAny(listener)",id:"socketprependanylistener",children:[],level:3},{value:"socket.offAny(listener)",id:"socketoffanylistener",children:[],level:3}],level:2},{value:"Validation",id:"validation",children:[],level:2},{value:"Error handling",id:"error-handling",children:[],level:2}],m={toc:p};function d(e){var t=e.components,n=(0,a.Z)(e,o);return(0,s.kt)("wrapper",(0,r.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,s.kt)("p",null,"There are several ways to handle events that are transmitted between the server and the client."),(0,s.kt)("h2",{id:"eventemitter-methods"},"EventEmitter methods"),(0,s.kt)("p",null,"On the server-side, the Socket instance extends the Node.js ",(0,s.kt)("a",{parentName:"p",href:"https://nodejs.org/docs/latest/api/events.html#events_events"},"EventEmitter")," class."),(0,s.kt)("p",null,"On the client-side, the Socket instance uses the event emitter provided by the ",(0,s.kt)("a",{parentName:"p",href:"https://github.com/component/emitter"},"component-emitter")," library, which exposes a subset of the EventEmitter methods."),(0,s.kt)("h3",{id:"socketoneventname-listener"},"socket.on(eventName, listener)"),(0,s.kt)("p",null,"Adds the ",(0,s.kt)("em",{parentName:"p"},"listener")," function to the end of the listeners array for the event named ",(0,s.kt)("em",{parentName:"p"},"eventName"),"."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},'socket.on("details", (...args) => {\n  // ...\n});\n')),(0,s.kt)("h3",{id:"socketonceeventname-listener"},"socket.once(eventName, listener)"),(0,s.kt)("p",null,"Adds a ",(0,s.kt)("strong",{parentName:"p"},"one-time")," ",(0,s.kt)("em",{parentName:"p"},"listener")," function for the event named ",(0,s.kt)("em",{parentName:"p"},"eventName")),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},'socket.once("details", (...args) => {\n  // ...\n});\n')),(0,s.kt)("h3",{id:"socketoffeventname-listener"},"socket.off(eventName, listener)"),(0,s.kt)("p",null,"Removes the specified ",(0,s.kt)("em",{parentName:"p"},"listener")," from the listener array for the event named ",(0,s.kt)("em",{parentName:"p"},"eventName"),"."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},'const listener = (...args) => {\n  console.log(args);\n}\n\nsocket.on("details", listener);\n\n// and then later...\nsocket.off("details", listener);\n')),(0,s.kt)("h3",{id:"socketremovealllistenerseventname"},"socket.removeAllListeners(","[eventName]",")"),(0,s.kt)("p",null,"Removes all listeners, or those of the specified ",(0,s.kt)("em",{parentName:"p"},"eventName"),"."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},'// for a specific event\nsocket.removeAllListeners("details");\n// for all events\nsocket.removeAllListeners();\n')),(0,s.kt)("h2",{id:"catch-all-listeners"},"Catch-all listeners"),(0,s.kt)("p",null,"Since Socket.IO v3, a new API inspired from the ",(0,s.kt)("a",{parentName:"p",href:"https://github.com/EventEmitter2/EventEmitter2"},"EventEmitter2")," library allows to declare catch-all listeners."),(0,s.kt)("p",null,"This feature is available on both the client and the server."),(0,s.kt)("h3",{id:"socketonanylistener"},"socket.onAny(listener)"),(0,s.kt)("p",null,"Adds a listener that will be fired when any event is emitted."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},"socket.onAny((eventName, ...args) => {\n  // ...\n});\n")),(0,s.kt)("h3",{id:"socketprependanylistener"},"socket.prependAny(listener)"),(0,s.kt)("p",null,"Adds a listener that will be fired when any event is emitted. The listener is added to the beginning of the listeners array."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},"socket.prependAny((eventName, ...args) => {\n  // ...\n});\n")),(0,s.kt)("h3",{id:"socketoffanylistener"},"socket.offAny(","[listener]",")"),(0,s.kt)("p",null,"Removes all catch-all listeners, or the given listener."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},"const listener = (eventName, ...args) => {\n  console.log(eventName, args);\n}\n\nsocket.onAny(listener);\n\n// and then later...\nsocket.offAny(listener);\n\n// or all listeners\nsocket.offAny();\n")),(0,s.kt)("h2",{id:"validation"},"Validation"),(0,s.kt)("p",null,"The validation of the event arguments is out of the scope of the Socket.IO library."),(0,s.kt)("p",null,"There are many packages in the JS ecosystem which cover this use case, among them:"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"https://www.npmjs.com/package/joi"},"joi")),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"https://www.npmjs.com/package/ajv"},"ajv")),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"https://www.npmjs.com/package/validatorjs"},"validatorjs"))),(0,s.kt)("p",null,"Example with ",(0,s.kt)("a",{parentName:"p",href:"https://joi.dev/api/"},"joi")," and ",(0,s.kt)("a",{parentName:"p",href:"/nimbly/docs/v1/emitting-events/#acknowledgements"},"acknowledgements"),":"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},'const Joi = require("joi");\n\nconst userSchema = Joi.object({\n  username: Joi.string().max(30).required(),\n  email: Joi.string().email().required()\n});\n\nio.on("connection", (socket) => {\n  socket.on("create user", (payload, callback) => {\n    if (typeof callback !== "function") {\n      // not an acknowledgement\n      return socket.disconnect();\n    }\n    const { error, value } = userSchema.validate(payload);\n    if (error) {\n      return callback({\n        status: "KO",\n        error\n      });\n    }\n    // do something with the value, and then\n    callback({\n      status: "OK"\n    });\n  });\n\n});\n')),(0,s.kt)("h2",{id:"error-handling"},"Error handling"),(0,s.kt)("p",null,"There is currently no built-in error handling in the Socket.IO library, which means you must catch any error that could be thrown in a listener."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},'io.on("connection", (socket) => {\n  socket.on("list items", async (callback) => {\n    try {\n      const items = await findItems();\n      callback({\n        status: "OK",\n        items\n      });\n    } catch (e) {\n      callback({\n        status: "NOK"\n      });\n    }\n  });\n});\n')),(0,s.kt)("p",null,"On the server-side, using ",(0,s.kt)("inlineCode",{parentName:"p"},"EventEmitter.captureRejections = true")," (experimental, see ",(0,s.kt)("a",{parentName:"p",href:"https://nodejs.org/api/events.html#events_capture_rejections_of_promises"},"here"),") might be interesting too, depending on your use case."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},'require("events").captureRejections = true;\n\nio.on("connection", (socket) => {\n  socket.on("list products", async () => {\n    const products = await findProducts();\n    socket.emit("products", products);\n  });\n\n  socket[Symbol.for(\'nodejs.rejection\')] = (err) => {\n    socket.emit("error", err);\n  };\n});\n')))}d.isMDXComponent=!0}}]);