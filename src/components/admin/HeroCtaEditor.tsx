import { ColorInput } from '@mantine/core';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { IconPlus, IconX } from '../ui/Icons';
import type { LanguageCode } from '../../types/content';
import {
  createHeroCta,
  type HeroCtaButton,
} from '../../types/settings';

interface HeroCtaEditorProps {
  ctas: HeroCtaButton[];
  language: LanguageCode;
  onChange: (ctas: HeroCtaButton[]) => void;
}

export function HeroCtaEditor({ ctas, language, onChange }: HeroCtaEditorProps) {
  const updateCta = (id: string, patch: Partial<HeroCtaButton>) => {
    onChange(ctas.map((cta) => (cta.id === id ? { ...cta, ...patch } : cta)));
  };

  const updateLabel = (id: string, label: string) => {
    onChange(
      ctas.map((cta) =>
        cta.id === id
          ? { ...cta, labels: { ...cta.labels, [language]: label } }
          : cta,
      ),
    );
  };

  const removeCta = (id: string) => {
    onChange(ctas.filter((cta) => cta.id !== id));
  };

  return (
    <div className="hero-cta-editor">
      <div className="hero-cta-editor-header">
        <span className="field-label">CTA buttons</span>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => onChange([...ctas, createHeroCta(language)])}
        >
          <IconPlus /> Add CTA
        </Button>
      </div>

      {ctas.length === 0 && (
        <p className="text-muted settings-hint">No CTA buttons yet. Add one to get started.</p>
      )}

      <ul className="hero-cta-list">
        {ctas.map((cta, index) => (
          <li key={cta.id} className="hero-cta-card">
            <div className="hero-cta-card-top">
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={cta.visible}
                  onChange={() => updateCta(cta.id, { visible: !cta.visible })}
                />
                <span>Show button {index + 1}</span>
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label={`Remove CTA ${index + 1}`}
                onClick={() => removeCta(cta.id)}
              >
                <IconX />
              </Button>
            </div>

            <Input
              label={`Label (${language.toUpperCase()})`}
              value={cta.labels[language] ?? ''}
              onChange={(e) => updateLabel(cta.id, e.target.value)}
              placeholder="Button text"
            />
            <Input
              label="Link"
              value={cta.href}
              onChange={(e) => updateCta(cta.id, { href: e.target.value })}
              placeholder="/services or https://example.com"
            />

            <div className="hero-cta-colors">
              <ColorInput
                label="Text color"
                value={cta.textColor}
                onChange={(value) => updateCta(cta.id, { textColor: value || '#ffffff' })}
                format="hex"
                swatches={['#ffffff', '#04222b', '#0f172a', '#e2e8f0']}
                withEyeDropper={false}
              />
              <ColorInput
                label="Button color"
                value={cta.backgroundColor}
                onChange={(value) => updateCta(cta.id, { backgroundColor: value || '#6366f1' })}
                format="hex"
                swatches={['#6366f1', '#06b6d4', '#22c55e', '#f59e0b', '#ef4444', '#0f172a']}
                withEyeDropper={false}
              />
            </div>

            <div className="hero-cta-preview-row">
              <span className="text-muted">Preview</span>
              <span
                className="btn btn-md hero-cta-preview-btn"
                style={{ color: cta.textColor, backgroundColor: cta.backgroundColor }}
              >
                {cta.labels[language]?.trim() || 'Button'}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
