// Small UI icons drawn inline so they inherit currentColor. Decorative by default
// (aria-hidden); controls using them must have their own accessible name.
type IconName =
  | 'caret'
  | 'menu'
  | 'close'
  | 'eye'
  | 'eye-off'
  | 'check'
  | 'alert'
  | 'arrow-left'
  | 'arrow-right'
  | 'shuffle';

const PATHS: Record<IconName, string> = {
  caret: 'M6 9l6 6 6-6',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6L6 18',
  eye: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12zm10 3a3 3 0 100-6 3 3 0 000 6z',
  'eye-off': 'M3 3l18 18M10.6 5.1A10.9 10.9 0 0112 5c6.4 0 10 7 10 7a17.6 17.6 0 01-3.2 4.2M6.6 6.6A17.4 17.4 0 002 12s3.6 7 10 7a10 10 0 005.4-1.6M9.9 9.9a3 3 0 004.2 4.2',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  alert: 'M12 7.5v6m0 3v.5M12 3a9 9 0 100 18 9 9 0 000-18z',
  'arrow-left': 'M19 12H5m6-6l-6 6 6 6',
  'arrow-right': 'M5 12h14m-6-6l6 6-6 6',
  shuffle: 'M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5',
};

export function Icon({ name, size = 20, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
