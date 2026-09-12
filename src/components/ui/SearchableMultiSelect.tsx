import { useMemo, useState } from 'react';
import { Pill, TagsInput } from '@mantine/core';

export interface SearchableMultiSelectOption {
  value: string;
  label: string;
}

export interface SearchableMultiSelectProps {
  label?: string;
  description?: string;
  placeholder?: string;
  data: SearchableMultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  /**
   * Called when the user submits text that does not match an existing option.
   * Return the value to store (e.g. a new entity id), or null/undefined to ignore.
   */
  onCreate?: (
    query: string,
  ) => string | null | undefined | Promise<string | null | undefined>;
  clearable?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
}

/**
 * Searchable multi-select with optional create-on-submit.
 * Built on Mantine TagsInput so users can filter options by substring
 * and add a new item when nothing matches.
 */
export function SearchableMultiSelect({
  label,
  description,
  placeholder = 'Search or add…',
  data,
  value,
  onChange,
  onCreate,
  clearable = true,
  disabled,
  className = '',
  id,
}: SearchableMultiSelectProps) {
  const [createdLabels, setCreatedLabels] = useState<Record<string, string>>({});

  const valueToLabel = useMemo(() => {
    const map = new Map<string, string>();
    for (const option of data) map.set(option.value, option.label);
    for (const [v, labelText] of Object.entries(createdLabels)) {
      if (!map.has(v)) map.set(v, labelText);
    }
    return map;
  }, [data, createdLabels]);

  const labelToValue = useMemo(() => {
    const map = new Map<string, string>();
    for (const option of data) map.set(option.label.toLowerCase().trim(), option.value);
    for (const [v, labelText] of Object.entries(createdLabels)) {
      const key = labelText.toLowerCase().trim();
      if (!map.has(key)) map.set(key, v);
    }
    return map;
  }, [data, createdLabels]);

  const tagsValue = useMemo(
    () => value.map((v) => valueToLabel.get(v) ?? v),
    [value, valueToLabel],
  );

  const suggestionLabels = useMemo(() => data.map((option) => option.label), [data]);

  const handleChange = (labels: string[]) => {
    void (async () => {
      const next: string[] = [];
      const nextCreated: Record<string, string> = { ...createdLabels };

      for (const raw of labels) {
        const trimmed = raw.trim();
        if (!trimmed) continue;

        const existingValue = labelToValue.get(trimmed.toLowerCase());
        if (existingValue) {
          if (!next.includes(existingValue)) next.push(existingValue);
          continue;
        }

        if (!onCreate) continue;

        const createdValue = await onCreate(trimmed);
        if (createdValue == null || createdValue === '') continue;

        nextCreated[createdValue] = trimmed;
        if (!next.includes(createdValue)) next.push(createdValue);
      }

      setCreatedLabels(nextCreated);
      onChange(next);
    })();
  };

  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`field searchable-multi-select ${className}`.trim()}>
      <TagsInput
        id={inputId}
        label={label}
        description={description}
        placeholder={placeholder}
        data={suggestionLabels}
        value={tagsValue}
        onChange={handleChange}
        clearable={clearable}
        disabled={disabled}
        acceptValueOnBlur
        splitChars={[',']}
        renderPill={({ option, onRemove }) => (
          <Pill withRemoveButton={!disabled} onRemove={onRemove}>
            {option.label}
          </Pill>
        )}
        classNames={{
          root: 'sms-root',
          label: 'field-label',
          description: 'field-hint',
          input: 'sms-input',
          pill: 'sms-pill',
          dropdown: 'sms-dropdown',
          option: 'sms-option',
        }}
      />
    </div>
  );
}
