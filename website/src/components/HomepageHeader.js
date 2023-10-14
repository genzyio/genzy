import React from "react";
import ThemedImage from "@theme/ThemedImage";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Link from "@docusaurus/Link";
import styles from "./HomepageHeader.module.css";
import Translate from "@docusaurus/Translate";

export default function HomepageHeader() {
  return (
    <header className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <ThemedImage
            className={styles.logo}
            alt="Genzy logo"
            sources={{
              light: useBaseUrl("images/logo-new.svg"),
              dark: useBaseUrl("images/logo-new-dark.svg"),
            }}
          />
        </div>
        <div className={styles.right}>
          <h1 className="title">
            Gen<span className={styles.colorPrimary}>z</span>y
          </h1>
          <h4>
            Web framework for building{" "}
            <span className={styles.colorPrimary}>better</span> APIs{" "}
            <span className={styles.colorPrimary}>faster</span>!
          </h4>
          <p>
            <Translate>
              Genzy is a JavaScript library that enables rapid development of
              web applications and puts the focus on implementing the business
              logic instead of spending much time and effort on configuration.
            </Translate>
          </p>
          <div className={styles.buttons}>
            <Link
              className="button button--primary button--lg"
              to="/docs/v1/getting-started/"
            >
              <Translate>Get started</Translate>
            </Link>
            <Link
              className="button button--secondary button--lg"
              to="/docs/v1/"
            >
              <Translate>Documentation</Translate>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
