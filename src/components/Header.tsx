import { useEffect, useId, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { useLocation } from 'react-router-dom';
import { navGroups, type NavGroup } from '../content/site';
import { useThemes } from '../content/useContent';
import { LanguageSwitch } from '../i18n/LanguageSwitch';
import { Link, stripLocale, useT } from '../i18n/locale';
import { useAuth } from '../lib/auth';
import avatar from '../assets/img/avatar.webp';
import { Avatar } from './Avatar';
import { Button } from './Button';
import { Icon } from './Icon';
import { Logo } from './Logo';
import styles from './Header.module.css';

/** ms a hover-opened dropdown stays open after the mouse leaves it. */
const HOVER_CLOSE_DELAY = 200;

// Header / main navigation (DESIGN.md §4.1, Figma 196:7): one sky bar on every page.
// Logo · Themes / Materials / Our mission (dropdowns) · ID | EN · Log in or avatar.
// Below 1024px: logo · ID | EN · menu button.
export function Header() {
  const { pathname } = useLocation();
  const path = stripLocale(pathname);
  const t = useT();
  const groups = navGroups(t, useThemes());
  const { account: user } = useAuth();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const mobileId = useId();

  // The bar sticks to the top: it slides away while scrolling down and comes back as soon
  // as the visitor scrolls up (DESIGN.md §4.1).
  const [tucked, setTucked] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    // Browsers send at most one scroll event per frame, so no extra throttling is needed.
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - last;
      if (y < 120) setTucked(false);
      else if (delta > 6) setTucked(true);
      else if (delta < -6) setTucked(false);
      setScrolled(y > 0);
      if (Math.abs(delta) > 6 || y < 120) last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  // Never hide it while a menu is open or while it has keyboard focus.
  const hidden = tucked && !openGroup && !mobileOpen;

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

  // Hover (mouse only): open a dropdown when the pointer enters its menu item, close it
  // shortly after the pointer leaves, so moving from the label down to the panel doesn't
  // close it. Touch and keyboard keep using click / Enter (DESIGN.md §8.2 #3).
  const closeTimer = useRef<number | undefined>(undefined);
  const cancelClose = () => window.clearTimeout(closeTimer.current);
  useEffect(() => cancelClose, []);

  const hoverOpen = (group: string) => (e: ReactPointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    cancelClose();
    setOpenGroup(group);
  };
  const hoverClose = (e: ReactPointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpenGroup(null), HOVER_CLOSE_DELAY);
  };

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

  const isCurrent = (group: NavGroup) => path.startsWith(group.match);

  const account = user ? (
    <Link
      to="/profile"
      className={`${styles.avatarLink} ${path === '/profile' ? styles.avatarCurrent : ''}`}
      aria-current={path === '/profile' ? 'page' : undefined}
    >
      {user.profile?.avatar ? (
        <Avatar id={user.profile.avatar} size={48} className={styles.stamp} />
      ) : (
        <img src={avatar} alt="" width={36} height={36} />
      )}
      <span className="visually-hidden">
        {t('nav.myProfile')} ({user.name})
      </span>
    </Link>
  ) : (
    <Button to="/login" variant="secondary">
      {t('nav.login')}
    </Button>
  );

  return (
    <header
      className={`${styles.header} ${hidden ? styles.tucked : ''} ${scrolled ? styles.scrolled : ''}`}
      onFocus={() => setTucked(false)}
    >
      <div className={`container ${styles.bar}`}>
        <Logo />

        <div className={styles.barEnd}>
          <nav ref={navRef} className={styles.desktopNav} aria-label={t('nav.main')}>
            <ul className={styles.groups}>
              {groups.map((group) => {
                const panelId = `nav-${group.match.slice(1)}`;
                const open = openGroup === group.match;
                const current = isCurrent(group);
                return (
                  <li
                    key={group.match}
                    className={styles.group}
                    onPointerEnter={hoverOpen(group.match)}
                    onPointerLeave={hoverClose}
                  >
                    <button
                      type="button"
                      data-group={group.match}
                      className={`${styles.trigger} ${current ? styles.current : ''}`}
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={(e) => {
                        // A mouse click on a menu that hover already opened keeps it open
                        // instead of toggling it shut. Keyboard (detail 0) and touch toggle.
                        const fromHover = e.detail > 0 && window.matchMedia('(hover: hover)').matches;
                        if (open && fromHover) return;
                        setOpenGroup(open ? null : group.match);
                      }}
                    >
                      {group.label}
                      {current && <span className="visually-hidden"> {t('nav.currentSection')}</span>}
                      <Icon name="caret" size={16} className={styles.caret} />
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
          </nav>

          <LanguageSwitch />
          <div className={styles.desktopOnly}>{account}</div>

          <button
            ref={menuButtonRef}
            type="button"
            className={styles.menuButton}
            aria-expanded={mobileOpen}
            aria-controls={mobileId}
            onClick={() => setMobileOpen(true)}
          >
            <Icon name="menu" size={28} />
            <span className="visually-hidden">{t('nav.openMenu')}</span>
          </button>
        </div>
      </div>

      <div
        ref={mobilePanelRef}
        id={mobileId}
        className={styles.mobilePanel}
        hidden={!mobileOpen}
        role="dialog"
        aria-modal="true"
        aria-label={t('nav.menu')}
      >
        <div className={styles.mobileTop}>
          <Logo />
          <button type="button" className={styles.closeButton} onClick={closeMobile}>
            <Icon name="close" size={28} />
            <span className="visually-hidden">{t('nav.closeMenu')}</span>
          </button>
        </div>
        <nav aria-label={t('nav.main')}>
          {groups.map((group) => (
            <section key={group.match} className={styles.mobileGroup}>
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
              {t('nav.myProfile')}
            </Button>
          ) : (
            <Button to="/login" wide>
              {t('nav.login')}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
