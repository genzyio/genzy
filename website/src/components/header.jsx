import React from "react";
import ThemedImage from "@theme/ThemedImage";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Link from "@docusaurus/Link";
import Translate from "@docusaurus/Translate";
import CodeBlock from "@theme/CodeBlock";

export default function HomepageHeader() {
  return (
    <header className="px-5 py-5 sm:py-10 lg:py-0 flex justify-center">
      <div className="lg:flex lg:justify-center">
        <div className="w-full flex flex-col justify-center items-center">
          <ThemedImage
            className="w-[450px] md:w-[600px] lg:w-[800px]"
            alt="genzy logo"
            sources={{
              light: useBaseUrl("images/logo-dark-text.svg"),
              dark: useBaseUrl("images/logo-light-text.svg"),
            }}
          />

          <h4 className="font-bold">
            Web framework for building{" "}
            <span className="text-brand-primary font-bold text-xl">better</span>{" "}
            APIs{" "}
            <span className="text-brand-primary font-bold text-xl">faster</span>
            !
          </h4>
        </div>

        <div className="w-full flex items-center justify-center mt-5 lg:mt-40">
          <div className="flex flex-col items-center gap-y-10 sm:gap-y-4 max-w-lg lg:max-w-md">
            <div className="flex flex-col gap-y-4">
              <div>
                <CodeBlock className="language-bash">
                  {"npm install -g genzy"}
                </CodeBlock>
              </div>
              <p>
                <b className="text-brand-primary text-xl">genzy</b> is your
                ultimate development companion, a versatile and robust Node.js
                framework built to empower your projects. It streamlines API
                creation, handles code generation, and empowers customization.
                Whether you're integrating it into an existing project or
                building from the ground up, Genzy offers flexibility,
                efficiency, and versatility to meet your specific needs.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row w-full items-center justify-start gap-2 sm:gap-4">
              <Link
                className="button bg-brand-primary button--lg max-w-[400px] md:max-w-[250px] w-full"
                to="/docs/0.0.1-alpha/getting-started/"
              >
                <Translate>Get started</Translate>
              </Link>
              <Link
                className="button button--secondary button--lg max-w-[400px] md:max-w-[250px] w-full"
                to="/docs/0.0.1-alpha/"
              >
                <Translate>Documentation</Translate>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
