import { FormEvent, useEffect, useRef, useState } from 'react';
import { useContent } from '../../context/ContentContext';
import { HeroCtaEditor } from '../../components/admin/HeroCtaEditor';
import { OrderedVisibilityList } from '../../components/admin/OrderedVisibilityList';
import { SiteBrandMark } from '../../components/layout/SiteBrandMark';
import { Button } from '../../components/ui/Button';
import { HtmlEditor } from '../../components/ui/HtmlEditor';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Modal } from '../../components/ui/Modal';
import { resolveUiString } from '../../lib/paramUi';
import {
  DEFAULT_HOME_SECTION_LIMITS,
  DEFAULT_HOME_SECTIONS,
  DEFAULT_MAIN_MENU,
  HOME_SECTION_LABELS,
  MAIN_MENU_LABELS,
  resolveHomeHero,
  type HomeHeroSettings,
  type HomeSectionId,
  type MainMenuItemId,
  type VisibilityOrderItem,
} from '../../types/settings';
import { UI_STRING_KEYS } from '../../types/paramUi';

const MAX_ICON_BYTES = 256 * 1024;
const ICON_ACCEPT =
  'image/png,image/jpeg,image/webp,image/svg+xml,image/x-icon,image/vnd.microsoft.icon,.ico';

function ensureOrder<T extends string>(
  items: VisibilityOrderItem<T>[] | undefined,
  defaults: VisibilityOrderItem<T>[],
): VisibilityOrderItem<T>[] {
  if (!items?.length) return defaults.map((d) => ({ ...d }));
  const byId = new Map(items.map((item) => [item.id, item]));
  const ordered: VisibilityOrderItem<T>[] = items
    .filter((item) => defaults.some((d) => d.id === item.id))
    .map((item) => {
      const fallback = defaults.find((d) => d.id === item.id);
      return {
        id: item.id,
        visible: item.visible,
        itemLimit: item.itemLimit ?? fallback?.itemLimit,
      };
    });
  for (const fallback of defaults) {
    if (!byId.has(fallback.id)) ordered.push({ ...fallback });
  }
  return ordered;
}

