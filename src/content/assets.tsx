// Image and file paths from the CMS look like "/uploads/photo.webp". On GitHub Pages the
// site lives under /<repo>/, so paths are resolved against the base URL. Inside the CMS
// preview, Decap supplies its own resolver so freshly uploaded (unsaved) images show too.
import { createContext, useContext, type ImgHTMLAttributes } from 'react';
import imageSizes from 'virtual:image-sizes';

export function resolveAsset(path: string | undefined): string {
  if (!path) return '';
  if (/^(https?:|blob:|data:)/.test(path)) return path;
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}

export const AssetContext = createContext<(path: string | undefined) => string>(resolveAsset);

export const useAsset = () => useContext(AssetContext);

/** <img> for CMS images: resolves the path and adds width/height (when known) to avoid layout shift. */
export function ContentImage({
  src,
  alt,
  ...rest
}: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> & { src: string | undefined; alt: string | undefined }) {
  const resolve = useAsset();
  if (!src) return null;
  const size = imageSizes[src];
  return (
    <img
      src={resolve(src)}
      alt={alt ?? ''}
      width={size?.[0]}
      height={size?.[1]}
      loading="lazy"
      decoding="async"
      {...rest}
    />
  );
}
