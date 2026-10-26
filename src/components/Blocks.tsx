// Renders section blocks edited in the CMS (DESIGN.md §6.2, src/content/types.ts → Block).
import { sectionId } from '../content/load';
import type { Block, Section } from '../content/types';
import { useT } from '../i18n/locale';
import { Button } from './Button';
import { InfoCards } from './cards';
import { Markdown } from './Markdown';
import { BigNumbers, Callout, Section as SectionShell, ShapedImage } from './ui';
import { Video } from './Video';
import styles from './Blocks.module.css';

export function BlockView({ block }: { block: Block }) {
  const t = useT();
  switch (block.type) {
    case 'text':
      return <Markdown className={styles.prose}>{block.body}</Markdown>;

    case 'image':
      return (
        <ShapedImage
          src={block.image}
          alt={block.alt}
          shape={block.shape}
          source={block.source}
          className={styles[`size-${block.size || (block.shape === 'circle' ? 'small' : 'natural')}`]}
        />
      );

    case 'callout':
      return (
        <Callout kind={block.kind ?? 'teacher-tip'} label={block.label} title={block.title}>
          <Markdown className={styles.calloutText}>{block.body}</Markdown>
        </Callout>
      );

    case 'bigNumbers':
      return <BigNumbers items={block.items} />;

    case 'numberedCards':
      return <InfoCards items={block.items} columns={Math.min(block.items?.length ?? 4, 4)} numbered />;

    case 'infoCards':
      return <InfoCards items={block.items} columns={Number(block.columns ?? 3)} />;

    case 'quote':
      return (
        <figure className={styles.quote}>
          <blockquote>
            <Markdown className={styles.quoteText}>{block.quote}</Markdown>
          </blockquote>
          {block.attribution && <figcaption className={styles.attribution}>{block.attribution}</figcaption>}
          {block.image && <ShapedImage src={block.image} alt={block.alt} shape="circle" className={styles.quoteImage} />}
        </figure>
      );

    case 'links':
      return (
        <div className={styles.links}>
          {(block.items ?? []).map((item, i) =>
            item.url?.startsWith('/') ? (
              <Button key={i} to={item.url} variant={item.style ?? 'secondary'}>
                {item.label}
              </Button>
            ) : (
              <Button key={i} href={item.url} variant={item.style ?? 'secondary'} target="_blank" rel="noopener noreferrer">
                {item.label}
                <span className="visually-hidden"> {t('a11y.newTab')}</span>
              </Button>
            ),
          )}
        </div>
      );

    case 'video':
      return <Video url={block.url} title={block.title} caption={block.caption} />;

    default:
      return null;
  }
}

export function Blocks({ blocks }: { blocks: Block[] | undefined }) {
  if (!blocks?.length) return null;
  return (
    <div className={styles.stack}>
      {blocks.map((block, i) => (
        <BlockView key={i} block={block} />
      ))}
    </div>
  );
}

/**
 * One CMS section: background, title, intro, then stacked or two-column blocks.
 * "split-title" puts the title in the left column; "joinPrevious" continues the section
 * above without a title or gap.
 */
export function ContentSection({ section, index }: { section: Section; index: number }) {
  const split = !!section.layout && section.layout !== 'stack' && !!section.aside?.length;
  const titleInColumn = split && section.layout === 'split-title';
  const join = !!section.joinPrevious;
  const id = join ? undefined : sectionId(section, index);
  const headingId = id ? `${id}-title` : undefined;
  return (
    <SectionShell
      id={id}
      title={join || titleInColumn ? undefined : section.title}
      intro={join || titleInColumn ? undefined : section.intro}
      background={section.background}
      flushTop={join}
      className={join ? styles.joined : undefined}
    >
      {split ? (
        <div className={`${styles.split} ${section.layout === 'split-wide' ? styles.splitWide : ''}`}>
          <div className={styles.column}>
            {titleInColumn && (section.title || section.intro) && (
              <div className={styles.columnHead}>
                {section.title && (
                  <h2 id={headingId} className={styles.h2}>
                    {section.title}
                  </h2>
                )}
                {section.intro && <p className={styles.intro}>{section.intro}</p>}
              </div>
            )}
            <Blocks blocks={section.blocks} />
          </div>
          <Blocks blocks={section.aside} />
        </div>
      ) : (
        <Blocks blocks={section.blocks} />
      )}
    </SectionShell>
  );
}
