import type { Family, OptionKey, Variant } from './catalog';

export function fieldsFor(family: Pick<Family, 'slug'>): { key: OptionKey; label: string }[] {
  if (family.slug.endsWith('-fence'))
    return [
      { key: 'color', label: 'Color' },
      { key: 'panel', label: 'Panel set' },
      { key: 'option', label: family.slug === 'party-fence' ? 'Playmat option' : 'Bundle' },
    ];
  if (family.slug === 'ocean-balls')
    return [
      { key: 'color', label: 'Color' },
      { key: 'option', label: 'Balls per pack' },
    ];
  if (family.slug === 'carrot-bookshelf')
    return [
      { key: 'option', label: 'Bookshelf type' },
      { key: 'color', label: 'Color group' },
    ];
  return [
    { key: 'color', label: 'Color' },
    { key: 'option', label: 'Bin configuration' },
  ];
}

export function optionValues(family: Family, selected: Variant, key: OptionKey) {
  const fields = fieldsFor(family);
  const index = fields.findIndex((field) => field.key === key);
  return [
    ...new Set(
      family.variants
        .filter((row) =>
          fields.slice(0, index).every((field) => row[field.key] === selected[field.key])
        )
        .map((row) => row[key])
    ),
  ].sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
}

// Keep upstream choices; prefer the recorded row that preserves downstream choices.
export function chooseVariant(
  family: Family,
  active: Variant,
  key: OptionKey,
  value: string
): Variant {
  const fields = fieldsFor(family);
  const index = fields.findIndex((field) => field.key === key);
  if (index < 0) return active;
  const candidates = family.variants.filter(
    (row) =>
      row[key] === value &&
      fields.slice(0, index).every((field) => row[field.key] === active[field.key])
  );
  const score = (row: Variant) =>
    fields
      .slice(index + 1)
      .reduce((total, field) => total + Number(row[field.key] === active[field.key]), 0);
  return (
    candidates.reduce<Variant | undefined>(
      (best, row) => (!best || score(row) > score(best) ? row : best),
      undefined
    ) || active
  );
}

export function variantLabel(family: Pick<Family, 'slug'>, variant: Variant) {
  return fieldsFor(family)
    .map((field) => variant[field.key])
    .filter(Boolean)
    .join(' · ');
}
