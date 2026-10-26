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
      return <ShapedImage src={block.image} alt={block.alt} shape={block.shape} source={block.source} />;

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

/** One CMS section: background, title, intro, then stacked or two-column blocks. */
export function ContentSection({ section, index }: { section: Section; index: number }) {
  const split = section.layout === 'split' && !!section.aside?.length;
  return (
    <SectionShell id={sectionId(section, index)} title={section.title} intro={section.intro} background={section.background}>
      {split ? (
        <div className={styles.split}>
          <Blocks blocks={section.blocks} />
          <Blocks blocks={section.aside} />
        </div>
      ) : (
        <Blocks blocks={section.blocks} />
      )}
    </SectionShell>
  );
}
