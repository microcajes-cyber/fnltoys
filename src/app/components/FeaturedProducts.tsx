'use client';
import React, { useState, useRef, useEffect } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface MarketplaceLinks {
  shopee: string;
  tiktok: string;
  lazada: string;
}

interface Product {
  id: string;
  name: string;
  highlight: string;
  description: string;
  features: string[];
  image: string;
  imageAlt: string;
  links: MarketplaceLinks;
}

const products: Product[] = [
{
  id: 'prod-playfence',
  name: 'Playfence',
  highlight: 'Safety First',
  description:
  'Sturdy, secure play area with anti-slip locks and baby-proof corner connectors. Customisable into any shape your space needs.',
  features: ['Non-toxic HDPE material', 'Customisable shapes', 'Safety gate lock'],
  image:
  "/assets/images/ElevenLabs_image_gpt-image-1-5_Create_me_an..._2026-03-27T10_07_56-1788325905810.png",
  imageAlt:
  'Smiling toddler inside a colourful modular play fence — bright, safe, and sturdy children\'s play area',
  links: {
    shopee: 'https://shopee.ph/%E3%80%90Foldable-Octopus-fence-%E3%80%91FNL-TOYS-thicker-bigger-playpen-10pcs-balls-and-with-adjustable-ring-toss-i.278483575.8046169224?extraParams=%7B%22display_model_id%22%3A215230801116%2C%22model_selection_logic%22%3A3%7D',
    tiktok: 'https://shop.tiktok.com/ph/pdp/1729399156499123336?encode_params=MIIBpgQMe_7PAXtHwtPJ1pQqBIIBgvpNo8DUiHhDU16D-ATNEuvxFrqHC8QdvD7y7LlypwcT8xJUeHZ97jlGGFHPDgWAi0LEOT2tLCqTxVj1El0kaU25inOXgOIYVrYTh0Hs1TzMnLGXc44OScyQJfohSV57mjqZlfIjY-6Xq0ZhGvcHt3NqyNAOyADkyJgnH51Gf4sr-tP_B2_HZaTf3RD6kdqpBjJE8qy2AM5deTLOtSkTvnaSFJKji3-zwY0LjkFSufhdnIvBWAijjEIRDi4q151qSoFHJCB2J8VKhKGYGPefJT1zauPQT2HF04Hv1U9YplJcUtHhZ5ym-Ei1JCCSUXbU9dJZ3YzgdIv7o1oEEnbj9znhwRVT9Q0EbT0TullfMSd7Ienid007eWQoZu7mER8SRU0RAGTI8kaZbTYGab4zw74mbPkHwLD-jlJfO4FXTj2-1EpjYXQdZ23VAA1JIhnWA6sA1Z7spRavkysXMBQYe_cVVq4mYSISK6fGP_ujKa1zv88CKyRKvAoMLdVSP48aAAwsBBANvUnsImhMg1zooJCqSBDB&region=PH&locale=en&source=seller_center&hide_tips=&no-cache=1&e=1',
    lazada: 'https://www.lazada.com.ph/shop/fnl-toys'
  }
},
{
  id: 'prod-ocean-balls',
  name: 'Ocean Balls',
  highlight: 'Crush-Proof Fun',
  description:
  'Non-toxic, smooth, crush-proof colourful balls. Available in packs of 50 and 100. BPA-free for worry-free play.',
  features: ['BPA-free material', 'Air-filled durability', 'Pastel & vibrant colour sets'],
  image:
  "https://images.unsplash.com/photo-1623346140091-16e9a0faf1ad",
  imageAlt:
  'Child laughing surrounded by hundreds of colourful non-toxic ocean balls in a bright playroom',
  links: {
    shopee: 'https://shopee.ph/FNL-TOYS-50-pcs-8cm-big-ocean-balls-kidzoona-size-balls-soft-bouncy-balls-i.278483575.27288799550?extraParams=%7B%22display_model_id%22%3A262592832587%2C%22model_selection_logic%22%3A3%7D',
    tiktok: 'https://shop.tiktok.com/ph/pdp/1732255541865776264?encode_params=MIIBpgQMyoujyhC1JBvg-icTBIIBgmxL56GDOn6Jppx0OCZIshWwPK-Eu24o3S6j7vtCLeCaN5vWlcoIch379HGiXApZeVD4fuyk6MyxEVQPhz6x-0VcVNPAWUs_sHHQzckm_Cxk5id95zLmvnj4RSAdnePimhZxUqZ1zr4MyFmQZj7oXpxOILOtJIHB9UBx8LK6kV3kKGrmU05lENKftI_QQHPWV4zIoPWgUWc4V2fV7p9RYpo4IdGzyuxUm6e1q6Rf1ZcmEn1YVucoTA-KL1DMfWJmZsRovL0Gxw3ookA8K8R08xgbc_Pi3y3KKiQppeQ7q8ejsaSJQJ7S-cHAQgz8mso1xcG0nKjJS6bBqThToKhBaI6D7sEzkfF2pDiVKvH1-l6U7NqW-TKlCfoBBiAT8UpSuxldJZlXLFfyhhBmt2Pb5MJ3-xepmK6Ox00VObZSceNXyK7exuUd-H8uvY7CS6qRKCw-pU9ILFBf5NMyZFhsPn1j-JMX9CPWpI4IB6LWypCAbKYvH2LLB7t5NaHEjmZeRSV3BBC8skp7Jt-hXwl6mG6-aQPF&region=PH&locale=en&source=seller_center&hide_tips=&no-cache=1&e=1',
    lazada: 'https://www.lazada.com.ph/shop/fnl-toys'
  }
},
{
  id: 'prod-bookshelf',
  name: 'Bookshelf',
  highlight: 'Montessori-Inspired',
  description:
  'Front-facing children\'s sling and display shelf encouraging reading independence. Child-height design with rounded safety edges.',
  features: ['Child-height design', 'Rounded safety edges', 'Heavy-duty fabric/wood frame'],
  image:
  "/assets/images/15-1788326130296.jpg",
  imageAlt:
  'Organised children\'s nook with front-facing Montessori bookshelf — warm, cosy room with books displayed at child eye level',
  links: {
    shopee: 'https://shopee.ph/White-Carrot-Children\'s-Bookshelf-Plastic-Kids-Book-Shelf-Toy-Organizer-Rack-i.278483575.19170982462?extraParams=%7B%22display_model_id%22%3A107892165884%2C%22model_selection_logic%22%3A3%7D',
    tiktok: 'https://shop.tiktok.com/ph/pdp/1729396093210627208?encode_params=MIIBpgQMD9e2bi6zExnmkD75BIIBggunKXyJ7UGjEuG1q4T_mzL2ypvmz6ij68YIjnAIdGYgBpW-Mkg1vvWE8L8wzqNCsi7abhOx7D9YwSE-_k5NdKdRLp4-wixDhclW3ptee6287JDa67wumio4YH5-4zcr9zKFjN3IXdgjIoiQhIuSyGvlyCXyZv1-KJN2DTnqXMAWNOudnYeCotqPXkSLqKWsmzDFGGWPeUxPWyTHOcKKQJajOlcfYVqWH4Ke3osgQcyF303BGKI5GIEIz-qYiTSxc1ncxcjAmIkwYJhVMOBj6UBD-f8TMGcZbprsPh2uTQ7_ZJPcxPoBQE3-ZAuLHr8DcGiPrverETBRD0BrFdrBINJwR2uPEOB_sCioiReTjS4pJ0eMA6zO5EoST1za78rPzM9DC-cXIfyrB_GvHUvMltUPVDutFZa_YO4gtw1ybxPX0tbRH1SFGK-53g0huMD4bY9ylRoWX5Q5VsryiJ0UJnIScaUJj7jBkIsXlrcghf9m4OCAphM7ehocPOHiyNyrI11CBBD6RZSnlFEgUu79VgSNGtks&region=PH&locale=en&source=seller_center&hide_tips=&no-cache=1&e=1',
    lazada: 'https://www.lazada.com.ph/shop/fnl-toys'
  }
},
{
  id: 'prod-storage-rack',
  name: 'Storage Rack',
  highlight: 'Maximum Organisation',
  description:
  'Multi-tier toy organiser bins with anti-tip safety anchors. Removable, easy-to-clean surfaces keep rooms tidy all day.',
  features: ['Removable storage bins', 'Easy-to-clean surfaces', 'Sturdy anti-tip frame'],
  image:
  "/assets/images/TO_REFINE-1788326037048.png",
  imageAlt:
  'Tidy children\'s room with multi-tier colourful storage rack filled with toys — bright, airy, well-lit space',
  links: {
    shopee: 'https://shopee.ph/FNL-TOYS-4-Layer-Children\'s-Toy-Storage-Shelves-No-Lid-Cover-Multi-Tier-Organizer-Storage-Rack-i.278483575.19595045327?extraParams=%7B%22display_model_id%22%3A255008681017%2C%22model_selection_logic%22%3A3%7D',
    tiktok: 'https://shop.tiktok.com/ph/pdp/1729778873336432776?encode_params=MIIBpgQM1DUO0kOU2IxInqocBIIBgg4nGnvEgaNXJcNxiLADZ5pXpBfGgYcnPOu4cTJWUCcVROKkj2lD7V69bIX4c7sbTg1kGVuQ5gNB0ywOHlZEmJGeWE7qmp4VPWuQvlpTxCVFZ43nJajpVIZqVZNOqO7llvj1WHd2vv7DZ2qlbNVLSx5AgSlQPgBPlK7VCOCuAtjZ3_XFqlWSpdm-lOW2tpzsmGv45pX6lWrKmGknGiATKQGFYcxbgAqQTdBOySbdBnOiJizYixAbSKOkW_L2tBKuNTGq6nfLSIgGSCgk9U84FK_pCu2wCIxmvszoZy5Wl9fiY-L6_rLkIhI0eUiwdlwhvMnzsQVrv86QaEVSt9pS0hCFToQq2C8NUzNbh4JuTwJ6LbODoDKLwyesLr74KbT2cXPoOzIMiuWfDxNl-Bj9fLspIe25YM3iJGWhCctvDk5fsW37UDjfJvgQkiMay4JUiUbFF28kNBP9JdMSvVuSo_Bb_VyWhoJmVrylLF_aueDdoMOrOu_PFS4mwWYwByoXv6njBBDlgNaFK3swjgA-dFQyJII9&region=PH&locale=en&source=seller_center&hide_tips=&no-cache=1&e=1',
    lazada: 'https://www.lazada.com.ph/shop/fnl-toys'
  }
}];


