import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';
import Translate from '@docusaurus/Translate';
import Automate from './images/engineering.svg';
import Rapid from './images/clock.svg';
import Flexibility from './images/network.svg';

const FeatureList = [
  {
    title: <Translate>Rapid Development</Translate>,
    description: (
      <Translate>
        You don't have to spend time and effort on configuring the web API and the documentation. Focus on the business logic, and let Genzy handle the rest.
      </Translate>
    ),
    icon: <Rapid className={ styles.icon + ' ' + styles.padding  } />
  },
  {
    title: <Translate>Automation</Translate>,
    description: (
      <Translate>
        Genzy is able to automatically generate a Rest API with OpenAPI documentation and SwaggerUI just from the plain service classes that are provided. It also automatically generates the client code, supports custom configuration and more!
      </Translate>
    ),
    icon: <Automate className={ styles.icon + ' ' + styles.padding } />,
  },
  {
    title: <Translate>Flexibility</Translate>,
    description: (
      <Translate>
        Start with a monolithic application, group services into Nimbles and once you got the final picture of existing domains, scale to multiple servivces with ease in no time.
      </Translate>
    ),
    icon: <Flexibility className={ styles.icon + ' ' + styles.padding  } />
  },
];

function Feature({ title, description, icon }) {
  return (
    <div className={clsx('col col--4')}>
      <div className={clsx(styles.feature, "text--center padding-horiz--md")}>
        { icon }
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
