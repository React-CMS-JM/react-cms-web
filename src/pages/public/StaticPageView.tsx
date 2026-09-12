import { Link, useParams } from 'react-router-dom';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { useContent } from '../../context/ContentContext';
import { useUiString } from '../../hooks/useUiString';
import { UI_STRING_KEYS } from '../../types/paramUi';

export function StaticPageView() {
  const { slug } = useParams<{ slug: string }>();
  const { getLocalizedPostBySlug } = useContent();
  const t = useUiString();
  const page = slug ? getLocalizedPostBySlug(slug, 'page') : undefined;

  if (!page || page.status !== 'published') {
    return (
      <PublicLayout>
        <div className="not-found">
          <h1>{t(UI_STRING_KEYS.common_not_found_title)}</h1>
          <p>{t(UI_STRING_KEYS.common_not_found_body)}</p>
          <Link to="/">{t(UI_STRING_KEYS.common_back_home)}</Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <article className="public-article">
        <h1>{page.title}</h1>
        <div className="prose" dangerouslySetInnerHTML={{ __html: page.content }} />
      </article>
    </PublicLayout>
  );
}
