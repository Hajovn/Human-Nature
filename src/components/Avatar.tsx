import { useId, useState } from 'react';
import { AVATAR_IDS, avatarSrc, type AvatarId } from '../content/avatars';
import { useT } from '../i18n/locale';
import { authErrorKey, useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { Button } from './Button';
import { Message, useBusy } from './Form';
import styles from './Avatar.module.css';

// Profile avatars: animal stamps in a rounded square (DESIGN.md §5.8).

/** The teacher's animal stamp. Decorative: the name is given by the text around it. */
export function Avatar({ id, size, className }: { id: string | null | undefined; size: number; className?: string }) {
  const src = avatarSrc(id);
  if (!src) return <span className={`${styles.avatar} ${styles.empty} ${className ?? ''}`} style={{ width: size, height: size }} aria-hidden="true" />;
  return <img className={`${styles.avatar} ${className ?? ''}`} src={src} alt="" width={size} height={size} />;
}

/** Avatar on the profile card, with a button that opens the choice of 18 animals. */
export function AvatarChooser({ accountId, current }: { accountId: string; current: string }) {
  const t = useT();
  const { refreshProfile } = useAuth();
  const { busy, run } = useBusy();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(current);
  const [result, setResult] = useState<{ tone: 'success' | 'error'; text: string } | null>(null);
  const panelId = useId();
  const name = (id: string) => t(`avatar.${id as AvatarId}`);

  async function choose(id: AvatarId) {
    setSelected(id);
    setResult(null);
    const { error } = await run(() => supabase!.from('profiles').update({ avatar: id }).eq('id', accountId));
    if (error) {
      setSelected(current);
      return setResult({ tone: 'error', text: t(authErrorKey(error)) });
    }
    await refreshProfile();
    setResult({ tone: 'success', text: t('avatar.saved') });
  }

  return (
    <div className={styles.chooser}>
      <Avatar id={selected} size={119} />
      <p className={styles.current}>{t('avatar.current', { name: name(selected) })}</p>
      <Button size="sm" variant="secondary" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((o) => !o)}>
        {t('avatar.change')}
      </Button>
      <fieldset id={panelId} className={styles.panel} hidden={!open} disabled={busy}>
        <legend className={styles.legend}>{t('avatar.title')}</legend>
        <p className={styles.intro}>{t('avatar.intro')}</p>
        <div className={styles.grid}>
          {AVATAR_IDS.map((id) => (
            <label key={id} className={styles.option} title={name(id)}>
              <input
                type="radio"
                name="avatar"
                value={id}
                checked={selected === id}
                onChange={() => void choose(id)}
                className={styles.radio}
              />
              <img src={avatarSrc(id)} alt="" width={56} height={56} loading="lazy" />
              <span className="visually-hidden">{name(id)}</span>
            </label>
          ))}
        </div>
        {result && (
          <Message tone={result.tone}>
            <p>{result.text}</p>
          </Message>
        )}
        <div>
          <Button size="sm" onClick={() => setOpen(false)}>
            {t('avatar.close')}
          </Button>
        </div>
      </fieldset>
    </div>
  );
}
