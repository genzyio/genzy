"use strict";(self.webpackChunknimbly=self.webpackChunknimbly||[]).push([[9244],{3905:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return h}});var a=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var s=a.createContext({}),p=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},c=function(e){var t=p(e.components);return a.createElement(s.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var n=e.components,o=e.mdxType,r=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),u=p(n),h=o,k=u["".concat(s,".").concat(h)]||u[h]||d[h]||r;return n?a.createElement(k,i(i({ref:t},c),{},{components:n})):a.createElement(k,i({ref:t},c))}));function h(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var r=n.length,i=new Array(r);i[0]=u;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:o,i[1]=l;for(var p=2;p<r;p++)i[p]=n[p];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}u.displayName="MDXCreateElement"},4496:function(e,t,n){n.r(t),n.d(t,{contentTitle:function(){return s},default:function(){return u},frontMatter:function(){return l},metadata:function(){return p},toc:function(){return c}});var a=n(7462),o=n(3366),r=(n(7294),n(3905)),i=["components"],l={title:"Basic CRUD application"},s="Basic CRUD application",p={type:"mdx",permalink:"/nimbly/get-started/basic-crud-application",source:"@site/src/pages/get-started/basic-crud-application.md",title:"Basic CRUD application",description:"While using Socket.IO (or plain WebSockets) for a basic CRUD application might sound a bit overkill, the ability to easily notify all users is really powerful.",frontMatter:{title:"Basic CRUD application"}},c=[{value:"Installation",id:"installation",children:[],level:2},{value:"Running the frontend",id:"running-the-frontend",children:[],level:2},{value:"Running the server",id:"running-the-server",children:[],level:2},{value:"How it works",id:"how-it-works",children:[{value:"Server structure",id:"server-structure",children:[],level:3},{value:"Initialization",id:"initialization",children:[],level:3},{value:"Event handler",id:"event-handler",children:[],level:3},{value:"Tests",id:"tests",children:[],level:3}],level:2},{value:"Next steps",id:"next-steps",children:[],level:2}],d={toc:c};function u(e){var t=e.components,l=(0,o.Z)(e,i);return(0,r.kt)("wrapper",(0,a.Z)({},d,l,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"basic-crud-application"},"Basic CRUD application"),(0,r.kt)("p",null,"While using Socket.IO (or plain WebSockets) for a basic CRUD application might sound a bit overkill, the ability to easily notify all users is really powerful."),(0,r.kt)("p",null,"In this guide we will create a basic CRUD (standing for ",(0,r.kt)("strong",{parentName:"p"},"C"),"reate/",(0,r.kt)("strong",{parentName:"p"},"R"),"ead/",(0,r.kt)("strong",{parentName:"p"},"U"),"pdate/",(0,r.kt)("strong",{parentName:"p"},"D"),"elete) application, based on the awesome ",(0,r.kt)("a",{parentName:"p",href:"https://todomvc.com/"},"TodoMVC project"),":"),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"Video of the application in action",src:n(3745).Z,width:"1760",height:"870"})),(0,r.kt)("p",null,"We will cover the following topics:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/v4/emitting-events/#Acknowledgements"},"acknowledgements")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/v4/broadcasting-events/"},"broadcasting")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/v4/testing/"},"testing"))),(0,r.kt)("p",null,"Let's start!"),(0,r.kt)("h2",{id:"installation"},"Installation"),(0,r.kt)("p",null,"The code can be found in the ",(0,r.kt)("inlineCode",{parentName:"p"},"examples")," directory of the main repository:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"git clone https://github.com/socketio/socket.io.git\ncd socket.io/examples/basic-crud-application/\n")),(0,r.kt)("p",null,"You should see two directories:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"server/"),": the server implementation"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"angular-client/"),": a client implementation based on ",(0,r.kt)("a",{parentName:"li",href:"https://angular.io/"},"Angular"))),(0,r.kt)("h2",{id:"running-the-frontend"},"Running the frontend"),(0,r.kt)("p",null,"The project is a basic Angular application which was created with the ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/angular/angular-cli"},"Angular CLI"),"."),(0,r.kt)("p",null,"To run it:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"cd angular-client\nnpm install\nnpm start\n")),(0,r.kt)("p",null,"Then if you open http://localhost:4200 in your browser, you should see:"),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"Screenshot of the application",src:n(8453).Z,width:"698",height:"736"})),(0,r.kt)("p",null,"So far, so good."),(0,r.kt)("h2",{id:"running-the-server"},"Running the server"),(0,r.kt)("p",null,"Let's focus on the server now:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"cd ../server\nnpm install\nnpm start\n")),(0,r.kt)("p",null,"You can now open several tabs, and the list of todos should magically be synced between them:"),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"Video of the application in action",src:n(3745).Z,width:"1760",height:"870"})),(0,r.kt)("h2",{id:"how-it-works"},"How it works"),(0,r.kt)("h3",{id:"server-structure"},"Server structure"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"\u251c\u2500\u2500 lib\n\u2502 \u251c\u2500\u2500 index.ts\n\u2502 \u251c\u2500\u2500 app.ts\n\u2502 \u251c\u2500\u2500 events.ts\n\u2502 \u251c\u2500\u2500 todo-management\n\u2502 \u2502 \u251c\u2500\u2500 todo.handlers.ts\n\u2502 | \u2514\u2500\u2500 todo.repository.ts\n\u2502 \u2514\u2500\u2500 util.ts\n\u251c\u2500\u2500 package.json\n\u251c\u2500\u2500 test\n\u2502 \u2514\u2500\u2500 todo-management\n\u2502   \u2514\u2500\u2500 todo.tests.ts\n\u2514\u2500\u2500 tsconfig.json\n")),(0,r.kt)("p",null,"Let's detail the duty of each file:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"index.ts"),": the entrypoint of the server which creates the components and initializes the application"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"app.ts"),": the application itself, where the Socket.IO server is created, and the handlers are registered"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"events.ts"),": the types of each event exchanged between the server and the client (this is the only file that is specific to TypeScript users)"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"todo.handlers.ts"),": the handlers of the operations on the Todo entities"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"todo.repository.ts"),": the repository for persisting/retrieving the Todo entities from the database"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"util.ts"),": some common utility methods that are used in the project"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"todo.tests.ts"),": the integration tests")),(0,r.kt)("h3",{id:"initialization"},"Initialization"),(0,r.kt)("p",null,"First, let's focus on the ",(0,r.kt)("inlineCode",{parentName:"p"},"createApplication")," method in the ",(0,r.kt)("inlineCode",{parentName:"p"},"lib/app.ts")," file:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const io = new Server<ClientEvents, ServerEvents>(httpServer, serverOptions);\n")),(0,r.kt)("p",null,"We create the Socket.IO server with the following options:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'{\n  cors: {\n    origin: ["http://localhost:4200"]\n  }\n}\n')),(0,r.kt)("p",null,"So the frontend application, which is served at ",(0,r.kt)("inlineCode",{parentName:"p"},"http://localhost:4200"),", is allowed to connect."),(0,r.kt)("p",null,"Documentation:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/v4/handling-cors/"},"CORS configuration")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/v4/server-initialization/#Options"},"List of all options"))),(0,r.kt)("p",null,"The ",(0,r.kt)("inlineCode",{parentName:"p"},"<ClientEvents, ServerEvents>")," part is specific to TypeScript users. It allows to explicitly specify the events that are exchanged between the server and the client, so you get autocompletion and type checking:"),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"Screenshot of the IDE autocompletion",src:n(9321).Z,width:"592",height:"295"}),"\n",(0,r.kt)("img",{alt:"Screenshot of the IDE type checking",src:n(8847).Z,width:"931",height:"156"})),(0,r.kt)("p",null,"Back to our application! We then create our handlers by injecting the application components:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const {\n    createTodo,\n    readTodo,\n    updateTodo,\n    deleteTodo,\n    listTodo,\n} = createTodoHandlers(components);\n")),(0,r.kt)("p",null,"And we register them:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},'io.on("connection", (socket) => {\n  socket.on("todo:create", createTodo);\n  socket.on("todo:read", readTodo);\n  socket.on("todo:update", updateTodo);\n  socket.on("todo:delete", deleteTodo);\n  socket.on("todo:list", listTodo);\n});\n')),(0,r.kt)("p",null,"Documentation: ",(0,r.kt)("a",{parentName:"p",href:"/docs/v4/listening-to-events/"},"Listening to events")),(0,r.kt)("p",null,"Note: the event suffixes (",(0,r.kt)("inlineCode",{parentName:"p"},":create"),", ",(0,r.kt)("inlineCode",{parentName:"p"},":read"),", ...) replace the usual HTTP verbs in a REST API:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"POST /todos")," => ",(0,r.kt)("inlineCode",{parentName:"li"},"todo:create")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"GET /todos/:id")," => ",(0,r.kt)("inlineCode",{parentName:"li"},"todo:read")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"PUT /todos/:id")," => ",(0,r.kt)("inlineCode",{parentName:"li"},"todo:update")),(0,r.kt)("li",{parentName:"ul"},"...")),(0,r.kt)("h3",{id:"event-handler"},"Event handler"),(0,r.kt)("p",null,"Let's focus on the ",(0,r.kt)("inlineCode",{parentName:"p"},"createTodo")," handler now, in the ",(0,r.kt)("inlineCode",{parentName:"p"},"lib/todo-management/todo.handlers.ts")," file:"),(0,r.kt)("p",null,"First, we retrieve the Socket instance:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"createTodo: async function (\n  payload: Todo,\n  callback: (res: Response<TodoID>) => void\n) {\n  const socket: Socket<ClientEvents, ServerEvents> = this;\n  // ...\n}\n")),(0,r.kt)("p",null,"Please note that using an arrow function (",(0,r.kt)("inlineCode",{parentName:"p"},"createTodo: async () => {}"),") wouldn't work here, since the ",(0,r.kt)("inlineCode",{parentName:"p"},"this")," wouldn't point to the Socket instance."),(0,r.kt)("p",null,"Then, we validate the payload thanks to the great ",(0,r.kt)("inlineCode",{parentName:"p"},"joi")," library:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},'const { error, value } = todoSchema.tailor("create").validate(payload, {\n  abortEarly: false, // return all errors and not just the first one\n  stripUnknown: true, // remove unknown attributes from the payload\n});\n')),(0,r.kt)("p",null,"Documentation: ",(0,r.kt)("a",{parentName:"p",href:"https://joi.dev/api/"},"https://joi.dev/api/")),(0,r.kt)("p",null,"If there are validation errors, we just call the acknowledgement callback and return:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"if (error) {\n  return callback({\n    error: Errors.INVALID_PAYLOAD,\n    errorDetails: error.details,\n  });\n}\n")),(0,r.kt)("p",null,"And we handle the error on the client side:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},'// angular-client/src/app/store.ts\n\nthis.socket.emit("todo:create", { title, completed: false }, (res) => {\n  if ("error" in res) {\n    // handle the error\n  } else {\n    // success!\n  }\n});\n')),(0,r.kt)("p",null,"Documentation: ",(0,r.kt)("a",{parentName:"p",href:"/docs/v4/emitting-events/#Acknowledgements"},"Acknowledgements")),(0,r.kt)("p",null,"If the payload successfully matches the schema, we can generate a new ID and persist the entity:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"value.id = uuid();\n\ntry {\n  await todoRepository.save(value);\n} catch (e) {\n  return callback({\n    error: sanitizeErrorMessage(e),\n  });\n}\n")),(0,r.kt)("p",null,"If there is an unexpected error (for example, if the database is down), we call the acknowledgement callback with a generic error message (in order not to expose the internals of our application)."),(0,r.kt)("p",null,"Else, we just call the callback with the new ID:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"callback({\n  data: value.id,\n});\n")),(0,r.kt)("p",null,"And finally (that's the magic part), we notify all the other users for the creation:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},'socket.broadcast.emit("todo:created", value);\n')),(0,r.kt)("p",null,"Documentation: ",(0,r.kt)("a",{parentName:"p",href:"/docs/v4/broadcasting-events/"},"Broadcasting events")),(0,r.kt)("p",null,"On the client-side, we register a handler for this event:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},'// angular-client/src/app/store.ts\n\nthis.socket.on("todo:created", (todo) => {\n  this.todos.push(mapTodo(todo));\n});\n')),(0,r.kt)("p",null,"And ",(0,r.kt)("em",{parentName:"p"},"voil\xe0"),"!"),(0,r.kt)("h3",{id:"tests"},"Tests"),(0,r.kt)("p",null,"Since we are quite reasonable developers, we'll now add a few tests for our handler. Let's open the ",(0,r.kt)("inlineCode",{parentName:"p"},"test/todo-management/todo.tests.ts")," file:"),(0,r.kt)("p",null,"The application is created in the ",(0,r.kt)("inlineCode",{parentName:"p"},"beforeEach")," hook:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"beforeEach((done) => {\n  const partialDone = createPartialDone(2, done);\n\n  httpServer = createServer();\n  todoRepository = new InMemoryTodoRepository();\n\n  createApplication(httpServer, {\n    todoRepository,\n  });\n\n  // ...\n});\n")),(0,r.kt)("p",null,"And we create two clients, one for sending the payload and the other for receiving the notifications:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},'httpServer.listen(() => {\n  const port = (httpServer.address() as AddressInfo).port;\n  socket = io(`http://localhost:${port}`);\n  socket.on("connect", partialDone);\n\n  otherSocket = io(`http://localhost:${port}`);\n  otherSocket.on("connect", partialDone);\n});\n')),(0,r.kt)("p",null,"Important note: those two clients are explicitly disconnected in the ",(0,r.kt)("inlineCode",{parentName:"p"},"afterEach")," hook, so they don't prevent the process from exiting."),(0,r.kt)("p",null,"Documentation: ",(0,r.kt)("a",{parentName:"p",href:"https://mochajs.org/#hooks"},"https://mochajs.org/#hooks")),(0,r.kt)("p",null,"Our first test (the happy path) is quite straightforward:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},'describe("create todo", () => {\n  it("should create a todo entity", (done) => {\n    const partialDone = createPartialDone(2, done);\n\n    // send the payload\n    socket.emit(\n      "todo:create",\n      {\n        title: "lorem ipsum",\n        completed: false,\n      },\n      async (res) => {\n        if ("error" in res) {\n          return done(new Error("should not happen"));\n        }\n        expect(res.data).to.be.a("string");\n\n        // check the entity stored in the database\n        const storedEntity = await todoRepository.findById(res.data);\n        expect(storedEntity).to.eql({\n          id: res.data,\n          title: "lorem ipsum",\n          completed: false,\n        });\n\n        partialDone();\n      }\n    );\n\n    // wait for the notification of the creation\n    otherSocket.on("todo:created", (todo) => {\n      expect(todo.id).to.be.a("string");\n      expect(todo.title).to.eql("lorem ipsum");\n      expect(todo.completed).to.eql(false);\n      partialDone();\n    });\n  });\n});\n')),(0,r.kt)("p",null,"Let's test with an invalid payload too:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},'describe("create todo", () => {\n  it("should fail with an invalid entity", (done) => {\n    const incompleteTodo = {\n      completed: "false",\n      description: true,\n    };\n\n    socket.emit("todo:create", incompleteTodo, (res) => {\n      if (!("error" in res)) {\n        return done(new Error("should not happen"));\n      }\n      expect(res.error).to.eql("invalid payload");\n      // check the details of the validation error\n      expect(res.errorDetails).to.eql([\n        {\n          message: \'"title" is required\',\n          path: ["title"],\n          type: "any.required",\n        },\n      ]);\n      done();\n    });\n\n    // no notification should be received\n    otherSocket.on("todo:created", () => {\n      done(new Error("should not happen"));\n    });\n  });\n});\n')),(0,r.kt)("p",null,"You can run the full test suite with ",(0,r.kt)("inlineCode",{parentName:"p"},"npm test"),":"),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"Screenshot of the test results",src:n(4370).Z,width:"999",height:"655"})),(0,r.kt)("p",null,"That's all folks! The other handlers are quite similar to the first one, and will not be detailed here."),(0,r.kt)("h2",{id:"next-steps"},"Next steps"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/get-started/"},"Back to the list of guides")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/get-started/private-messaging-part-1/"},"Private messaging guide")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/v4/"},"Documentation"))),(0,r.kt)("p",null,"Thanks for reading!"))}u.isMDXComponent=!0},4370:function(e,t,n){t.Z=n.p+"assets/images/basic-crud-app-test-results-c44a2d4c76b59ad87afe885d2e29c81b.png"},9321:function(e,t,n){t.Z=n.p+"assets/images/basic-crud-app-typed-events-7fd23292c99a47011adb02d6fa2f9166.png"},8847:function(e,t,n){t.Z=n.p+"assets/images/basic-crud-app-typed-events2-4c5b77c221cfe48b29d7ba6e678b875e.png"},3745:function(e,t,n){t.Z=n.p+"assets/images/basic-crud-app-55c1d48f52d1b78478b4f7b6a43dd7fd.gif"},8453:function(e,t,n){t.Z=n.p+"assets/images/basic-crud-app-6f657a31f742b81004fe38845c5e3022.png"}}]);