/// <reference types="vite/client" />

declare module 'virtual:image-sizes' {
  /** Pixel sizes of files in public/uploads, keyed by their CMS path ("/uploads/x.webp"). */
  const sizes: Record<string, [number, number]>;
  export default sizes;
}
