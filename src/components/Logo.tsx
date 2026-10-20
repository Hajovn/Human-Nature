import { Link } from 'react-router-dom';
import logo from '../assets/svg/logo.svg';
import logoLarge from '../assets/svg/logo-large.svg';

/** "human / nature" wordmark (DESIGN.md §4.1, §6.1). Links home unless `asLink` is false. */
export function Logo({ size = 'small', asLink = true }: { size?: 'small' | 'large'; asLink?: boolean }) {
  const image =
    size === 'large' ? (
      <img src={logoLarge} alt="Human Nature" width={445} height={184} />
    ) : (
      <img src={logo} alt="Human Nature" width={138} height={57} />
    );
  if (!asLink) return image;
  return (
    <Link to="/" aria-label="Human Nature, home" style={{ display: 'inline-block' }}>
      {image}
    </Link>
  );
}
