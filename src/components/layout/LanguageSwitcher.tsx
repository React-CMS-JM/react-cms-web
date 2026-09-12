import { useLocale } from '../../context/LocaleContext';

export function LanguageSwitcher() {
  const { language, setLanguage, languages } = useLocale();

  return (
    <div className="language-switcher" role="group" aria-label="Language">
      {languages.map((lang) => (
        <button
          key={lang.code}
          type="button"
          className={`language-switcher-btn ${language === lang.code ? 'active' : ''}`}
          onClick={() => setLanguage(lang.code)}
        >
          {lang.code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
