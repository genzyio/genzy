import React from "react";
import clsx from "clsx";
import styles from "./benefits.module.css";
import Translate from "@docusaurus/Translate";
import Automate from "./images/engineering.svg";
import Rapid from "./images/clock.svg";
import Flexibility from "./images/network.svg";

const FeatureList = [
  {
    title: <Translate>Rapid Development</Translate>,
    description: (
      <Translate>
        You don't have to spend time and effort on configuring the web API and
        the documentation. Focus on the business logic, and let Genzy handle the
        rest.
      </Translate>
    ),
    icon: <Rapid className={styles.icon + " " + styles.padding} />,
  },
  {
    title: <Translate>Automation</Translate>,
    description: (
      <Translate>
        Let Genzy's automation take the wheel, ensuring efficiency and
        eliminating manual configurations. Simplify your workflow and
        concentrate on your core tasks.
      </Translate>
    ),
    icon: <Automate className={styles.icon + " " + styles.padding} />,
  },
  {
    title: <Translate>Flexibility</Translate>,
    description: (
      <Translate>
        With Genzy, you're in control. Whether you're looking to enhance your
        existing project or build an entire application from scratch, Genzy
        adapts to your needs, making every use case a breeze.
      </Translate>
    ),
    icon: <Flexibility className={styles.icon + " " + styles.padding} />,
  },
];

function Benefit({ title, description, icon }) {
  return (
    <div className={clsx("col col--4")}>
      <div
        className={
          clsx(styles.feature, "text--center padding-horiz--md") +
          " flex flex-col items-center justify-center mt-5"
        }
      >
        <span className="shrink-0 fill-brand-light">{icon}</span>
        <h3 className="font-bold text-lg mb-3">{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function Benefits() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Benefit key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
