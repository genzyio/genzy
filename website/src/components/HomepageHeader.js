import React from "react";
import ThemedImage from "@theme/ThemedImage";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Link from "@docusaurus/Link";
import Translate from "@docusaurus/Translate";

export default function HomepageHeader() {
  return (
    <header className="px-20 py-10 lg:py-0 flex justify-center">
      <div className="lg:flex lg:justify-center">
        <div className="w-full flex justify-center items-center">
          <ThemedImage
            className="w-[600px] lg:w-[800px]"
            alt="genzy logo"
            sources={{
              light: useBaseUrl("images/logo-dark-text.svg"),
              dark: useBaseUrl("images/logo-light-text.svg"),
            }}
          />
        </div>

        <div className="w-full flex items-center justify-center mt-5 lg:mt-40">
          <div className="flex flex-col items-center gap-y-4 max-w-md">
            <div className="flex flex-col gap-y-4">
              <h4 className="font-bold">
                Web framework for building{" "}
                <span className="text-brand-primary font-bold">better</span>{" "}
                APIs <span className="text-brand-accent font-bold">faster</span>
                !
              </h4>
              <p>
                <b className="text-brand-primary text-lg">genzy</b> is a
                JavaScript library that enables rapid development of web
                applications and puts the focus on implementing the business
                logic instead of spending much time and effort on configuration.
              </p>
            </div>
            <div className="flex w-full justify-start gap-x-4">
              <Link
                className="button bg-brand-primary button--lg"
                to="/docs/0.0.1-alpha/getting-started/"
              >
                <Translate>Get started</Translate>
              </Link>
              <Link
                className="button button--secondary button--lg"
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
