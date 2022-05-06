"use strict";(self.webpackChunknimbly=self.webpackChunknimbly||[]).push([[8092],{3905:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return c}});var o=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function p(e,t){if(null==e)return{};var n,o,r=function(e,t){if(null==e)return{};var n,o,r={},a=Object.keys(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var d=o.createContext({}),i=function(e){var t=o.useContext(d),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},u=function(e){var t=i(e.components);return o.createElement(d.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},m=o.forwardRef((function(e,t){var n=e.components,r=e.mdxType,a=e.originalType,d=e.parentName,u=p(e,["components","mdxType","originalType","parentName"]),m=i(n),c=r,h=m["".concat(d,".").concat(c)]||m[c]||s[c]||a;return n?o.createElement(h,l(l({ref:t},u),{},{components:n})):o.createElement(h,l({ref:t},u))}));function c(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=n.length,l=new Array(a);l[0]=m;var p={};for(var d in t)hasOwnProperty.call(t,d)&&(p[d]=t[d]);p.originalType=e,p.mdxType="string"==typeof e?e:r,l[1]=p;for(var i=2;i<a;i++)l[i]=n[i];return o.createElement.apply(null,l)}return o.createElement.apply(null,n)}m.displayName="MDXCreateElement"},7899:function(e,t,n){n.r(t),n.d(t,{contentTitle:function(){return d},default:function(){return m},frontMatter:function(){return p},metadata:function(){return i},toc:function(){return u}});var o=n(7462),r=n(3366),a=(n(7294),n(3905)),l=["components"],p={title:"Behind a reverse proxy",sidebar_position:6,slug:"/reverse-proxy/"},d=void 0,i={unversionedId:"categories/Server/behind-a-reverse-proxy",id:"categories/Server/behind-a-reverse-proxy",title:"Behind a reverse proxy",description:"You will find below the configuration needed for deploying a Socket.IO server behind a reverse-proxy solution, such as:",source:"@site/docs/categories/02-Server/behind-a-reverse-proxy.md",sourceDirName:"categories/02-Server",slug:"/reverse-proxy/",permalink:"/nimbly/docs/v1/reverse-proxy/",tags:[],version:"current",sidebarPosition:6,frontMatter:{title:"Behind a reverse proxy",sidebar_position:6,slug:"/reverse-proxy/"},sidebar:"sidebar",previous:{title:"Middlewares",permalink:"/nimbly/docs/v1/middlewares/"},next:{title:"Using multiple nodes",permalink:"/nimbly/docs/v1/using-multiple-nodes/"}},u=[{value:"NginX",id:"nginx",children:[],level:2},{value:"Apache HTTPD",id:"apache-httpd",children:[],level:2},{value:"Node.js <code>http-proxy</code>",id:"nodejs-http-proxy",children:[],level:2}],s={toc:u};function m(e){var t=e.components,n=(0,r.Z)(e,l);return(0,a.kt)("wrapper",(0,o.Z)({},s,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"You will find below the configuration needed for deploying a Socket.IO server behind a reverse-proxy solution, such as:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#nginx"},"NginX")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#apache-httpd"},"Apache HTTPD")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#nodejs-http-proxy"},"Node.js ",(0,a.kt)("inlineCode",{parentName:"a"},"http-proxy")))),(0,a.kt)("p",null,"In a multi-server setup, please check the documentation ",(0,a.kt)("a",{parentName:"p",href:"/nimbly/docs/v1/using-multiple-nodes/"},"here"),"."),(0,a.kt)("h2",{id:"nginx"},"NginX"),(0,a.kt)("p",null,"Content of ",(0,a.kt)("inlineCode",{parentName:"p"},"/etc/nginx/nginx.conf"),":"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-nginx"},'http {\n  server {\n    listen 80;\n    server_name example.com;\n\n    location / {\n      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n      proxy_set_header Host $host;\n\n      proxy_pass http://localhost:3000;\n\n      proxy_http_version 1.1;\n      proxy_set_header Upgrade $http_upgrade;\n      proxy_set_header Connection "upgrade";\n    }\n  }\n}\n')),(0,a.kt)("p",null,"Related:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"http://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_pass"},"proxy_pass documentation")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/nimbly/docs/v1/using-multiple-nodes/#nginx-configuration"},"configuration in a multi-server setup"))),(0,a.kt)("p",null,"If you only want to forward the Socket.IO requests (for example when NginX handles the static content):"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},'http {\n  server {\n    listen 80;\n    root /var/www/html;\n\n    location /socket.io/ {\n      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n      proxy_set_header Host $host;\n\n      proxy_pass http://localhost:3000;\n\n      proxy_http_version 1.1;\n      proxy_set_header Upgrade $http_upgrade;\n      proxy_set_header Connection "upgrade";\n    }\n  }\n}\n')),(0,a.kt)("h2",{id:"apache-httpd"},"Apache HTTPD"),(0,a.kt)("p",null,"Content of ",(0,a.kt)("inlineCode",{parentName:"p"},"/usr/local/apache2/conf/httpd.conf"),":"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-apache"},'Listen 80\n\nServerName example.com\n\nLoadModule mpm_event_module             modules/mod_mpm_event.so\n\nLoadModule authn_file_module            modules/mod_authn_file.so\nLoadModule authn_core_module            modules/mod_authn_core.so\nLoadModule authz_host_module            modules/mod_authz_host.so\nLoadModule authz_groupfile_module       modules/mod_authz_groupfile.so\nLoadModule authz_user_module            modules/mod_authz_user.so\nLoadModule authz_core_module            modules/mod_authz_core.so\n\nLoadModule headers_module               modules/mod_headers.so\nLoadModule lbmethod_byrequests_module   modules/mod_lbmethod_byrequests.so\nLoadModule proxy_module                 modules/mod_proxy.so\nLoadModule proxy_balancer_module        modules/mod_proxy_balancer.so\nLoadModule proxy_http_module            modules/mod_proxy_http.so\nLoadModule proxy_wstunnel_module        modules/mod_proxy_wstunnel.so\nLoadModule rewrite_module               modules/mod_rewrite.so\nLoadModule slotmem_shm_module           modules/mod_slotmem_shm.so\nLoadModule unixd_module                 modules/mod_unixd.so\n\nUser daemon\nGroup daemon\n\nProxyPass / http://localhost:3000/\nRewriteEngine on\nRewriteCond %{HTTP:Upgrade} websocket [NC]\nRewriteCond %{HTTP:Connection} upgrade [NC]\nRewriteRule ^/?(.*) "ws://localhost:3000/$1" [P,L]\n\nProxyTimeout 3\n')),(0,a.kt)("p",null,"Related:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://httpd.apache.org/docs/2.4/en/mod/mod_proxy_wstunnel.html"},"mod_proxy_wstunnel documentation")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/nimbly/docs/v1/using-multiple-nodes/#apache-httpd-configuration"},"configuration in a multi-server setup"))),(0,a.kt)("h2",{id:"nodejs-http-proxy"},"Node.js ",(0,a.kt)("inlineCode",{parentName:"h2"},"http-proxy")),(0,a.kt)("p",null,"Installation: ",(0,a.kt)("inlineCode",{parentName:"p"},"npm i http-proxy")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'const httpProxy = require("http-proxy");\n\nhttpProxy\n  .createProxyServer({\n    target: "http://localhost:3000",\n    ws: true,\n  })\n  .listen(80);\n')),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://github.com/http-party/node-http-proxy#readme"},"Documentation")))}m.isMDXComponent=!0}}]);