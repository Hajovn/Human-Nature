import { useMemo } from 'react';
import { Markdown } from '../components/Markdown';
import { FallbackNotice, PageIntro } from '../components/ui';
import { getPage } from '../content/load';
import type { SimplePageData } from '../content/types';
import { useLocale } from '../i18n/locale';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import blockStyles from '../components/Blocks.module.css';

/** Simple text pages from the CMS (Privacy, Terms of use). */
export default function SimplePage({ name }: { name: 'privacy' | 'terms' }) {
  const locale = useLocale();
  const { data, fallback } = useMemo(() => getPage(name, locale), [name, locale]);
  useDocumentTitle(data.title ?? null);
  return <SimpleView page={data} fallback={fallback} />;
}

/** Also used by the CMS live preview. */
export function SimpleView({ page, fallback = false }: { page: SimplePageData; fallback?: boolean }) {
  return (
    <div lang={fallback ? 'en' : undefined}>
      <PageIntro title={page.title} />
      <FallbackNotice show={fallback} />
      <div className="container">
        <Markdown className={blockStyles.prose}>{page.body}</Markdown>
      </div>
    </div>
  );
}
