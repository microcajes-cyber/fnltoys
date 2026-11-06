import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  chooseVariant,
  fieldsFor,
  optionValues,
  variantLabel,
} from '../src/lib/catalog-options.ts';
import type { Family, OptionKey } from '../src/lib/catalog.ts';
const catalog = JSON.parse(
  readFileSync(new URL('../src/data/playroom-catalog.json', import.meta.url), 'utf8')
);
const families: Family[] = catalog.families;

for (const family of families) {
  test(
    family.slug +
      ': every selector transition resolves to a recorded row and preserves upstream choices',
    () => {
      assert.equal(new Set(family.variants.map((row) => row.id)).size, family.variants.length);
      for (const active of family.variants) {
        const fields = fieldsFor(family);
        for (const [index, field] of fields.entries()) {
          for (const value of optionValues(family, active, field.key)) {
            const result = chooseVariant(family, active, field.key, value);
            assert.ok(family.variants.includes(result));
            assert.equal(result[field.key], value);
            for (const upstream of fields.slice(0, index))
              assert.equal(result[upstream.key], active[upstream.key]);
            assert.ok(variantLabel(family, result).length > 0);
          }
        }
      }
    }
  );
  test(family.slug + ': every recorded row remains reachable through its selector values', () => {
    for (const target of family.variants) {
      let selected = family.variants[0];
      for (const field of fieldsFor(family)) {
        assert.ok(optionValues(family, selected, field.key).includes(target[field.key]));
        selected = chooseVariant(family, selected, field.key, target[field.key]);
      }
      for (const field of fieldsFor(family)) assert.equal(selected[field.key], target[field.key]);
    }
  });
}
test('snapshot contains six families and 206 recorded variations', () => {
  assert.equal(families.length, 6);
  assert.equal(
    families.reduce((total, family) => total + family.variants.length, 0),
    206
  );
  assert.ok(families.every((family) => family.variants.every((row) => row.status)));
});
test('Party Fence does not offer a playmat for a configuration without a recorded mat combination', () => {
  const family = families.find((item) => item.slug === 'party-fence')!;
  const selected = family.variants.find((row) => row.panel === '6+2' && row.color === 'Blue')!;
  assert.deepEqual(optionValues(family, selected, 'option'), ['Without playmat']);
  assert.equal(chooseVariant(family, selected, 'option', 'With playmat'), selected);
});
test('invalid option changes leave a valid selection intact', () => {
  for (const family of families) {
    for (const field of fieldsFor(family))
      assert.equal(
        chooseVariant(family, family.variants[0], field.key, '__invalid__'),
        family.variants[0]
      );
    assert.equal(
      chooseVariant(family, family.variants[0], '__invalid__' as OptionKey, 'Blue'),
      family.variants[0]
    );
  }
});
