import type { ReactNode } from 'react';
import type { Background } from '../content/types';
import { Label, ShapedImage, bgClass } from './ui';
import styles from './Hero.module.css';

/**
 * Full hero (DESIGN.md §3.2): text on the left (656px), an arch photo on the right
 * (480 × 560 at most). Home on the page background, theme pages and Our mission on
 * their accent.
 */
export function FullHero({
  label,
  title,
  lead,
  intro,
  image,
  alt,
  background = 'page',
  children,
}: {
  label?: string;
  title: ReactNode;
  lead?: string;
  intro?: string;
  image?: string;
  alt?: string;
  background?: Background;
  children?: ReactNode;
}) {
  return (
    <section className={`${styles.hero} ${bgClass(background)}`} aria-labelledby="page-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.text}>
          {label && <Label>{label}</Label>}
          <h1 id="page-title" className={styles.title}>
            {title}
          </h1>
          {lead && <p className={styles.lead}>{lead}</p>}
          {intro && <p className={styles.intro}>{intro}</p>}
          {children && <div className={styles.actions}>{children}</div>}
        </div>
        <ShapedImage src={image} alt={alt} shape="arch" className={styles.photo} eager />
      </div>
    </section>
  );
}
