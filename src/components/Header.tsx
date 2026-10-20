import { useEffect, useId, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_GROUPS, type NavGroup } from '../content/site';
import { IMAGES } from '../content/images';
import { useMockUser } from '../lib/storage';
import avatar from '../assets/img/avatar.webp';
import { Button } from './Button';
import { Icon } from './Icon';
import { Logo } from './Logo';
import styles from './Header.module.css';

// Header / main navigation (DESIGN.md §4.1, §8.2 #3–4, §8.3 #6, #13).
//   overlay: transparent, sits on top of a full-bleed hero photo (landing, themes, login)
//   strip:   100px strip showing the hero photo at 44% opacity (inner pages)
// tone "light" = the background behind the nav is light (strip, landing hero at 44%),
// so nav text is primary blue instead of white (§8.8).
export function Header({ variant, tone }: { variant: 'overlay' | 'strip'; tone: 'light' | 'photo' }) {
  const { pathname } = useLocation();
  const { user } = useMockUser();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const mobileId = useId();

  // Close menus whenever the route changes.
  useEffect(() => {
    setOpenGroup(null);
    setMobileOpen(false);
  }, [pathname]);

  // Dropdowns: close on outside click and on Escape (returning focus to the trigger).
  useEffect(() => {
    if (!openGroup) return;
    const onPointer = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenGroup(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const trigger = navRef.current?.querySelector<HTMLButtonElement>(`[data-group="${openGroup}"]`);
        setOpenGroup(null);
        trigger?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [openGroup]);

  // Mobile menu: lock page scroll, focus the panel, close on Escape.
  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    mobilePanelRef.current?.querySelector<HTMLElement>('button, a')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobile();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [mobileOpen]);

  function closeMobile() {
    setMobileOpen(false);
    menuButtonRef.current?.focus();
  }

  const isCurrent = (group: NavGroup) => pathname.startsWith(group.match);

  const account = user ? (
    <Link
      to="/profile"
      className={`${styles.avatarLink} ${pathname === '/profile' ? styles.avatarCurrent : ''}`}
      aria-current={pathname === '/profile' ? 'page' : undefined}
    >
      <img src={avatar} alt="" width={36} height={36} />
      <span className="visually-hidden">My profile ({user.name})</span>
    </Link>
  ) : (
    <Button to="/login" size="sm" className={styles.login}>
      Log in
    </Button>
  );

  return (
    <header className={`${styles.header} ${styles[variant]} ${tone === 'light' ? styles.onLight : ''}`}>
      {variant === 'strip' && (
        <div className={styles.stripBg} aria-hidden="true">
          <img src={IMAGES.heroBeachClass.src} alt="" />
        </div>
      )}

      <div className={`container ${styles.bar}`}>
        <Logo />

        <nav ref={navRef} className={styles.desktopNav} aria-label="Main">
          <ul className={styles.groups}>
            {NAV_GROUPS.map((group) => {
              const panelId = `nav-${group.match.slice(1)}`;
              const open = openGroup === group.label;
              const current = isCurrent(group);
              return (
                <li key={group.label} className={styles.group}>
                  <button
                    type="button"
                    data-group={group.label}
                    className={`${styles.trigger} ${current ? styles.current : ''}`}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenGroup(open ? null : group.label)}
                  >
                    {group.label}
                    {current && <span className="visually-hidden"> (current section)</span>}
                    <Icon name="caret" size={22} className={styles.caret} />
                  </button>
                  <ul id={panelId} className={styles.panel} hidden={!open}>
                    {group.links.map((link) => (
                      <li key={link.to}>
                        <Link to={link.to} className={styles.panelLink} onClick={() => setOpenGroup(null)}>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
          {account}
        </nav>

        <button
          ref={menuButtonRef}
          type="button"
          className={styles.menuButton}
          aria-expanded={mobileOpen}
          aria-controls={mobileId}
          onClick={() => setMobileOpen(true)}
        >
          <Icon name="menu" size={28} />
          <span className="visually-hidden">Open menu</span>
        </button>
      </div>

      <div
        ref={mobilePanelRef}
        id={mobileId}
        className={styles.mobilePanel}
        hidden={!mobileOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className={styles.mobileTop}>
          <Logo />
          <button type="button" className={styles.closeButton} onClick={closeMobile}>
            <Icon name="close" size={28} />
            <span className="visually-hidden">Close menu</span>
          </button>
        </div>
        <nav aria-label="Main">
          {NAV_GROUPS.map((group) => (
            <section key={group.label} className={styles.mobileGroup}>
              <h2 className={`${styles.mobileHeading} ${isCurrent(group) ? styles.current : ''}`}>{group.label}</h2>
              <ul>
                {group.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className={styles.mobileLink}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </nav>
        <div className={styles.mobileAccount}>
          {user ? (
            <Button to="/profile" wide>
              My profile
            </Button>
          ) : (
            <Button to="/login" wide>
              Log in
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