export function Settings() {
  const { settings, updateSettings, resetData, data, language } = useContent();
  const iconInputRef = useRef<HTMLInputElement>(null);
  const [siteName, setSiteName] = useState(settings.siteName);
  const [siteIconUrl, setSiteIconUrl] = useState(settings.siteIconUrl ?? '');
  const [siteDescription, setSiteDescription] = useState(settings.siteDescription);
  const [postsPerPage, setPostsPerPage] = useState(settings.postsPerPage);
  const [homeSections, setHomeSections] = useState<VisibilityOrderItem<HomeSectionId>[]>(() =>
    ensureOrder(settings.homeSections, DEFAULT_HOME_SECTIONS),
  );
  const [mainMenu, setMainMenu] = useState<VisibilityOrderItem<MainMenuItemId>[]>(() =>
    ensureOrder(settings.mainMenu, DEFAULT_MAIN_MENU),
  );
  const [homeHero, setHomeHero] = useState<HomeHeroSettings>(() =>
    resolveHomeHero(settings.homeHero),
  );
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [iconError, setIconError] = useState('');
  const [saved, setSaved] = useState(false);
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    setHeroTitle(resolveUiString(data.paramUiStringI18n, UI_STRING_KEYS.hero_title, language));
    setHeroSubtitle(
      resolveUiString(data.paramUiStringI18n, UI_STRING_KEYS.hero_subtitle, language),
    );
  }, [data.paramUiStringI18n, language]);

  const handleIconChange = (file: File | undefined) => {
    setIconError('');
    if (!file) return;
    if (file.size > MAX_ICON_BYTES) {
      setIconError('Icon must be 256 KB or smaller.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setSiteIconUrl(reader.result);
    };
    reader.onerror = () => setIconError('Could not read that image file.');
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void (async () => {
      await updateSettings(
        {
          siteName,
          siteIconUrl,
          siteDescription,
          postsPerPage,
          homeHero,
          homeSections,
          mainMenu,
        },
        [
          {
            stringKey: UI_STRING_KEYS.hero_title,
            languageCode: language,
            stringValue: heroTitle,
          },
          {
            stringKey: UI_STRING_KEYS.hero_subtitle,
            languageCode: language,
            stringValue: heroSubtitle,
          },
        ],
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    })();
  };

  const handleReset = () => {
    void (async () => {
      await resetData();
      setShowReset(false);
      window.location.reload();
    })();
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Configure your site</p>
        </div>
        {saved && <span className="save-indicator">Saved</span>}
      </header>

      <form onSubmit={handleSubmit} className="settings-form settings-form-wide">
        <section className="card">
          <h2 className="card-title">General</h2>
          <Input
            label="Site Name"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            required
          />

          <div className="field">
            <span className="field-label">Site Icon</span>
            <p className="text-muted settings-hint">
              Used as the browser tab favicon and the mark next to the site name.
            </p>
            <div className="site-icon-control">
              <div className="site-icon-preview">
                <SiteBrandMark iconUrl={siteIconUrl} className="site-icon-preview-mark" alt="" />
              </div>
              <div className="site-icon-actions">
                <input
                  ref={iconInputRef}
                  type="file"
                  accept={ICON_ACCEPT}
                  className="sr-only"
                  onChange={(e) => {
                    handleIconChange(e.target.files?.[0]);
                    e.target.value = '';
                  }}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => iconInputRef.current?.click()}
                >
                  Upload icon
                </Button>
                {siteIconUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSiteIconUrl('');
                      setIconError('');
                    }}
                  >
                    Use default
                  </Button>
                )}
              </div>
            </div>
            {iconError && <span className="field-error">{iconError}</span>}
          </div>

          <Textarea
            label="Site SEO"
            value={siteDescription}
            onChange={(e) => setSiteDescription(e.target.value)}
            rows={3}
          />
          <Input
            label="Posts Per Page"
            type="number"
            min={1}
            max={50}
            value={postsPerPage}
            onChange={(e) => setPostsPerPage(Number(e.target.value))}
            required
          />
        </section>

        <section className="card">
          <h2 className="card-title">Home Hero</h2>
          <p className="text-muted settings-hint">
            Editable landing hero for the current UI language ({language.toUpperCase()}). Switch
            language in the header to edit the other locale. Toggle visibility to show or hide each
            part on the public homepage.
          </p>

          <div className="hero-field-block">
            <label className="checkbox-item hero-visibility-toggle">
              <input
                type="checkbox"
                checked={homeHero.titleVisible}
                onChange={() =>
                  setHomeHero((prev) => ({ ...prev, titleVisible: !prev.titleVisible }))
                }
              />
              <span>Show title</span>
            </label>
            <Input
              label="Title"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              required={homeHero.titleVisible}
            />
          </div>

          <div className="hero-field-block">
            <label className="checkbox-item hero-visibility-toggle">
              <input
                type="checkbox"
                checked={homeHero.subtitleVisible}
                onChange={() =>
                  setHomeHero((prev) => ({ ...prev, subtitleVisible: !prev.subtitleVisible }))
                }
              />
              <span>Show subtitle</span>
            </label>
            <HtmlEditor
              key={`hero-subtitle-${language}`}
              label="Subtitle"
              value={heroSubtitle}
              onChange={setHeroSubtitle}
              placeholder="Supporting text under the hero title…"
              minHeight={140}
            />
          </div>

          <HeroCtaEditor
            ctas={homeHero.ctas}
            language={language}
            onChange={(ctas) => setHomeHero((prev) => ({ ...prev, ctas }))}
          />
        </section>

        <section className="card">
          <h2 className="card-title">Home Sections</h2>
          <p className="text-muted settings-hint">
            Show, hide, and reorder the listing blocks on the homepage. Set how many items each
            section shows (1–50). Empty sections stay hidden even when enabled.
          </p>
          <OrderedVisibilityList
            items={homeSections}
            labels={HOME_SECTION_LABELS}
            onChange={setHomeSections}
            showItemLimit
            defaultItemLimits={DEFAULT_HOME_SECTION_LIMITS}
          />
        </section>

        <section className="card">
          <h2 className="card-title">Main Menu</h2>
          <p className="text-muted settings-hint">
            Control which public navigation links appear and in which order. Unpublished pages are
            skipped automatically.
          </p>
          <OrderedVisibilityList
            items={mainMenu}
            labels={MAIN_MENU_LABELS}
            onChange={setMainMenu}
          />
        </section>

        <Button type="submit">Save Settings</Button>
      </form>

      <section className="card card-danger">
        <h2 className="card-title">Danger Zone</h2>
        <p className="text-muted">
          Reload all content from the microservices. Local browser mock data is no longer used.
        </p>
        <Button variant="danger" type="button" onClick={() => setShowReset(true)}>
          Reload From API
        </Button>
      </section>

      <Modal
        open={showReset}
        title="Reload From API"
        onClose={() => setShowReset(false)}
        onConfirm={handleReset}
        confirmLabel="Reload"
        confirmVariant="danger"
      >
        <p>
          This reloads users, content, courses, settings, and UI strings from the API. Unsaved form
          edits in this browser will be lost.
        </p>
      </Modal>
    </div>
  );
}
