import { Button } from '../components/Button';
import { PageIntro } from '../components/ui';
import { useT } from '../i18n/locale';
import { useDocumentTitle } from '../lib/useDocumentTitle';

export default function NotFoundPage() {
  const t = useT();
  useDocumentTitle(t('notFound.title'));
  return (
    <>
      <PageIntro title={t('notFound.title')}>{t('notFound.text')}</PageIntro>
      <div className="container">
        <Button to="/">{t('notFound.home')}</Button>
      </div>
    </>
  );
}
