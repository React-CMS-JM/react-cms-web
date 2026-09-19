import { Button } from '../ui/Button';
import { IconChevronDown, IconChevronUp } from '../ui/Icons';
import type { VisibilityOrderItem } from '../../types/settings';

interface OrderedVisibilityListProps<T extends string> {
  items: VisibilityOrderItem<T>[];
  labels: Record<T, string>;
  onChange: (items: VisibilityOrderItem<T>[]) => void;
  /** When true, show an editable per-row item limit (homepage sections). */
  showItemLimit?: boolean;
  defaultItemLimits?: Partial<Record<T, number>>;
}

export function OrderedVisibilityList<T extends string>({
  items,
  labels,
  onChange,
  showItemLimit = false,
  defaultItemLimits,
}: OrderedVisibilityListProps<T>) {
  const move = (index: number, delta: number) => {
    const nextIndex = index + delta;
    if (nextIndex < 0 || nextIndex >= items.length) return;
    const next = [...items];
    const [row] = next.splice(index, 1);
    next.splice(nextIndex, 0, row);
    onChange(next);
  };

  const toggle = (index: number) => {
    const next = items.map((item, i) =>
      i === index ? { ...item, visible: !item.visible } : item,
    );
    onChange(next);
  };

  const setItemLimit = (index: number, raw: string) => {
    const parsed = Number.parseInt(raw, 10);
    const fallback = defaultItemLimits?.[items[index].id] ?? 6;
    const nextLimit = Number.isFinite(parsed) ? Math.min(50, Math.max(1, parsed)) : fallback;
    const next = items.map((item, i) =>
      i === index ? { ...item, itemLimit: nextLimit } : item,
    );
    onChange(next);
  };

  return (
    <ul className="ordered-visibility-list">
      {items.map((item, index) => (
        <li key={item.id} className="ordered-visibility-item">
          <label className="checkbox-item ordered-visibility-check">
            <input
              type="checkbox"
              checked={item.visible}
              onChange={() => toggle(index)}
            />
            <span>{labels[item.id]}</span>
          </label>
          {showItemLimit && (
            <label className="ordered-visibility-limit">
              <span className="text-muted">Show</span>
              <input
                type="number"
                min={1}
                max={50}
                value={item.itemLimit ?? defaultItemLimits?.[item.id] ?? 6}
                onChange={(e) => setItemLimit(index, e.target.value)}
                aria-label={`${labels[item.id]} item limit`}
              />
            </label>
          )}
          <div className="ordered-visibility-actions">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label={`Move ${labels[item.id]} up`}
              disabled={index === 0}
              onClick={() => move(index, -1)}
            >
              <IconChevronUp />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label={`Move ${labels[item.id]} down`}
              disabled={index === items.length - 1}
              onClick={() => move(index, 1)}
            >
              <IconChevronDown />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
