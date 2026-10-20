import { useEffect } from 'react';

const SITE = 'Human Nature';

/** Sets the browser tab title for the current page; `null` gives the site default. */
export function useDocumentTitle(title: string | null) {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE}` : `${SITE} — Climate Change Education`;
  }, [title]);
}