const marketplaceMeta = {
  shopee: { label: 'Shopee', bg: 'bg-[#EE4D2D]', text: 'text-white' },
  tiktok: { label: 'TikTok', bg: 'bg-foreground', text: 'text-background' },
  lazada: { label: 'Lazada', bg: 'bg-[#0F146D]', text: 'text-white' }
} as const;

function ProductCard({ product, index }: {product: Product;index: number;}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {if (entry.isIntersecting) {setVisible(true);observer.disconnect();}},
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal product-card-hover bg-card rounded-2xl border border-border overflow-hidden group transition-all duration-700 card-premium hover:border-primary/40 shadow-sm ${
      visible ? 'reveal-animate opacity-100' : 'opacity-0'}`
      }
      style={{ animationDelay: `${index * 100}ms` }}>
      
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <AppImage
          src={product.image}
          alt={product.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105" />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        {/* Highlight badge */}
        <div className="absolute top-4 left-4 badge-premium text-primary text-xs font-bold px-4 py-2 rounded-full shadow-md backdrop-blur-sm">
          {product.highlight}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 flex flex-col gap-4">
        <div>
          <h3 className="font-display text-xl font-bold text-foreground mb-1">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Features */}
        <ul className="flex flex-col gap-1.5">
          {product.features.map((feat) =>
          <li key={feat} className="flex items-center gap-2 text-xs text-muted-foreground">
              <Icon name="CheckCircleIcon" size={14} variant="solid" className="text-accent shrink-0" />
              {feat}
            </li>
          )}
        </ul>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Marketplace links */}
        <div className="flex flex-wrap gap-2">
          {(Object.keys(marketplaceMeta) as Array<keyof typeof marketplaceMeta>).map((key) => {
            const meta = marketplaceMeta[key];
            return (
              <a
                key={key}
                href={product.links[key]}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 min-w-[80px] inline-flex items-center justify-center px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-300 hover:opacity-90 hover:scale-105 shimmer-btn btn-premium relative overflow-hidden ${meta.bg} ${meta.text}`}>
                
                {meta.label}
              </a>);

          })}
        </div>
      </div>
    </div>);

}

