import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
    title: string;
    Svg: React.ComponentType<React.ComponentProps<'svg'>>;
    description: JSX.Element;
};


function Feature({title, Svg, description}: FeatureItem) {
    return (
        <div className={clsx('col col--12')}>
            <div className="text--center">
                <Svg className={styles.featureSvg} role="img" />
            </div>
            <div className="text--center padding-horiz--md">
                <a href="/docs/introduction">
                    <h1 style={{ fontSize: '72px' }}>{title}</h1>
                </a>
                <p>{description}</p>
            </div>
        </div>
    );
}

export default function HomepageFeatures(): JSX.Element {
    return (
        <section className={styles.features}>
            <div className="container">
                <div className="row">
                    <Feature
                        title={'Get started!'}
                        Svg={require('@site/static/img/undraw_books_re_8gea.svg').default}
                        description={(
                            <>
                                Probably the best way to learn is by example.
                            </>
                        )}
                    />
                </div>
            </div>
        </section>
    );
}
