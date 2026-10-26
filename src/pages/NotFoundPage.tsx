import { Button } from '../components/Button';
import { PageHero, Section } from '../components/ui';
import { useT } from '../i18n/locale';
import { useDocumentTitle } from '../lib/useDocumentTitle';

export default function NotFoundPage() {
  const t = useT();
  useDocumentTitle(t('notFound.title'));
  return (
    <>
      <PageHero title={t('notFound.title')} lead={t('notFound.text')} />
      <Section>
        <Button to="/">{t('notFound.home')}</Button>
      </Section>
    </>
  );
}
