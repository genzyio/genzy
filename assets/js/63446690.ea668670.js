"use strict";(self.webpackChunknimbly=self.webpackChunknimbly||[]).push([[5929],{3905:function(e,n,s){s.d(n,{Zo:function(){return p},kt:function(){return h}});var t=s(7294);function o(e,n,s){return n in e?Object.defineProperty(e,n,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[n]=s,e}function r(e,n){var s=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),s.push.apply(s,t)}return s}function i(e){for(var n=1;n<arguments.length;n++){var s=null!=arguments[n]?arguments[n]:{};n%2?r(Object(s),!0).forEach((function(n){o(e,n,s[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(s)):r(Object(s)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(s,n))}))}return e}function a(e,n){if(null==e)return{};var s,t,o=function(e,n){if(null==e)return{};var s,t,o={},r=Object.keys(e);for(t=0;t<r.length;t++)s=r[t],n.indexOf(s)>=0||(o[s]=e[s]);return o}(e,n);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(t=0;t<r.length;t++)s=r[t],n.indexOf(s)>=0||Object.prototype.propertyIsEnumerable.call(e,s)&&(o[s]=e[s])}return o}var c=t.createContext({}),l=function(e){var n=t.useContext(c),s=n;return e&&(s="function"==typeof e?e(n):i(i({},n),e)),s},p=function(e){var n=l(e.components);return t.createElement(c.Provider,{value:n},e.children)},d={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},u=t.forwardRef((function(e,n){var s=e.components,o=e.mdxType,r=e.originalType,c=e.parentName,p=a(e,["components","mdxType","originalType","parentName"]),u=l(s),h=o,m=u["".concat(c,".").concat(h)]||u[h]||d[h]||r;return s?t.createElement(m,i(i({ref:n},p),{},{components:s})):t.createElement(m,i({ref:n},p))}));function h(e,n){var s=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var r=s.length,i=new Array(r);i[0]=u;var a={};for(var c in n)hasOwnProperty.call(n,c)&&(a[c]=n[c]);a.originalType=e,a.mdxType="string"==typeof e?e:o,i[1]=a;for(var l=2;l<r;l++)i[l]=s[l];return t.createElement.apply(null,i)}return t.createElement.apply(null,s)}u.displayName="MDXCreateElement"},6218:function(e,n,s){s.r(n),s.d(n,{contentTitle:function(){return c},default:function(){return u},frontMatter:function(){return a},metadata:function(){return l},toc:function(){return p}});var t=s(7462),o=s(3366),r=(s(7294),s(3905)),i=["components"],a={title:"How to use with `express-session`"},c="How to use with `express-session`",l={type:"mdx",permalink:"/nimbly/how-to/use-with-express-session",source:"@site/src/pages/how-to/use-with-express-session.md",title:"How to use with `express-session`",description:"There are two ways to share the session context between Express and Socket.IO, depending on your use case:",frontMatter:{title:"How to use with `express-session`"}},p=[{value:"1st use case: Socket.IO only retrieves the session context",id:"1st-use-case-socketio-only-retrieves-the-session-context",children:[],level:3},{value:"2nd use case: Socket.IO can also create the session context",id:"2nd-use-case-socketio-can-also-create-the-session-context",children:[],level:3},{value:"Modifying the session",id:"modifying-the-session",children:[],level:2},{value:"Handling logout",id:"handling-logout",children:[],level:2},{value:"Handling session expiration",id:"handling-session-expiration",children:[],level:2},{value:"With TypeScript",id:"with-typescript",children:[],level:2}],d={toc:p};function u(e){var n=e.components,s=(0,o.Z)(e,i);return(0,r.kt)("wrapper",(0,t.Z)({},d,s,{components:n,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"how-to-use-with-express-session"},"How to use with ",(0,r.kt)("inlineCode",{parentName:"h1"},"express-session")),(0,r.kt)("p",null,"There are two ways to share the session context between ",(0,r.kt)("a",{parentName:"p",href:"http://expressjs.com/"},"Express")," and ",(0,r.kt)("a",{parentName:"p",href:"https://socket.io/docs/v4/"},"Socket.IO"),", depending on your use case:"),(0,r.kt)("h3",{id:"1st-use-case-socketio-only-retrieves-the-session-context"},"1st use case: Socket.IO only retrieves the session context"),(0,r.kt)("p",null,"This is useful when the authentication is handled by Express (or ",(0,r.kt)("a",{parentName:"p",href:"http://www.passportjs.org/"},"Passport"),") for example."),(0,r.kt)("p",null,"In that case, we can directly use the session middleware:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'import express from "express";\nimport { createServer } from "http";\nimport { Server } from "socket.io";\nimport session from "express-session";\n\nconst app = express();\nconst httpServer = createServer(app);\n\nconst sessionMiddleware = session({\n  secret: "changeit",\n  resave: false,\n  saveUninitialized: false\n});\n\napp.use(sessionMiddleware);\n\napp.post("/login", (req, res) => {\n  req.session.authenticated = true;\n  res.status(204).end();\n});\n\nconst io = new Server(httpServer);\n\n// convert a connect middleware to a Socket.IO middleware\nconst wrap = middleware => (socket, next) => middleware(socket.request, {}, next);\n\nio.use(wrap(sessionMiddleware));\n\n// only allow authenticated users\nio.use((socket, next) => {\n  const session = socket.request.session;\n  if (session && session.authenticated) {\n    next();\n  } else {\n    next(new Error("unauthorized"));\n  }\n});\n\nio.on("connection", (socket) => {\n  console.log(socket.request.session);\n});\n')),(0,r.kt)("p",null,"Please check the example with Passport ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/socketio/socket.io/tree/main/examples/passport-example"},"here"),"."),(0,r.kt)("h3",{id:"2nd-use-case-socketio-can-also-create-the-session-context"},"2nd use case: Socket.IO can also create the session context"),(0,r.kt)("p",null,"This is useful if you want to use ",(0,r.kt)("inlineCode",{parentName:"p"},"express-session")," without an Express application for example."),(0,r.kt)("p",null,"In that case, we need to customize the headers sent during the handshake:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'import { createServer } from "http";\nimport { Server } from "socket.io";\nimport session from "express-session";\n\nconst httpServer = createServer();\n\nconst sessionMiddleware = session({\n  secret: "changeit",\n  resave: false,\n  saveUninitialized: false\n});\n\nconst io = new Server(httpServer, {\n  allowRequest: (req, callback) => {\n    // with HTTP long-polling, we have access to the HTTP response here, but this is not\n    // the case with WebSocket, so we provide a dummy response object\n    const fakeRes = {\n      getHeader() {\n        return [];\n      },\n      setHeader(key, values) {\n        req.cookieHolder = values[0];\n      },\n      writeHead() {},\n    };\n    sessionMiddleware(req, fakeRes, () => {\n      if (req.session) {\n        // trigger the setHeader() above\n        fakeRes.writeHead();\n        // manually save the session (normally triggered by res.end())\n        req.session.save();\n      }\n      callback(null, true);\n    });\n  },\n});\n\nio.engine.on("initial_headers", (headers, req) => {\n  if (req.cookieHolder) {\n    headers["set-cookie"] = req.cookieHolder;\n    delete req.cookieHolder;\n  }\n});\n\nio.on("connection", (socket) => {\n  console.log(socket.request.session);\n});\n')),(0,r.kt)("p",null,"Please check the example ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/socketio/socket.io/tree/main/examples/express-session-example"},"here"),"."),(0,r.kt)("h2",{id:"modifying-the-session"},"Modifying the session"),(0,r.kt)("p",null,"Since it is not bound to an HTTP request, the session must be manually reloaded and saved:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'io.on("connection", (socket) => {\n  const req = socket.request;\n\n  socket.on("my event", () => {\n    req.session.reload((err) => {\n      if (err) {\n        return socket.disconnect();\n      }\n      req.session.count++;\n      req.session.save();\n    });\n  });\n});\n')),(0,r.kt)("p",null,"You can also use a ",(0,r.kt)("a",{parentName:"p",href:"https://socket.io/docs/v4/server-api/#socketusefn"},"middleware")," which will be triggered for each incoming packet:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'io.on("connection", (socket) => {\n  const req = socket.request;\n\n  socket.use((__, next) => {\n    req.session.reload((err) => {\n      if (err) {\n        socket.disconnect();\n      } else {\n        next();\n      }\n    });\n  });\n\n  // and then simply\n  socket.on("my event", () => {\n    req.session.count++;\n    req.session.save();\n  });\n});\n')),(0,r.kt)("div",{className:"admonition admonition-caution alert alert--warning"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"}))),"caution")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},"Calling ",(0,r.kt)("inlineCode",{parentName:"p"},"req.session.reload()")," updates the ",(0,r.kt)("inlineCode",{parentName:"p"},"req.session")," object:"),(0,r.kt)("pre",{parentName:"div"},(0,r.kt)("code",{parentName:"pre",className:"language-js"},'io.on("connection", (socket) => {\n  const session = socket.request.session;\n\n  socket.use((__, next) => {\n    session.reload(() => {\n      // WARNING! "session" still points towards the previous session object\n    });\n  });\n});\n')))),(0,r.kt)("h2",{id:"handling-logout"},"Handling logout"),(0,r.kt)("p",null,"You can use the session ID to make the link between Express and Socket.IO:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'io.on("connection", (socket) => {\n  const sessionId = socket.request.session.id;\n\n  socket.join(sessionId);\n});\n\napp.post("/logout", (req, res) => {\n  const sessionId = req.session.id;\n\n  req.session.destroy(() => {\n    // disconnect all Socket.IO connections linked to this session ID\n    io.to(sessionId).disconnectSockets();\n    res.status(204).end();\n  });\n});\n')),(0,r.kt)("h2",{id:"handling-session-expiration"},"Handling session expiration"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'const SESSION_RELOAD_INTERVAL = 30 * 1000;\n\nio.on("connection", (socket) => {\n  const timer = setInterval(() => {\n    socket.request.session.reload((err) => {\n      if (err) {\n        // forces the client to reconnect\n        socket.conn.close();\n        // you can also use socket.disconnect(), but in that case the client\n        // will not try to reconnect\n      }\n    });\n  }, SESSION_RELOAD_INTERVAL);\n\n  socket.on("disconnect", () => {\n    clearInterval(timer);\n  });\n});\n')),(0,r.kt)("h2",{id:"with-typescript"},"With TypeScript"),(0,r.kt)("p",null,"To add proper typings to the session details, you will need to extend the ",(0,r.kt)("inlineCode",{parentName:"p"},"IncomingMessage"),' object from the Node.js "http" module.'),(0,r.kt)("p",null,"Which gives, in the ",(0,r.kt)("a",{parentName:"p",href:"#1st-use-case-socketio-only-retrieves-the-session-context"},"first case"),":"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},'import { Request, Response, NextFunction } from "express";\nimport { Session } from "express-session";\n\ndeclare module "http" {\n    interface IncomingMessage {\n        session: Session & {\n            authenticated: boolean\n        }\n    }\n}\n\nio.use((socket, next) => {\n    sessionMiddleware(socket.request as Request, {} as Response, next as NextFunction);\n});\n')),(0,r.kt)("p",null,"And in the ",(0,r.kt)("a",{parentName:"p",href:"#2nd-use-case-socketio-can-also-create-the-session-context"},"second case"),":"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},'import { Request, Response } from "express";\nimport { Session } from "express-session";\nimport { IncomingMessage } from "http";\n\ndeclare module "http" {\n    interface IncomingMessage {\n        cookieHolder?: string,\n        session: Session & {\n            count: number\n        }\n    }\n}\n\nconst io = new Server(httpServer, {\n    allowRequest: (req, callback) => {\n        // with HTTP long-polling, we have access to the HTTP response here, but this is not\n        // the case with WebSocket, so we provide a dummy response object\n        const fakeRes = {\n            getHeader() {\n                return [];\n            },\n            setHeader(key: string, values: string[]) {\n                req.cookieHolder = values[0];\n            },\n            writeHead() {},\n        };\n        sessionMiddleware(req as Request, fakeRes as unknown as Response, () => {\n            if (req.session) {\n                // trigger the setHeader() above\n                fakeRes.writeHead();\n                // manually save the session (normally triggered by res.end())\n                req.session.save();\n            }\n            callback(null, true);\n        });\n    },\n});\n\nio.engine.on("initial_headers", (headers: { [key: string]: string }, req: IncomingMessage) => {\n    if (req.cookieHolder) {\n        headers["set-cookie"] = req.cookieHolder;\n        delete req.cookieHolder;\n    }\n});\n')),(0,r.kt)("p",null,"Reference: ",(0,r.kt)("a",{parentName:"p",href:"https://www.typescriptlang.org/docs/handbook/declaration-merging.html"},"TypeScript's Declaration Merging")))}u.isMDXComponent=!0}}]);