"use strict";(self.webpackChunknimbly=self.webpackChunknimbly||[]).push([[728],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return d}});var i=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,i)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,i,o=function(e,t){if(null==e)return{};var n,i,o={},r=Object.keys(e);for(i=0;i<r.length;i++)n=r[i],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(i=0;i<r.length;i++)n=r[i],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var s=i.createContext({}),c=function(e){var t=i.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},p=function(e){var t=c(e.components);return i.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return i.createElement(i.Fragment,{},t)}},h=i.forwardRef((function(e,t){var n=e.components,o=e.mdxType,r=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),h=c(n),d=o,k=h["".concat(s,".").concat(d)]||h[d]||u[d]||r;return n?i.createElement(k,a(a({ref:t},p),{},{components:n})):i.createElement(k,a({ref:t},p))}));function d(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var r=n.length,a=new Array(r);a[0]=h;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:o,a[1]=l;for(var c=2;c<r;c++)a[c]=n[c];return i.createElement.apply(null,a)}return i.createElement.apply(null,n)}h.displayName="MDXCreateElement"},3909:function(e,t,n){n.r(t),n.d(t,{contentTitle:function(){return s},default:function(){return h},frontMatter:function(){return l},metadata:function(){return c},toc:function(){return p}});var i=n(7462),o=n(3366),r=(n(7294),n(3905)),a=["components"],l={title:"How it works",sidebar_position:2,slug:"/how-it-works/"},s=void 0,c={unversionedId:"categories/Documentation/how-it-works",id:"categories/Documentation/how-it-works",title:"How it works",description:"The bidirectional channel between the Socket.IO server (Node.js) and the Socket.IO client (browser, Node.js, or another programming language) is established with a WebSocket connection whenever possible, and will use HTTP long-polling as fallback.",source:"@site/docs/categories/01-Documentation/how-it-works.md",sourceDirName:"categories/01-Documentation",slug:"/how-it-works/",permalink:"/nimbly/docs/v1/how-it-works/",tags:[],version:"current",sidebarPosition:2,frontMatter:{title:"How it works",sidebar_position:2,slug:"/how-it-works/"},sidebar:"sidebar",previous:{title:"Introduction",permalink:"/nimbly/docs/v1/"},next:{title:"Logging and debugging",permalink:"/nimbly/docs/v1/logging-and-debugging/"}},p=[{value:"Engine.IO",id:"engineio",children:[{value:"Transports",id:"transports",children:[{value:"HTTP long-polling",id:"http-long-polling",children:[],level:4},{value:"WebSocket",id:"websocket",children:[],level:4}],level:3},{value:"Handshake",id:"handshake",children:[],level:3},{value:"Upgrade mechanism",id:"upgrade-mechanism",children:[],level:3},{value:"Disconnection detection",id:"disconnection-detection",children:[],level:3}],level:2},{value:"Socket.IO",id:"socketio",children:[],level:2}],u={toc:p};function h(e){var t=e.components,l=(0,o.Z)(e,a);return(0,r.kt)("wrapper",(0,i.Z)({},u,l,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"The bidirectional channel between the Socket.IO server (Node.js) and the Socket.IO client (browser, Node.js, or ",(0,r.kt)("a",{parentName:"p",href:"/nimbly/docs/v1/#what-socketio-is"},"another programming language"),") is established with a ",(0,r.kt)("a",{parentName:"p",href:"https://developer.mozilla.org/en-US/docs/Web/API/WebSocket"},"WebSocket connection")," whenever possible, and will use HTTP long-polling as fallback."),(0,r.kt)("p",null,"The Socket.IO codebase is split into two distinct layers:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"the low-level plumbing: what we call Engine.IO, the engine inside Socket.IO"),(0,r.kt)("li",{parentName:"ul"},"the high-level API: Socket.IO itself")),(0,r.kt)("h2",{id:"engineio"},"Engine.IO"),(0,r.kt)("p",null,"Engine.IO is responsible for establishing the low-level connection between the server and the client. It handles:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"the various ",(0,r.kt)("a",{parentName:"li",href:"#transports"},"transports")," and the ",(0,r.kt)("a",{parentName:"li",href:"#upgrade-mechanism"},"upgrade mechanism")),(0,r.kt)("li",{parentName:"ul"},"the ",(0,r.kt)("a",{parentName:"li",href:"#disconnection-detection"},"disconnection detection"))),(0,r.kt)("p",null,"The source code can be found here:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"server: ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/socketio/engine.io"},"https://github.com/socketio/engine.io")),(0,r.kt)("li",{parentName:"ul"},"client: ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/socketio/engine.io-client"},"https://github.com/socketio/engine.io-client")),(0,r.kt)("li",{parentName:"ul"},"parser: ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/socketio/engine.io-parser"},"https://github.com/socketio/engine.io-parser")),(0,r.kt)("li",{parentName:"ul"},"protocol description: ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/socketio/engine.io-protocol"},"https://github.com/socketio/engine.io-protocol"))),(0,r.kt)("h3",{id:"transports"},"Transports"),(0,r.kt)("p",null,"There are currently two implemented transports:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#http-long-polling"},"HTTP long-polling")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#websocket"},"WebSocket"))),(0,r.kt)("h4",{id:"http-long-polling"},"HTTP long-polling"),(0,r.kt)("p",null,'The HTTP long-polling transport (also simply referred as "polling") consists of successive HTTP requests:'),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"long-running ",(0,r.kt)("inlineCode",{parentName:"li"},"GET")," requests, for receiving data from the server"),(0,r.kt)("li",{parentName:"ul"},"short-running ",(0,r.kt)("inlineCode",{parentName:"li"},"POST")," requests, for sending data to the server")),(0,r.kt)("p",null,"Due to the nature of the transport, successive emits may be concatenated and sent within the same HTTP request."),(0,r.kt)("h4",{id:"websocket"},"WebSocket"),(0,r.kt)("p",null,"The WebSocket transport consists, well, of a ",(0,r.kt)("a",{parentName:"p",href:"https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API"},"WebSocket connection"),", which provides a bidirectional and low-latency communication channel between the server and the client."),(0,r.kt)("p",null,"Due to the nature of the transport, each emit is sent in its own WebSocket frame (some emits may even result in two distinct WebSocket frames, more information ",(0,r.kt)("a",{parentName:"p",href:"../06-Advanced/custom-parser.md#the-default-parser"},"here"),")."),(0,r.kt)("h3",{id:"handshake"},"Handshake"),(0,r.kt)("p",null,"At the beginning of the Engine.IO connection, the server sends some information:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "sid": "FSDjX-WRwSA4zTZMALqx",\n  "upgrades": ["websocket"],\n  "pingInterval": 25000,\n  "pingTimeout": 20000\n}\n')),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"the ",(0,r.kt)("inlineCode",{parentName:"li"},"sid")," is the ID of the session, it must be included in the ",(0,r.kt)("inlineCode",{parentName:"li"},"sid")," query parameter in all subsequent HTTP requests"),(0,r.kt)("li",{parentName:"ul"},"the ",(0,r.kt)("inlineCode",{parentName:"li"},"upgrades"),' array contains the list of all "better" transports that are supported by the server'),(0,r.kt)("li",{parentName:"ul"},"the ",(0,r.kt)("inlineCode",{parentName:"li"},"pingInterval")," and ",(0,r.kt)("inlineCode",{parentName:"li"},"pingTimeout")," values are used in the heartbeat mechanism")),(0,r.kt)("h3",{id:"upgrade-mechanism"},"Upgrade mechanism"),(0,r.kt)("p",null,"By default, the client establishes the connection with the HTTP long-polling transport."),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"But, why?")),(0,r.kt)("p",null,"While WebSocket is clearly the best way to establish a bidirectional communication, experience has shown that it is not always possible to establish a WebSocket connection, due to corporate proxies, personal firewall, antivirus software..."),(0,r.kt)("p",null,"From the user perspective, an unsuccessful WebSocket connection can translate in up to at least 10 seconds of waiting for the realtime application to begin exchanging data. This ",(0,r.kt)("strong",{parentName:"p"},"perceptively")," hurts user experience."),(0,r.kt)("p",null,"To summarize, Engine.IO focuses on reliability and user experience first, marginal potential UX improvements and increased server performance second."),(0,r.kt)("p",null,"To upgrade, the client will:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"ensure its outgoing buffer is empty"),(0,r.kt)("li",{parentName:"ul"},"put the current transport in read-only mode"),(0,r.kt)("li",{parentName:"ul"},"try to establish a connection with the other transport"),(0,r.kt)("li",{parentName:"ul"},"if successful, close the first transport")),(0,r.kt)("p",null,"You can check in the Network Monitor of your browser:"),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"Successful upgrade",src:n(2899).Z,width:"585",height:"216"})),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"handshake (contains the session ID \u2014 here, ",(0,r.kt)("inlineCode",{parentName:"li"},"zBjrh...AAAK")," \u2014 that is used in subsequent requests)"),(0,r.kt)("li",{parentName:"ol"},"send data (HTTP long-polling)"),(0,r.kt)("li",{parentName:"ol"},"receive data (HTTP long-polling)"),(0,r.kt)("li",{parentName:"ol"},"upgrade (WebSocket)"),(0,r.kt)("li",{parentName:"ol"},"receive data (HTTP long-polling, closed once the WebSocket connection in 4. is successfully established)")),(0,r.kt)("h3",{id:"disconnection-detection"},"Disconnection detection"),(0,r.kt)("p",null,"The Engine.IO connection is considered as closed when:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"one HTTP request (either GET or POST) fails (for example, when the server is shutdown)"),(0,r.kt)("li",{parentName:"ul"},"the WebSocket connection is closed (for example, when the user closes the tab in its browser)"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"socket.disconnect()")," is called on the server-side or on the client-side")),(0,r.kt)("p",null,"There is also a heartbeat mechanism which checks that the connection between the server and the client is still up and running:"),(0,r.kt)("p",null,"At a given interval (the ",(0,r.kt)("inlineCode",{parentName:"p"},"pingInterval")," value sent in the handshake) the server sends a PING packet and the client has a few seconds (the ",(0,r.kt)("inlineCode",{parentName:"p"},"pingTimeout")," value) to send a PONG packet back. If the server does not receive a PONG packet back, it will consider that the connection is closed. Conversely, if the client does not receive a PING packet within ",(0,r.kt)("inlineCode",{parentName:"p"},"pingInterval + pingTimeout"),", it will consider that the connection is closed."),(0,r.kt)("p",null,"The disconnection reasons are listed ",(0,r.kt)("a",{parentName:"p",href:"/nimbly/docs/v1/server-socket-instance/#disconnect"},"here")," (server-side) and ",(0,r.kt)("a",{parentName:"p",href:"/nimbly/docs/v1/client-socket-instance/#disconnect"},"here")," (client-side)."),(0,r.kt)("h2",{id:"socketio"},"Socket.IO"),(0,r.kt)("p",null,"Socket.IO provides some additional features over the Engine.IO connection:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"automatic reconnection"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/nimbly/docs/v1/client-offline-behavior/#buffered-events"},"packet buffering")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"../04-Events/emitting-events.md#acknowledgements"},"acknowledgments")),(0,r.kt)("li",{parentName:"ul"},"broadcasting ",(0,r.kt)("a",{parentName:"li",href:"../04-Events/broadcasting-events.md"},"to all clients")," or ",(0,r.kt)("a",{parentName:"li",href:"../04-Events/rooms.md"},"to a subset of clients"),' (what we call "Room")'),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"../06-Advanced/namespaces.md"},"multiplexing"),' (what we call "Namespace")')),(0,r.kt)("p",null,"The source code can be found here:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"server: ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/socketio/socket.io"},"https://github.com/socketio/socket.io")),(0,r.kt)("li",{parentName:"ul"},"client: ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/socketio/socket.io-client"},"https://github.com/socketio/socket.io-client")),(0,r.kt)("li",{parentName:"ul"},"parser: ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/socketio/socket.io-parser"},"https://github.com/socketio/socket.io-parser")),(0,r.kt)("li",{parentName:"ul"},"protocol description: ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/socketio/socket.io-protocol"},"https://github.com/socketio/socket.io-protocol"))))}h.isMDXComponent=!0},2899:function(e,t,n){t.Z=n.p+"assets/images/network-monitor-2e47dbe233100aa290595f8687a9fcba.png"}}]);