import source from '../data/playroom-catalog.json';

export type OptionKey = 'color' | 'panel' | 'option';
export type Variant = {
  id: string;
  color: string;
  panel: string;
  option: string;
  match: string;
  status: string;
};
export type Family = Omit<(typeof source.families)[number], 'variants'> & { variants: Variant[] };
export type Collection = Pick<Family, 'slug' | 'name'>;
export const families: Family[] = source.families;
export const collections: Collection[] = families.map(({ slug, name }) => ({ slug, name }));
export const SITE_URL = 'https://www.fnltoys.ph';
export const snapshotDate = source.snapshotDate;
