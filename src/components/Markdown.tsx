import ReactMarkdown from 'react-markdown';
import { Link } from '../i18n/locale';
import { useGlossaryMarkup } from './Glossary';

/**
 * Renders rich text written in the CMS editor (Markdown). Raw HTML is ignored.
 * Internal links stay in the visitor's language; external links open in a new tab.
 * Glossary words get their explanation on hover (Glossary.tsx).
 */
export function Markdown({ children, className }: { children: string | undefined; className?: string }) {
  const glossary = useGlossaryMarkup(children);
  if (!children?.trim()) return null;
  return (
    <div className={className}>
      <ReactMarkdown
        rehypePlugins={[glossary.rehypePlugin]}
        components={{
          span: glossary.renderSpan,
          a: ({ href = '', children: linkText }) =>
            href.startsWith('/') ? (
              <Link to={href}>{linkText}</Link>
            ) : (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {linkText}
              </a>
            ),
          // Headings inside sections start at h3 so the page outline stays correct.
          h1: ({ children: c }) => <h3>{c}</h3>,
          h2: ({ children: c }) => <h3>{c}</h3>,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
