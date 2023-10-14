---
title: How it works
sidebar_position: 2
slug: /how-it-works/
---

Under the hood, Genzy is using JavaScript's [Proxy API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) to intercept all method calls and gather the required information for registring the routes.

Genzy keeps all services in it's own internal service registry, and implements [Dependency Inversion](https://en.wikipedia.org/wiki/Dependency_inversion_principle) principle. The registry contains all services from a Nimble, and is injected as a first parameter of every service constructor.

Client is using Axios for sending HTTP requests.

Server is using [Express](https://expressjs.com/) for creating a web API. It implements the custom logic for creating [OpenAPI](https://www.openapis.org/) documentation based on the information gathered from the Nimble services. [SwaggerUI](https://swagger.io/) is created using the [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express) library.