export default function FeaturedProducts() {
  const headingRef = useRef<HTMLDivElement>(null);
  const [headingVisible, setHeadingVisible] = useState(false);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {if (entry.isIntersecting) {setHeadingVisible(true);observer.disconnect();}},
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="featured-products"
      className="py-16 sm:py-20 bg-background"
      aria-labelledby="products-heading">
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div
          ref={headingRef}
          className={`mb-12 reveal ${headingVisible ? 'reveal-animate' : 'opacity-0'}`}>
          
          <span className="section-label text-primary mb-3 block">01 — BEST-SELLERS</span>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2
              id="products-heading"
              className="font-display text-4xl sm:text-5xl font-bold text-foreground leading-tight">
              
              Featured
              <br />
              <span className="italic text-primary">Products</span>
            </h2>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed sm:text-right">
              Choose your favourite marketplace to order directly — active
              vouchers, coins, and free shipping available.
            </p>
          </div>
        </div>

        {/* BENTO GRID AUDIT:
             Array: [Playfence, OceanBalls, Bookshelf, StorageRack]
             Row 1: [col-1: Playfence cs-1] [col-2: OceanBalls cs-1]
             Row 2: [col-1: Bookshelf cs-1] [col-2: StorageRack cs-1]
             Placed 4/4 ✓
          */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {products.map((product, i) =>
          <ProductCard key={product.id} product={product} index={i} />
          )}
        </div>

        {/* Bottom CTA bar */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 p-6 sm:p-8 bg-gradient-to-r from-muted via-muted to-primary/5 rounded-2xl border border-border card-premium hover:shadow-md transition-all duration-300">
          <div>
            <p className="font-semibold text-foreground text-sm">
              Shop all products on our official stores
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Verified seller • Active vouchers • Free shipping promos
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {[
            { label: 'Shopee', href: 'https://shopee.ph/fnltoys', bg: 'bg-[#EE4D2D]', text: 'text-white' },
            { label: 'TikTok', href: 'https://tiktok.com/@fnltoys', bg: 'bg-foreground', text: 'text-background' },
            { label: 'Lazada', href: 'https://www.lazada.com.ph/shop/fnl-toys', bg: 'bg-[#0F146D]', text: 'text-white' }].
            map((m) =>
            <a
              key={m.label}
              href={m.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all hover:opacity-90 hover:scale-105 shimmer-btn btn-premium shadow-sm relative overflow-hidden ${m.bg} ${m.text}`}>
              
                {m.label}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>);

}