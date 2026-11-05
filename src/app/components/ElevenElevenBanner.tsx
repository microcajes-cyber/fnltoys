'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

/**
 * 11.11 sale banner for the home page.
 * Visible through 15 Nov 2026 in Asia/Manila, then it hides itself.
 * Set ELEVEN_ELEVEN_SALE_ENABLED to false to take it down sooner.
 */
export const ELEVEN_ELEVEN_SALE_ENABLED = true;

/** Last calendar day the banner stays up, inclusive, in Asia/Manila. */
export const ELEVEN_ELEVEN_SALE_END_DATE = '2026-11-15';

const SHOPEE_STORE_URL = 'https://shopee.ph/fnl_toys';
const LAZADA_STORE_URL = 'https://www.lazada.com.ph/shop/fnl-toys';

const ART_ALT =
  "FNL Toys 11.11 sale artwork showing a grey play fence, a white children's bookshelf, and a white toy storage rack";

export function manilaCalendarDate(now: Date) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

/** True once Asia/Manila has moved past the sale end date. */
export function isPastElevenElevenSale(now = new Date()) {
  return manilaCalendarDate(now) > ELEVEN_ELEVEN_SALE_END_DATE;
}

function SaleCopy({ compact }: { compact: boolean }) {
  const linkClass = compact
    ? 'shimmer-btn relative inline-flex items-center justify-center overflow-hidden rounded-full px-3 py-1.5 text-[12px] font-semibold leading-none tracking-wide text-white shadow-sm transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
    : 'shimmer-btn relative inline-flex items-center justify-center overflow-hidden rounded-full px-5 py-2.5 text-sm font-semibold tracking-wide text-white shadow-sm transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2';

  const noteClass = compact
    ? 'text-[11px] font-medium leading-none text-[#243044]'
    : 'text-xs font-medium leading-none text-[#243044]';

  return (
    <div data-sale-copy={compact ? 'mobile' : 'desktop'}>
      <h2
        className={
          compact
            ? 'font-display text-[1.25rem] font-bold leading-none tracking-tight text-[#182848]'
            : 'font-display text-[clamp(1.65rem,2.6vw,3.25rem)] font-bold leading-[1.05] tracking-tight text-[#182848]'
        }
      >
        11.11 Sale
      </h2>
      <p
        className={
          compact
            ? 'mt-1.5 text-[11px] font-medium leading-snug text-[#243044]'
            : 'mt-2 max-w-[36rem] text-[clamp(0.8rem,1.05vw,1.05rem)] font-medium leading-snug text-[#243044]'
        }
      >
        Nov 11-15 · 8% OFF + vouchers ₱100 off ₱1,200 / ₱200 off ₱2,500
      </p>
      <div
        className={
          compact
            ? 'mt-2 flex flex-wrap items-start gap-1.5'
            : 'mt-4 flex flex-wrap items-start gap-3'
        }
      >
        <div
          className={
            compact ? 'flex flex-col items-start gap-1' : 'flex flex-col items-start gap-1.5'
          }
        >
          <a
            href={SHOPEE_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`${linkClass} bg-[#C2410C] focus-visible:outline-[#C2410C]`}
          >
            Shop on Shopee
          </a>
          <p className={noteClass}>Vouchers on Shopee</p>
        </div>
        <a
          href={LAZADA_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`${linkClass} bg-[#0F146D] focus-visible:outline-[#0F146D]`}
        >
          Shop on Lazada
        </a>
      </div>
    </div>
  );
}

export default function ElevenElevenBanner() {
  // Start visible so the static page matches during the sale. After mount,
  // hide once Manila is past the end date, including on an already-built page.
  const [pastEnd, setPastEnd] = useState(false);

  useEffect(() => {
    if (isPastElevenElevenSale()) setPastEnd(true);
  }, []);

  if (!ELEVEN_ELEVEN_SALE_ENABLED || pastEnd) return null;

  return (
    <section aria-label="11.11 sale" className="relative pt-16 sm:pt-20">
      {/* Continues the artwork palette under the fixed header so the photos stay fully visible. */}
      <div
        className="absolute inset-x-0 top-0 h-16 bg-[#FEEBF1] sm:h-20 md:hidden"
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 top-0 hidden h-20 md:flex" aria-hidden="true">
        <div className="h-full w-[51.875%] bg-[#FEEBF1]" />
        <div className="h-full flex-1 bg-[#E8EEF2]" />
      </div>

      <div className="relative md:hidden">
        <Image
          src="/1111-hero-mobile.webp"
          alt={ART_ALT}
          width={1080}
          height={1080}
          priority
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          className="h-auto w-full"
        />
        {/* Safe zone is the top 40% (y 0–432 of 1080), with ~64px padding at 1080. */}
        <div className="absolute inset-x-0 top-0 flex h-[40%] flex-col justify-center px-[5.93%]">
          <SaleCopy compact />
        </div>
      </div>

      <div className="relative hidden md:block">
        <Image
          src="/1111-hero-desktop.webp"
          alt={ART_ALT}
          width={1920}
          height={600}
          priority
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          className="h-auto w-full"
        />
        {/* Safe zone is the left 45% (x 0–864 of 1920), with ~80px padding at 1920. */}
        <div className="absolute inset-y-0 left-0 flex w-[45%] flex-col justify-center pl-[4.167%] pr-[4.167%]">
          <SaleCopy compact={false} />
        </div>
      </div>
    </section>
  );
}
