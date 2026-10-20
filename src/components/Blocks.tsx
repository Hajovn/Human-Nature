// Renders section blocks edited in the CMS (src/content/types.ts → Block).
import { ContentImage } from '../content/assets';
import { useT } from '../i18n/locale';
import type { Block } from '../content/types';
import { Button } from './Button';
import { Markdown } from './Markdown';
import { Chip, Placeholder } from './ui';
import { Video } from './Video';
import styles from './Blocks.module.css';

export function BlockView({ block }: { block: Block }) {
  const t = useT();
  switch (block.type) {
    case 'text':
      return <Markdown className={styles.prose}>{block.body}</Markdown>;

    case 'image':
      if (!block.image) return <Placeholder label={block.caption || t('block.image')} />;
      return (
        <figure className={`${styles.figure} ${block.round ? styles.round : ''}`}>
          <ContentImage src={block.image} alt={block.alt} />
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      );

    case 'video':
      return <Video url={block.url} title={block.title} caption={block.caption} />;

    case 'imageText':
      return (
        <div className={`${styles.split} ${block.imagePosition === 'right' ? styles.imageRight : ''}`}>
          <figure className={styles.figure}>
            {block.image ? <ContentImage src={block.image} alt={block.alt} /> : <Placeholder label={t('block.image')} />}
            {block.caption && <figcaption>{block.caption}</figcaption>}
          </figure>
          <Markdown className={styles.prose}>{block.body}</Markdown>
        </div>
      );

    case 'circles': {
      const items = block.items ?? [];
      return (
        <ul className={styles.circles} data-count={items.length}>
          {items.map((item, i) => (
            <li key={i} className={styles.circleItem}>
              {item.image ? (
                <ContentImage className={styles.circleImage} src={item.image} alt={item.alt} />
              ) : (
                <Placeholder shape="round" />
              )}
              {item.label && <h3 className={styles.circleLabel}>{item.label}</h3>}
              {item.text && <p className={styles.circleText}>{item.text}</p>}
            </li>
          ))}
        </ul>
      );
    }

    case 'tiles': {
      const items = block.items ?? [];
      return (
        <ul className={styles.tiles} data-count={items.length}>
          {items.map((item, i) => (
            <li key={i} className={styles.tile}>
              {item.title && <h3 className={styles.tileTitle}>{item.title}</h3>}
              {item.text && <p>{item.text}</p>}
              {item.linkUrl && (
                <Button href={item.linkUrl} target="_blank" rel="noopener noreferrer" className={styles.tileLink}>
                  {item.linkLabel || item.linkUrl}
                  <span className="visually-hidden"> {t('a11y.newTab')}</span>
                </Button>
              )}
            </li>
          ))}
        </ul>
      );
    }

    case 'chip':
      return block.label ? <Chip>{block.label}</Chip> : null;

    case 'placeholder':
      return <Placeholder label={block.label} ratio={block.ratio} />;

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
