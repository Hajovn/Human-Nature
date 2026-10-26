import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Link } from '../i18n/locale';
import styles from './Button.module.css';

// Button (DESIGN.md §4.3, states §2.6). Renders a router Link for `to`, an <a> for
// `href`, otherwise a <button>.
//   variant "primary": filled, once per section · "secondary": outline · "quiet": text only
//   size "md": 48px (default) · "sm": 32px (profile card)
//   size "xl" and `wide` are left over from the old design; they render as "md" until the
//   pages that use them are rebuilt.
type Common = {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'quiet';
  size?: 'sm' | 'md' | 'xl';
  wide?: boolean;
  className?: string;
};

type ButtonProps =
  | (Common & { to: string } & Omit<ComponentPropsWithoutRef<typeof Link>, 'to' | 'className' | 'children'>)
  | (Common & { href: string } & Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'className' | 'children'>)
  | (Common & Omit<ComponentPropsWithoutRef<'button'>, 'className' | 'children'>);

export function Button(props: ButtonProps) {
  const { children, variant = 'primary', size = 'md', wide = false, className, ...rest } = props;
  const cls = [styles.button, styles[variant], size === 'sm' && styles.sm, wide && styles.wide, className]
    .filter(Boolean)
    .join(' ');

  if ('to' in rest) {
    const { to, ...linkRest } = rest;
    return (
      <Link to={to} className={cls} {...linkRest}>
        {children}
      </Link>
    );
  }
  if ('href' in rest) {
    const { href, ...aRest } = rest as { href: string } & ComponentPropsWithoutRef<'a'>;
    return (
      <a href={href} className={cls} {...aRest}>
        {children}
      </a>
    );
  }
  const buttonRest = rest as ComponentPropsWithoutRef<'button'>;
  return (
    <button type="button" className={cls} {...buttonRest}>
      {children}
    </button>
  );
}
