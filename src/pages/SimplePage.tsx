import { PageIntro } from '../components/ui';
import { PH_PARAGRAPH } from '../content/placeholders';
import { useDocumentTitle } from '../lib/useDocumentTitle';

/** Placeholder page for footer legal links (Privacy, Terms of use). */
export default function SimplePage({ title }: { title: string }) {
  useDocumentTitle(title);
  return <PageIntro title={title}>{PH_PARAGRAPH}</PageIntro>;
}
