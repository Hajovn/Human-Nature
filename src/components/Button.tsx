import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Link } from '../i18n/locale';
import styles from './Button.module.css';

// Primary button (DESIGN.md §4.3, states §8.6). Renders a router Link for `to`, an <a>
// for `href`, otherwise a <button>.
//   size "sm": 30–36px tall (nav Log in, theme hero)   "md": 45px (default)
//   size "xl": large CTA, 89px tall, 36px label        wide: 294px min width
type Common = {
  children: ReactNode;
  size?: 'sm' | 'md' | 'xl';
  wide?: boolean;
  className?: string;
};

type ButtonProps =
  | (Common & { to: string } & Omit<ComponentPropsWithoutRef<typeof Link>, 'to' | 'className' | 'children'>)
  | (Common & { href: string } & Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'className' | 'children'>)
  | (Common & Omit<ComponentPropsWithoutRef<'button'>, 'className' | 'children'>);

export function Button(props: ButtonProps) {
  const { children, size = 'md', wide = false, className, ...rest } = props;
  const cls = [styles.button, styles[size], wide && styles.wide, className].filter(Boolean).join(' ');

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
