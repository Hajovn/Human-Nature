// Renders theme-page content blocks (src/content/types.ts → Block).
import type { Block, ListItem } from '../content/types';
import { Button } from './Button';
import { Chip, Placeholder } from './ui';
import styles from './Blocks.module.css';

function List({ items }: { items: ListItem[] }) {
  return (
    <ul className={styles.list}>
      {items.map((item, i) =>
        typeof item === 'string' ? (
          <li key={i}>{item}</li>
        ) : (
          <li key={i}>
            {item.text}
            <List items={item.children} />
          </li>
        ),
      )}
    </ul>
  );
}

export function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'text':
      return (
        <div className={styles.prose}>
          {block.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      );
    case 'list':
      return (
        <div className={styles.prose}>
          {block.intro && <p>{block.intro}</p>}
          <List items={block.items} />
        </div>
      );
    case 'image':
      return (
        <figure className={`${styles.figure} ${block.shape === 'round' ? styles.round : ''}`}>
          <img
            src={block.image.src}
            alt={block.image.alt}
            width={block.image.width}
            height={block.image.height}
            loading="lazy"
            decoding="async"
          />
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      );
    case 'imageLabel':
      return <p className={styles.imageLabel}>{block.label}</p>;
    case 'placeholder':
      return <Placeholder label={block.label} ratio={block.ratio} shape={block.shape} />;
    case 'chip':
      return <Chip>{block.label}</Chip>;
    case 'circles':
      return (
        <ul className={styles.circles} data-count={block.items.length}>
          {block.items.map((item) => (
            <li key={item.label} className={styles.circleItem}>
              {item.image ? (
                <img
                  className={styles.circleImage}
                  src={item.image.src}
                  alt={item.image.alt}
                  width={item.image.width}
                  height={item.image.height}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <Placeholder shape="round" />
              )}
              <h3 className={styles.circleLabel}>{item.label}</h3>
              {item.text && <p className={styles.circleText}>{item.text}</p>}
            </li>
          ))}
        </ul>
      );
    case 'tiles':
      return (
        <ul className={styles.tiles} data-count={block.items.length}>
          {block.items.map((item) => (
            <li key={item.title} className={styles.tile}>
              <h3 className={styles.tileTitle}>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ul>
      );
    case 'links':
      return (
        <div className={styles.links}>
          {block.items.map((item) => (
            <Button key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" wide>
              {item.label}
              <span className="visually-hidden"> (opens in a new tab)</span>
            </Button>
          ))}
        </div>
      );
    case 'split':
      return (
        <div className={styles.split}>
          <div className={styles.stack}>
            {block.left.map((b, i) => (
              <BlockView key={i} block={b} />
            ))}
          </div>
          <div className={styles.stack}>
            {block.right.map((b, i) => (
              <BlockView key={i} block={b} />
            ))}
          </div>
        </div>
      );
  }
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className={styles.stack}>
      {blocks.map((block, i) => (
        <BlockView key={i} block={block} />
      ))}
    </div>
  );
}
