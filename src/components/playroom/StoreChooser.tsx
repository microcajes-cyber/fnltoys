'use client';
import { useState } from 'react';
import Modal from './Modal';
import { Icon } from './Art';

export const stores = [
  { name: 'Shopee', letter: 'S', url: 'https://shopee.ph/fnl_toys', className: '' },
  { name: 'TikTok', letter: 'T', url: 'https://www.tiktok.com/@fnltoys', className: 'tiktok' },
  {
    name: 'Lazada',
    letter: 'L',
    url: 'https://www.lazada.com.ph/shop/fnl-toys',
    className: 'lazada',
  },
];

export default function StoreChooser({
  family,
  selection,
  label = 'Choose a store',
  className = 'button',
}: {
  family?: string;
  selection?: string;
  label?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {label} <Icon name="arrow" size={17} />
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Choose an official store"
        closeLabel="Close store chooser"
      >
        <p className="eyebrow">FNL official stores</p>
        <h2>Where would you like to shop?</h2>
        <p className="dialog-intro">
          Choose your preferred marketplace and confirm the exact variation there.
        </p>
        {family && selection ? (
          <div className="dialog-selection">
            <strong>{family}</strong>
            <span>{selection}</span>
          </div>
        ) : null}
        <div className="store-links">
          {stores.map((store) => (
            <a
              className="store-link"
              key={store.name}
              href={store.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className={`store-letter ${store.className}`}>{store.letter}</span>View on{' '}
              {store.name}
              <Icon name="external" size={17} />
            </a>
          ))}
        </div>
        <p className="dialog-small">
          These links open the official shop or profile. Your selection is not transferred
          automatically. Confirm the configuration, availability, price, and order quantity in the
          marketplace.
        </p>
      </Modal>
    </>
  );
}
