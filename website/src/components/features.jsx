import React from "react";
import CodeBlock from "@theme/CodeBlock";
import Corner1 from "./images/genzy-corner-1.svg";
import Corner2 from "./images/genzy-corner-2.svg";
import Corner3 from "./images/genzy-corner-3.svg";
import {
  codeGenerationExample,
  controllerCode,
  genericsExample,
  iocExample,
  moduleCode,
  pluginsExample,
  proxyExample,
} from "./code-examples";

export default function Features() {
  return (
    <div className="flex flex-col items-center mt-10 px-5 gap-20">
      <div className="flex flex-col gap-4 items-center">
        <span className="text-brand-light text-5xl font-bold">Framework</span>
        <div className="font-bold">
          A good choice for building{" "}
          <span className="text-brand-primary">scalable</span> REST APIs with{" "}
          <span className="text-brand-primary">ease</span>
        </div>
      </div>

      <Feature
        title="Create API endpoints"
        subtitle="controllers"
        description="Define and implement HTTP endpoints with ease. Genzy simplifies API development by automatically generating OpenAPI specifications and Swagger UI, based on your endpoints and schemas."
        code={controllerCode}
      />
      <Feature
        reverse
        title={"Group services into Modules"}
        subtitle="modules"
        description={`Simplify project structure with Genzy's Modules. Organize and group your services effortlessly, streamlining your development workflow for a more efficient and intuitive experience.`}
        code={moduleCode}
      />
      <Feature
        title={"Inject dependencies"}
        subtitle="IoC"
        description={`Achieve flexibility and maintainability in your application. Genzy's Inversion of Control (IoC) feature allows you to seamlessly inject dependencies, giving you more control over your application's behavior.`}
        code={iocExample}
      />
      <Feature
        reverse
        title={"Embrace Code Flexibility"}
        subtitle="Generics"
        description={`Genzy's support for generics allows you to embrace versatility and adaptability in your projects. Unleash the potential of your code with ease.`}
        code={genericsExample}
      />
      <Feature
        title={"Integrate with external APIs"}
        subtitle="HTTP Client Proxy"
        description={`Effortlessly connect with external APIs using Genzy's HTTP Client Proxy. Integrate third-party services into your application to enhance functionality and data exchange.`}
        code={proxyExample}
      />
      <Feature
        reverse
        title={"Use Custom Plugins"}
        subtitle="Plugin System"
        description={`Enhance framework's capabilities with Genzy's Plugin System. Easily integrate custom plugins to tailor your development experience and add functionality as needed.`}
        code={pluginsExample}
      />
      <Feature
        title={"Code Generation Made Simple"}
        subtitle="CLI"
        description={`Using genzy CLI, you can generate client code for accessing your API. Simplify your development process and maximize your productivity from the command line.`}
        code={codeGenerationExample}
        language="bash"
      />

      <div className="flex flex-col gap-4 items-center">
        <span className="text-brand-light text-5xl font-bold">DevTools</span>
        <div className="font-bold">
          Bridging the gap between full-code{" "}
          <span className="text-brand-primary">freedom</span> and low-code{" "}
          <span className="text-brand-primary">efficiency</span>
        </div>
      </div>

      <Feature
        reverse
        title={"Unlock Limitless Possibilities with Genzy DevTools"}
        subtitle="DevTools"
        description={`With Genzy's DevTools, you can effortlessly craft projects, controllers, services, and models through the intuitive UI. Genzy generates server code automatically, preserving user-defined code even when changes are made, giving you the power to do more.`}
        custom={
          <div className="w-full flex items-center justify-start overflow-x-auto">
            <div className="min-w-[450px] w-full">TODO: GIF HERE</div>
          </div>
        }
      />

      <div></div>
    </div>
  );
}

function Feature({
  reverse = false,
  title,
  subtitle,
  description,
  code,
  language = "js",
  custom,
}) {
  const corners = [
    <Corner1 className="absolute top-2 left-2 w-12 h-12 rotate-[0] fill-brand-accent" />,
    <Corner2 className="absolute -top-1 left-3 w-12 h-12 rotate-[90deg] fill-brand-accent" />,
    <Corner3 className="absolute -top-4 left-2 w-16 h-16 rotate-[0] fill-brand-accent" />,
  ];
  const cornersReverse = [
    <Corner1 className="absolute top-2 right-2 w-12 h-12 rotate-[90deg] fill-brand-primary" />,
    <Corner2 className="absolute top-3 -right-1 w-12 h-12 rotate-[0] fill-brand-primary" />,
    <Corner3 className="absolute -top-4 right-2 w-16 h-16 rotate-[0] fill-brand-primary" />,
  ];
  const randomIndex = Math.floor(Math.random() * 3);
  return (
    <div
      className={`flex flex-col-reverse lg:flex-row justify-between gap-y-5 gap-x-20 bg-gradient-to-b from-slate-50/5 p-5 sm:p-10 rounded-md ${
        reverse ? "lg:flex-row-reverse" : ""
      } max-w-full relative`}
    >
      {(reverse ? cornersReverse : corners)[randomIndex]}
      <div className="w-full flex items-center justify-start overflow-x-auto">
        {custom ? (
          custom
        ) : (
          <CodeBlock className={`language-${language} w-[600px] min-w-0`}>
            {code}
          </CodeBlock>
        )}
      </div>
      <div className="max-w-lg">
        <div className="h-12 sm:hidden"></div>
        <div
          className={`uppercase ${
            reverse ? "text-brand-accent" : "text-brand-primary"
          } text-sm font-bold mb-4`}
        >
          {subtitle}
        </div>
        <div className="text-2xl font-bold mb-2">{title}</div>
        <div>{description}</div>
      </div>
    </div>
  );
}
