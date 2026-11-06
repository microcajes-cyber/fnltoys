'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { Family, OptionKey, Variant } from '@/lib/catalog';
import { chooseVariant, fieldsFor, optionValues, variantLabel } from '@/lib/catalog-options';
import { accentStyle, CategoryArt, Icon, imagePath } from './Art';
import Modal from './Modal';
import StoreChooser from './StoreChooser';

export default function ProductExplorer({ family }: { family: Family }) {
  const [selected, setSelected] = useState(family.variants[0]);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [filters, setFilters] = useState<Partial<Record<OptionKey, string>>>({});
  const [visibleCount, setVisibleCount] = useState(8);
  const [notice, setNotice] = useState('');
  const fields = fieldsFor(family);
  const galleryKeys = family.galleryKeys.filter((key) => imagePath(key));
  const photo = galleryKeys[galleryIndex];
  const caption = photo
    ? `${/manual/i.test(photo) ? 'Assembly illustration' : 'Representative product photo'} · ${family.galleryLabels[galleryIndex] || 'Family reference'}`
    : 'Illustrative collection icon';
  const label = variantLabel(family, selected);
  const filtered = family.variants.filter((row) =>
    fields.every((field) => !filters[field.key] || row[field.key] === filters[field.key])
  );
  useEffect(() => {
    const restore = () => {
      const id = new URLSearchParams(window.location.search).get('variant');
      const row = family.variants.find((variant) => variant.id === id);
      setSelected(row || family.variants[0]);
      setNotice(
        id && !row
          ? 'That option is not in this catalog snapshot. Showing the first recorded option.'
          : ''
      );
    };
    restore();
    window.addEventListener('popstate', restore);
    return () => window.removeEventListener('popstate', restore);
  }, [family]);
  function select(row: Variant) {
    setSelected(row);
    setNotice('');
    const url = new URL(window.location.href);
    url.searchParams.set('variant', row.id);
    window.history.pushState(null, '', url);
  }
  return (
    <>
      <section className="container" id="product-gallery">
        <div className="product-layout">
          <div className="gallery-area">
            {photo ? (
              <>
                <button
                  type="button"
                  className={`gallery-main ${/manual/i.test(photo) ? 'manual-image' : ''}`}
                  style={accentStyle(family.accent)}
                  onClick={() => setZoom(true)}
                  aria-label={`Enlarge ${family.galleryLabels[galleryIndex] || family.name}`}
                >
                  <Image
                    src={imagePath(photo)}
                    alt={`${caption} for ${family.name}`}
                    width={900}
                    height={700}
                  />
                  <span className="zoom-corner">
                    <Icon name="zoom" size={18} />
                  </span>
                </button>
                <p className="media-note">
                  <Icon name="info" size={14} />
                  <span>{caption}. Photos for the exact selected option may differ.</span>
                </p>
                <div className="gallery-thumbs" aria-label="Product image gallery">
                  {galleryKeys.map((key, index) => (
                    <button
                      type="button"
                      className="gallery-thumb"
                      key={key}
                      aria-pressed={index === galleryIndex}
                      aria-label={`Show ${family.galleryLabels[index] || 'reference image'}`}
                      onClick={() => setGalleryIndex(index)}
                    >
                      <Image src={imagePath(key)} alt="" width={100} height={90} loading="lazy" />
                      <span>{family.galleryLabels[index] || 'Family reference'}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="gallery-main" style={accentStyle(family.accent)}>
                  <div className="gallery-placeholder">
                    <CategoryArt slug={family.slug} size={145} />
                    <div>
                      <strong>{family.name}</strong>
                      <p>Product photography is being prepared.</p>
                    </div>
                  </div>
                </div>
                <p className="media-note">
                  <Icon name="info" size={14} />
                  Illustrative collection icon. Confirm the product appearance in the official
                  store.
                </p>
              </>
            )}
          </div>
          <aside className="selection-panel" aria-labelledby="choose-options-title">
            <p className="eyebrow">Make it yours</p>
            <h2 id="choose-options-title">Choose your variation.</h2>
            <p className="selection-intro">
              Find the combination you want to take a closer look at.
            </p>
            {fields.map((field) => (
              <div className="option-field" key={field.key}>
                <label htmlFor={`option-${field.key}`}>{field.label}</label>
                <div className="select-wrap">
                  <select
                    id={`option-${field.key}`}
                    value={selected[field.key]}
                    onChange={(event) =>
                      select(chooseVariant(family, selected, field.key, event.target.value))
                    }
                  >
                    {optionValues(family, selected, field.key).map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                  <Icon name="chevron" size={16} />
                </div>
              </div>
            ))}
            <div
              className="selection-summary"
              aria-label="Current selection"
              aria-live="polite"
              aria-atomic="true"
            >
              <span className="summary-label">
                <Icon name="check" size={14} />
                Your selection
              </span>
              <strong>{family.name}</strong>
              <p>{label}</p>
            </div>
            <div className="selection-action">
              <StoreChooser family={family.name} selection={label} className="button wide" />
            </div>
            <p className="selection-footnote">
              Catalog snapshot: 5 Nov 2026. Options await final verification. Confirm the exact
              contents, dimensions, availability, and order quantity in the store.
            </p>
            {notice ? (
              <p className="selection-footnote" role="status">
                {notice}
              </p>
            ) : null}
          </aside>
        </div>
        <section className="section catalog-section" id="variations">
          <div className="catalog-topline">
            <div>
              <p className="eyebrow">Find your combination</p>
              <h2>The variation gallery.</h2>
            </div>
            <span className="count-pill" aria-live="polite">
              {filtered.length} of {family.variants.length} recorded options
            </span>
          </div>
          <div className={`variant-filters ${fields.length === 2 ? 'two-fields' : ''}`}>
            {fields.map((field) => (
              <div className="option-field" key={field.key}>
                <label htmlFor={`browse-${field.key}`}>{field.label}</label>
                <div className="select-wrap">
                  <select
                    id={`browse-${field.key}`}
                    value={filters[field.key] || ''}
                    onChange={(event) => {
                      setFilters((previous) => ({ ...previous, [field.key]: event.target.value }));
                      setVisibleCount(8);
                    }}
                  >
                    <option value="">All {field.label.toLowerCase()} options</option>
                    {[...new Set(family.variants.map((row) => row[field.key]))]
                      .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
                      .map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                  </select>
                  <Icon name="chevron" size={16} />
                </div>
              </div>
            ))}
            <button
              type="button"
              className="reset-filters"
              onClick={() => {
                setFilters({});
                setVisibleCount(8);
              }}
            >
              Reset filters
            </button>
          </div>
          <div className="variation-grid">
            {filtered.slice(0, visibleCount).map((row) => (
              <button
                type="button"
                className="variation-card"
                id={`variant-${row.id}`}
                key={row.id}
                aria-pressed={selected.id === row.id}
                aria-label={`Select ${variantLabel(family, row)}`}
                style={accentStyle(family.accent)}
                onClick={() => select(row)}
              >
                <div className="variation-card-top">
                  <CategoryArt slug={family.slug} size={39} />
                  <span className="variant-check">
                    <Icon name="check" size={14} />
                  </span>
                </div>
                <div className="variation-card-copy">
                  <strong>
                    {family.slug.endsWith('-fence') ? `${row.color} · ${row.panel}` : row.option}
                  </strong>
                  <span>{family.slug.endsWith('-fence') ? row.option : row.color}</span>
                  <span className="variation-link">
                    {selected.id === row.id ? 'Selected' : 'Choose this option'}
                  </span>
                </div>
              </button>
            ))}
          </div>
          {filtered.length === 0 ? (
            <p className="gallery-empty" role="status">
              No recorded options match these filters. Try another combination or reset the filters.
            </p>
          ) : null}
          {filtered.length > visibleCount ? (
            <div className="more-variations">
              <button
                type="button"
                className="button secondary"
                onClick={() => {
                  const firstNew = filtered[visibleCount]?.id;
                  setVisibleCount((count) => count + 8);
                  if (firstNew)
                    requestAnimationFrame(() =>
                      document.getElementById(`variant-${firstNew}`)?.focus()
                    );
                }}
              >
                Show more options <Icon name="plus" size={17} />
              </button>
            </div>
          ) : null}
          <p className="catalog-note">
            Cards describe recorded configurations. Product photographs are representative unless
            otherwise labeled. Recorded options do not establish current stock.
          </p>
        </section>
      </section>
      <div className="mobile-purchase">
        <div className="mobile-purchase-copy">
          <span>Your selection</span>
          <strong>{label}</strong>
        </div>
        <StoreChooser family={family.name} selection={label} />
      </div>
      <Modal
        open={zoom}
        onClose={() => setZoom(false)}
        title={`${family.name} enlarged reference image`}
        closeLabel="Close enlarged image"
        className="dialog image-dialog"
      >
        {photo ? (
          <>
            <Image
              src={imagePath(photo)}
              alt={`${caption} for ${family.name}`}
              width={1600}
              height={1200}
              unoptimized
            />
            <p>{caption}</p>
          </>
        ) : null}
      </Modal>
    </>
  );
}
