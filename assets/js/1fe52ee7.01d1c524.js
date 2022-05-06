"use strict";(self.webpackChunknimbly=self.webpackChunknimbly||[]).push([[2005],{3905:function(e,n,t){t.d(n,{Zo:function(){return d},kt:function(){return m}});var o=t(7294);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);n&&(o=o.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,o)}return t}function c(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function r(e,n){if(null==e)return{};var t,o,a=function(e,n){if(null==e)return{};var t,o,a={},i=Object.keys(e);for(o=0;o<i.length;o++)t=i[o],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(o=0;o<i.length;o++)t=i[o],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var l=o.createContext({}),s=function(e){var n=o.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):c(c({},n),e)),t},d=function(e){var n=s(e.components);return o.createElement(l.Provider,{value:n},e.children)},p={inlineCode:"code",wrapper:function(e){var n=e.children;return o.createElement(o.Fragment,{},n)}},k=o.forwardRef((function(e,n){var t=e.components,a=e.mdxType,i=e.originalType,l=e.parentName,d=r(e,["components","mdxType","originalType","parentName"]),k=s(t),m=a,u=k["".concat(l,".").concat(m)]||k[m]||p[m]||i;return t?o.createElement(u,c(c({ref:n},d),{},{components:t})):o.createElement(u,c({ref:n},d))}));function m(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var i=t.length,c=new Array(i);c[0]=k;var r={};for(var l in n)hasOwnProperty.call(n,l)&&(r[l]=n[l]);r.originalType=e,r.mdxType="string"==typeof e?e:a,c[1]=r;for(var s=2;s<i;s++)c[s]=t[s];return o.createElement.apply(null,c)}return o.createElement.apply(null,t)}k.displayName="MDXCreateElement"},7497:function(e,n,t){t.r(n),t.d(n,{contentTitle:function(){return d},default:function(){return u},frontMatter:function(){return s},metadata:function(){return p},toc:function(){return k}});var o=t(7462),a=t(3366),i=(t(7294),t(3905)),c=t(9750),r=t(4996),l=["components"],s={title:"The Socket instance (client-side)",sidebar_label:"The Socket instance",sidebar_position:3,slug:"/client-socket-instance/"},d=void 0,p={unversionedId:"categories/Client/client-socket-instance",id:"categories/Client/client-socket-instance",title:"The Socket instance (client-side)",description:"A Socket is the fundamental class for interacting with the server. It inherits most of the methods of the Node.js EventEmitter, like emit, on, once or off.",source:"@site/docs/categories/03-Client/client-socket-instance.md",sourceDirName:"categories/03-Client",slug:"/client-socket-instance/",permalink:"/nimbly/docs/v1/client-socket-instance/",tags:[],version:"current",sidebarPosition:3,frontMatter:{title:"The Socket instance (client-side)",sidebar_label:"The Socket instance",sidebar_position:3,slug:"/client-socket-instance/"},sidebar:"sidebar",previous:{title:"Initialization",permalink:"/nimbly/docs/v1/client-initialization/"},next:{title:"Offline behavior",permalink:"/nimbly/docs/v1/client-offline-behavior/"}},k=[{value:"Socket#id",id:"socketid",children:[],level:2},{value:"Socket#connected",id:"socketconnected",children:[],level:2},{value:"Socket#io",id:"socketio",children:[],level:2},{value:"Lifecycle",id:"lifecycle",children:[],level:2},{value:"Events",id:"events",children:[{value:"<code>connect</code>",id:"connect",children:[],level:3},{value:"<code>connect_error</code>",id:"connect_error",children:[],level:3},{value:"<code>disconnect</code>",id:"disconnect",children:[],level:3}],level:2},{value:"Complete API",id:"complete-api",children:[],level:2}],m={toc:k};function u(e){var n=e.components,t=(0,a.Z)(e,l);return(0,i.kt)("wrapper",(0,o.Z)({},m,t,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"A ",(0,i.kt)("inlineCode",{parentName:"p"},"Socket")," is the fundamental class for interacting with the server. It inherits most of the methods of the Node.js ",(0,i.kt)("a",{parentName:"p",href:"https://nodejs.org/api/events.html#class-eventemitter"},"EventEmitter"),", like ",(0,i.kt)("a",{parentName:"p",href:"/nimbly/docs/v1/client-api/#socketemiteventname-args"},"emit"),", ",(0,i.kt)("a",{parentName:"p",href:"/nimbly/docs/v1/client-api/#socketoneventname-callback"},"on"),", ",(0,i.kt)("a",{parentName:"p",href:"/nimbly/docs/v1/client-api/#socketonceeventname-callback"},"once")," or ",(0,i.kt)("a",{parentName:"p",href:"/nimbly/docs/v1/client-api/#socketoffeventname"},"off"),"."),(0,i.kt)(c.Z,{alt:"Bidirectional communication between server and client",sources:{light:(0,r.Z)("/images/bidirectional-communication-socket.png"),dark:(0,r.Z)("/images/bidirectional-communication-socket-dark.png")},mdxType:"ThemedImage"}),(0,i.kt)("br",null),(0,i.kt)("br",null),(0,i.kt)("p",null,"Besides ",(0,i.kt)("a",{parentName:"p",href:"../04-Events/emitting-events.md"},"emitting")," and ",(0,i.kt)("a",{parentName:"p",href:"../04-Events/listening-to-events.md"},"listening to")," events, the Socket instance has a few attributes that may be of use in your application:"),(0,i.kt)("h2",{id:"socketid"},"Socket#id"),(0,i.kt)("p",null,"Each new connection is assigned a random 20-characters identifier."),(0,i.kt)("p",null,"This identifier is synced with the value on the server-side."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'// server-side\nio.on("connection", (socket) => {\n  console.log(socket.id); // x8WIv7-mJelg7on_ALbx\n});\n\n// client-side\nsocket.on("connect", () => {\n  console.log(socket.id); // x8WIv7-mJelg7on_ALbx\n});\n\nsocket.on("disconnect", () => {\n  console.log(socket.id); // undefined\n});\n')),(0,i.kt)("h2",{id:"socketconnected"},"Socket#connected"),(0,i.kt)("p",null,"This attribute describes whether the socket is currently connected to the server."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'socket.on("connect", () => {\n  console.log(socket.connected); // true\n});\n\nsocket.on("disconnect", () => {\n  console.log(socket.connected); // false\n});\n')),(0,i.kt)("h2",{id:"socketio"},"Socket#io"),(0,i.kt)("p",null,"A reference to the underlying ",(0,i.kt)("a",{parentName:"p",href:"/nimbly/docs/v1/client-api/#manager"},"Manager"),"."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'socket.on("connect", () => {\n  const engine = socket.io.engine;\n  console.log(engine.transport.name); // in most cases, prints "polling"\n\n  engine.once("upgrade", () => {\n    // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)\n    console.log(engine.transport.name); // in most cases, prints "websocket"\n  });\n\n  engine.on("packet", ({ type, data }) => {\n    // called for each packet received\n  });\n\n  engine.on("packetCreate", ({ type, data }) => {\n    // called for each packet sent\n  });\n\n  engine.on("drain", () => {\n    // called when the write buffer is drained\n  });\n\n  engine.on("close", (reason) => {\n    // called when the underlying connection is closed\n  });\n});\n')),(0,i.kt)("h2",{id:"lifecycle"},"Lifecycle"),(0,i.kt)("img",{src:"/images/client_socket_events.png",alt:"Lifecycle diagram"}),(0,i.kt)("h2",{id:"events"},"Events"),(0,i.kt)("p",null,"The Socket instance emits three special events:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#connect"},(0,i.kt)("inlineCode",{parentName:"a"},"connect"))),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#connect-error"},(0,i.kt)("inlineCode",{parentName:"a"},"connect_error"))),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#disconnect"},(0,i.kt)("inlineCode",{parentName:"a"},"disconnect")))),(0,i.kt)("p",null,"Please note that since Socket.IO v3, the Socket instance does not emit any event related to the reconnection logic anymore. You can listen to the events on the Manager instance directly:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'socket.io.on("reconnect_attempt", () => {\n  // ...\n});\n\nsocket.io.on("reconnect", () => {\n  // ...\n});\n')),(0,i.kt)("p",null,"More information can be found in the ",(0,i.kt)("a",{parentName:"p",href:"../07-Migrations/migrating-from-2-to-3.md#the-socket-instance-will-no-longer-forward-the-events-emitted-by-its-manager"},"migration guide"),"."),(0,i.kt)("h3",{id:"connect"},(0,i.kt)("inlineCode",{parentName:"h3"},"connect")),(0,i.kt)("p",null,"This event is fired by the Socket instance upon connection ",(0,i.kt)("strong",{parentName:"p"},"and")," reconnection."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'socket.on("connect", () => {\n  // ...\n});\n')),(0,i.kt)("p",null,"Please note that you shouldn't register event handlers in the ",(0,i.kt)("inlineCode",{parentName:"p"},"connect")," handler itself, as a new handler will be registered every time the Socket reconnects:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'// BAD\nsocket.on("connect", () => {\n  socket.on("data", () => { /* ... */ });\n});\n\n// GOOD\nsocket.on("connect", () => {\n  // ...\n});\n\nsocket.on("data", () => { /* ... */ });\n')),(0,i.kt)("h3",{id:"connect_error"},(0,i.kt)("inlineCode",{parentName:"h3"},"connect_error")),(0,i.kt)("p",null,"This event is fired when:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"the low-level connection cannot be established"),(0,i.kt)("li",{parentName:"ul"},"the connection is denied by the server in a ",(0,i.kt)("a",{parentName:"li",href:"/nimbly/docs/v1/middlewares/"},"middleware function"))),(0,i.kt)("p",null,"In the first case, the Socket will automatically try to reconnect, after a ",(0,i.kt)("a",{parentName:"p",href:"/nimbly/docs/v1/client-options/#reconnectiondelay"},"given delay"),"."),(0,i.kt)("p",null,"In the latter case, you need to manually reconnect. You might need to update the credentials:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'// either by directly modifying the `auth` attribute\nsocket.on("connect_error", () => {\n  socket.auth.token = "abcd";\n  socket.connect();\n});\n\n// or if the `auth` attribute is a function\nconst socket = io({\n  auth: (cb) => {\n    cb(localStorage.getItem("token"));\n  }\n});\n\nsocket.on("connect_error", () => {\n  setTimeout(() => {\n    socket.connect();\n  }, 1000);\n});\n')),(0,i.kt)("h3",{id:"disconnect"},(0,i.kt)("inlineCode",{parentName:"h3"},"disconnect")),(0,i.kt)("p",null,"This event is fired upon disconnection."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'socket.on("disconnect", (reason) => {\n  // ...\n});\n')),(0,i.kt)("p",null,"Here is the list of possible reasons:"),(0,i.kt)("table",null,(0,i.kt)("thead",{parentName:"table"},(0,i.kt)("tr",{parentName:"thead"},(0,i.kt)("th",{parentName:"tr",align:null},"Reason"),(0,i.kt)("th",{parentName:"tr",align:null},"Description"))),(0,i.kt)("tbody",{parentName:"table"},(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("inlineCode",{parentName:"td"},"io server disconnect")),(0,i.kt)("td",{parentName:"tr",align:null},"The server has forcefully disconnected the socket with ",(0,i.kt)("a",{parentName:"td",href:"/nimbly/docs/v1/server-api/#socketdisconnectclose"},"socket.disconnect()"))),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("inlineCode",{parentName:"td"},"io client disconnect")),(0,i.kt)("td",{parentName:"tr",align:null},"The socket was manually disconnected using ",(0,i.kt)("a",{parentName:"td",href:"/nimbly/docs/v1/client-api/#socketdisconnect"},"socket.disconnect()"))),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("inlineCode",{parentName:"td"},"ping timeout")),(0,i.kt)("td",{parentName:"tr",align:null},"The server did not send a PING within the ",(0,i.kt)("inlineCode",{parentName:"td"},"pingInterval + pingTimeout")," range")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("inlineCode",{parentName:"td"},"transport close")),(0,i.kt)("td",{parentName:"tr",align:null},"The connection was closed (example: the user has lost connection, or the network was changed from WiFi to 4G)")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("inlineCode",{parentName:"td"},"transport error")),(0,i.kt)("td",{parentName:"tr",align:null},"The connection has encountered an error (example: the server was killed during a HTTP long-polling cycle)")))),(0,i.kt)("p",null,"In the first two cases (explicit disconnection), the client will not try to reconnect and you need to manually call ",(0,i.kt)("inlineCode",{parentName:"p"},"socket.connect()"),"."),(0,i.kt)("p",null,"In all other cases, the client will wait for a small ",(0,i.kt)("a",{parentName:"p",href:"/nimbly/docs/v1/client-options/#reconnectiondelay"},"random delay")," and then try to reconnect:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'socket.on("disconnect", (reason) => {\n  if (reason === "io server disconnect") {\n    // the disconnection was initiated by the server, you need to reconnect manually\n    socket.connect();\n  }\n  // else the socket will automatically try to reconnect\n});\n')),(0,i.kt)("p",null,"Note: those events, along with ",(0,i.kt)("inlineCode",{parentName:"p"},"disconnecting"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"newListener")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"removeListener"),", are special events that shouldn't be used in your application:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'// BAD, will throw an error\nsocket.emit("disconnect");\n')),(0,i.kt)("h2",{id:"complete-api"},"Complete API"),(0,i.kt)("p",null,"The complete API exposed by the Socket instance can be found ",(0,i.kt)("a",{parentName:"p",href:"/nimbly/docs/v1/client-api/#socket"},"here"),"."))}u.isMDXComponent=!0}}]);