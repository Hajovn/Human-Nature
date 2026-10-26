import { useMemo } from 'react';
import { Button } from '../components/Button';
import { InfoCards, PersonCard } from '../components/cards';
import { FullHero } from '../components/Hero';
import { BigNumbers, FallbackNotice, Label, Placeholder, Section, SectionChips, ShapedImage } from '../components/ui';
import { ContentImage } from '../content/assets';
import { getMission } from '../content/load';
import type { MissionData } from '../content/types';
import { useLocale, useT } from '../i18n/locale';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import styles from './MissionPage.module.css';

/** Our mission route (DESIGN.md §5.7). */
export default function MissionPage() {
  const locale = useLocale();
  const t = useT();
  const { data, fallback } = useMemo(() => getMission(locale), [locale]);
  useDocumentTitle(data.hero?.title ?? t('nav.mission'));
  return <MissionView mission={data} fallback={fallback} />;
}

/** A button to an internal page or another website. */
function LinkButton({ url, label, variant }: { url?: string; label?: string; variant?: 'primary' | 'secondary' }) {
  const t = useT();
  if (!label) return null;
  if (!url) return <Button variant={variant} disabled>{label}</Button>;
  if (url.startsWith('/')) return <Button to={url} variant={variant}>{label}</Button>;
  return (
    <Button href={url} variant={variant} target="_blank" rel="noopener noreferrer">
      {label}
      <span className="visually-hidden"> {t('a11y.newTab')}</span>
    </Button>
  );
}

/** Mission page content in the order of DESIGN.md §5.7. Also used by the CMS live preview. */
export function MissionView({ mission, fallback = false }: { mission: MissionData; fallback?: boolean }) {
  const t = useT();
  const { hero, product, team, impact, ibf, plans, workshop, contact } = mission;
  const chips = [
    product && { id: 'our-product', label: product.title ?? t('nav.ourProduct') },
    team && { id: 'the-team', label: team.title ?? t('nav.theTeam') },
    impact && { id: 'our-impact', label: impact.title ?? t('nav.ourImpact') },
    ibf && { id: 'collaboration-ibf', label: t('nav.collaboration') },
    plans && { id: 'future-plans', label: plans.title ?? t('nav.futurePlans') },
  ].filter(Boolean) as { id: string; label: string }[];

  return (
    <div lang={fallback ? 'en' : undefined}>
      <FullHero label={hero?.label} title={hero?.title} lead={hero?.lead} intro={hero?.intro} image={hero?.image} alt={hero?.alt} background="leaf">
        <Button to="/resources">{t('mission.explore')}</Button>
      </FullHero>
      <FallbackNotice show={fallback} />

      <Section className={styles.chips}>
        <SectionChips items={chips} />
      </Section>

      {product && (
        <Section id="our-product" background="sky">
          <div className={styles.split}>
            <div className={styles.stack}>
              <h2 className={styles.h2}>{product.title}</h2>
              {product.lead && <p className={styles.lead}>{product.lead}</p>}
              <dl className={styles.offers}>
                {(product.offers ?? []).map((offer, i) => (
                  <div key={i}>
                    <dt>
                      <Label>{offer.title}</Label>
                    </dt>
                    <dd>{offer.text}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <ShapedImage src={product.image} alt={product.alt} className={styles.productImage} />
          </div>
        </Section>
      )}

      {team && (
        <Section id="the-team" title={team.title} intro={team.intro}>
          {team.image ? (
            <ContentImage className={styles.groupPhoto} src={team.image} alt={team.alt} />
          ) : (
            <Placeholder ratio="1200 / 380" />
          )}
          <ul className={styles.people}>
            {(team.people ?? []).map((person, i) => (
              <li key={i}>
                <PersonCard person={person} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {impact && (
        <Section id="our-impact" title={impact.title} intro={impact.intro} background="sun">
          <div className={styles.numbers}>
            <BigNumbers items={impact.numbers} size="sm" />
          </div>
          <div className={styles.impactCards}>
            <InfoCards items={impact.cards} columns={2} />
          </div>
        </Section>
      )}

      {ibf && (
        <Section id="collaboration-ibf" background="sky">
          <div className={styles.split}>
            <div className={styles.stack}>
              <h2 className={styles.h2}>{ibf.title}</h2>
              {ibf.body && <p>{ibf.body}</p>}
              <div>
                <LinkButton url={ibf.url} label={ibf.linkLabel} variant="secondary" />
              </div>
            </div>
            {ibf.logo && <ContentImage className={styles.ibfLogo} src={ibf.logo} alt="Indonesia Biru Foundation" />}
          </div>
        </Section>
      )}

      {plans && (
        <Section id="future-plans" title={plans.title} background="lagoon">
          <InfoCards items={plans.items} columns={4} />
        </Section>
      )}

      {(workshop || contact) && (
        <Section id="workshop">
          <div className={styles.split}>
            {workshop && (
              <div className={`${styles.stack} ${styles.centerText}`}>
                <h2 className={styles.h2}>{workshop.title}</h2>
                {workshop.body && <p>{workshop.body}</p>}
                <div>
                  <LinkButton url={workshop.url} label={workshop.buttonLabel} />
                </div>
              </div>
            )}
            {contact && (
              <aside id="contact" className={styles.contact} aria-labelledby="contact-title">
                <h2 id="contact-title" className={styles.contactTitle}>
                  {contact.title}
                </h2>
                <span className={styles.contactShape} aria-hidden="true" />
                <div className={styles.contactCard}>
                  {contact.name && <Label>{contact.name}</Label>}
                  {contact.phone && <p className={styles.contactLine}>{contact.phone}</p>}
                  {contact.email && (
                    <p className={styles.contactLine}>
                      {contact.email.includes('@') ? <a href={`mailto:${contact.email}`}>{contact.email}</a> : contact.email}
                    </p>
                  )}
                </div>
              </aside>
            )}
          </div>
        </Section>
      )}
    </div>
  );
}
