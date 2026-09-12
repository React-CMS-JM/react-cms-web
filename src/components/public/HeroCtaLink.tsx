import { Link } from 'react-router-dom';
import {
  isExternalHref,
  resolveHeroCtaLabel,
  type HeroCtaButton,
} from '../../types/settings';
import type { LanguageCode } from '../../types/content';

interface HeroCtaLinkProps {
  cta: HeroCtaButton;
  language: LanguageCode;
}

export function HeroCtaLink({ cta, language }: HeroCtaLinkProps) {
  const label = resolveHeroCtaLabel(cta, language);
  const href = cta.href.trim() || '/';
  const className = 'btn btn-md hero-cta-btn';
  const style = {
    color: cta.textColor,
    backgroundColor: cta.backgroundColor,
  };

  if (isExternalHref(href)) {
    const absolute = href.startsWith('//') ? `https:${href}` : href;
    return (
      <a
        href={absolute}
        className={className}
        style={style}
        target="_blank"
        rel="noopener noreferrer"
      >
        {label}
      </a>
    );
  }

  const to = href.startsWith('/') ? href : `/${href}`;
  return (
    <Link to={to} className={className} style={style}>
      {label}
    </Link>
  );
}
