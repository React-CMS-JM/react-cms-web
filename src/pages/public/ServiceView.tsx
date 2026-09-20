import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { useContent } from '../../context/ContentContext';
import { useUiString } from '../../hooks/useUiString';
import { UI_STRING_KEYS } from '../../types/paramUi';

export function ServiceView() {
  const { slug } = useParams<{ slug: string }>();
  const { getLocalizedPostBySlug, ensurePostBySlug, incrementViewCount } = useContent();
  const t = useUiString();
  const service = slug ? getLocalizedPostBySlug(slug, 'service') : undefined;
  const counted = useRef(false);
  const [resolving, setResolving] = useState(!!slug && !service);

  useEffect(() => {
    if (!slug || service) {
      setResolving(false);
      return;
    }
    let cancelled = false;
    setResolving(true);
    void ensurePostBySlug(slug, 'service').finally(() => {
      if (!cancelled) setResolving(false);
    });
    return () => {
      cancelled = true;
    };
  }, [slug, service, ensurePostBySlug]);

  useEffect(() => {
    if (service && service.status === 'published' && !counted.current) {
      counted.current = true;
      incrementViewCount(service.id);
    }
  }, [service, incrementViewCount]);

  if (resolving) {
    return (
      <PublicLayout>
        <p className="empty-state">Loading…</p>
      </PublicLayout>
    );
  }

  if (!service || service.status !== 'published') {
    return (
      <PublicLayout>
        <div className="not-found">
          <h1>{t(UI_STRING_KEYS.common_not_found_title)}</h1>
          <p>{t(UI_STRING_KEYS.common_not_found_body)}</p>
          <Link to="/services">{t(UI_STRING_KEYS.common_back_services)}</Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <article className="public-article">
        <header className="article-header">
          <h1>{service.title}</h1>
        </header>
        <div className="prose" dangerouslySetInnerHTML={{ __html: service.content }} />
      </article>
      <p className="back-link">
        <Link to="/services">{t(UI_STRING_KEYS.common_back_services)}</Link>
      </p>
    </PublicLayout>
  );
}
