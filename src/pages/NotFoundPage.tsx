import { Button } from '../components/Button';
import { PageIntro } from '../components/ui';
import { useDocumentTitle } from '../lib/useDocumentTitle';

export default function NotFoundPage() {
  useDocumentTitle('Page not found');
  return (
    <>
      <PageIntro title="Page not found">We couldn't find this page. It may have moved.</PageIntro>
      <div className="container">
        <Button to="/">Go to the home page</Button>
      </div>
    </>
  );
}
