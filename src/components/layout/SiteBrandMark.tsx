const DEFAULT_MARK = '◆';

interface SiteBrandMarkProps {
  iconUrl?: string;
  className?: string;
  alt?: string;
}

/** Brand mark next to the site name — custom image or default diamond. */
export function SiteBrandMark({
  iconUrl = '',
  className = '',
  alt = 'Site icon',
}: SiteBrandMarkProps) {
  if (iconUrl) {
    return <img src={iconUrl} alt={alt} className={`site-brand-mark ${className}`.trim()} />;
  }
  return <span className={className}>{DEFAULT_MARK}</span>;
}
