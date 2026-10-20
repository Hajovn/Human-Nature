import { useAsset } from '../content/assets';
import styles from './Blocks.module.css';

/** Turns a YouTube or Vimeo link into a privacy-friendly embed URL. */
export function embedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\.|^m\./, '');
    let id: string | null = null;
    if (host === 'youtu.be') id = u.pathname.slice(1);
    else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      id = u.searchParams.get('v') ?? u.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]+)/)?.[1] ?? null;
    }
    if (id) return `https://www.youtube-nocookie.com/embed/${id}?rel=0`;
    const vimeo = host === 'vimeo.com' || host === 'player.vimeo.com' ? u.pathname.match(/(\d+)/)?.[1] : null;
    if (vimeo) return `https://player.vimeo.com/video/${vimeo}?dnt=1`;
  } catch {
    // not a URL
  }
  return null;
}

/**
 * Video block: paste a YouTube or Vimeo link in the CMS. A direct video file
 * (e.g. /uploads/clip.mp4) plays with the browser's own player.
 */
export function Video({ url, title, caption }: { url?: string; title?: string; caption?: string }) {
  const resolve = useAsset();
  if (!url) return null;
  const embed = embedUrl(url);
  const label = title || caption || 'Video';
  return (
    <figure className={styles.video}>
      <div className={styles.videoFrame}>
        {embed ? (
          <iframe
            src={embed}
            title={label}
            loading="lazy"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <video src={resolve(url)} controls preload="metadata" aria-label={label} />
        )}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
