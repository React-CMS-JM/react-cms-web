import { Button } from '../ui/Button';
import { IconChevronDown, IconChevronUp } from '../ui/Icons';
import type { VisibilityOrderItem } from '../../types/settings';

interface OrderedVisibilityListProps<T extends string> {
  items: VisibilityOrderItem<T>[];
  labels: Record<T, string>;
  onChange: (items: VisibilityOrderItem<T>[]) => void;
}

export function OrderedVisibilityList<T extends string>({
  items,
  labels,
  onChange,
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
