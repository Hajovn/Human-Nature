import { useEffect } from 'react';
import { useT } from '../i18n/locale';

const SITE = 'Human Nature';

/** Sets the browser tab title for the current page; `null` gives the site default. */
export function useDocumentTitle(title: string | null) {
  const t = useT();
  const fallback = t('site.subtitle');
  useEffect(() => {
    document.title = title ? `${title} — ${SITE}` : `${SITE} — ${fallback}`;
  }, [title, fallback]);
}
