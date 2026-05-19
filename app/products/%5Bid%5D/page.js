import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { readJsonFile } from '@/lib/storage';
import { ArrowLeft, MessageCircle, ShieldCheck, RefreshCw, Truck, Tag, Eye } from 'lucide-react';

const Instagram = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
import ProductCard from '@/components/ProductCard';

const PRODUCTS_FILE = 'server/data/products.json';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const products = await readJsonFile(PRODUCTS_FILE);
  const product = products.find((p) => p.id === id);

  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.title} - Buy Pre-owned`,
    description: `${product.title} available in ${product.condition} condition. Categories: ${product.category}. Contact to buy now via WhatsApp or Instagram.`
  };
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const products = await readJsonFile(PRODUCTS_FILE);
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  // Load related available products of same category, excluding current product
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id && p.status === 'available')
    .slice(0, 4);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2348000000000';
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/used_marketplace_mvp';

  const productLink = `${siteUrl}/products/${product.id}`;
  
  // Prefilled WhatsApp message
  const whatsappMessage = `Hello, I'm interested in this item:
Product: ${product.title}
Price: ₦${new Intl.NumberFormat().format(product.price)}
Link: ${productLink}`;

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  // Prefilled Instagram template (redirects to profile, user copies this message)
  const instagramMessage = `Hello, I saw this product on your website:
Product: ${product.title}
Link: ${productLink}`;

  const statusColors = {
    available: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5',
    reserved: 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-500/5',
    sold: 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-rose-500/5'
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 w-full flex-1 flex flex-col gap-12">
      {/* Back button */}
      <div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Listings
        </Link>
      </div>

      {/* Main product display grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column - Image Display */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center">
            {/* Ambient background glow inside the frame */}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950/20 z-0" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.images && product.images[0] ? product.images[0] : '/uploads/phone.svg'}
              alt={product.title}
              className="h-full w-full object-cover relative z-10"
            />
            {/* Status absolute badge overlay */}
            <span
              className={`absolute top-4 right-4 z-20 rounded-xl border px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider ${
                statusColors[product.status] || 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {product.status}
            </span>
          </div>

          {/* Verification Badges */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-900 bg-slate-950/50 p-3 text-center flex flex-col items-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Inspected</span>
            </div>
            <div className="rounded-xl border border-slate-900 bg-slate-950/50 p-3 text-center flex flex-col items-center gap-1.5">
              <RefreshCw className="w-5 h-5 text-emerald-400" />
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Functional</span>
            </div>
            <div className="rounded-xl border border-slate-900 bg-slate-950/50 p-3 text-center flex flex-col items-center gap-1.5">
              <Truck className="w-5 h-5 text-pink-400" />
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Local Pickup</span>
            </div>
          </div>
        </div>

        {/* Right Column - Product Meta & CTAs */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            {/* Category tag */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-indigo-500/10 border border-indigo-500/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                <Tag className="w-3 h-3" />
                {product.category}
              </span>
              <span className="text-xs font-semibold text-slate-400 bg-slate-900 border border-slate-850 px-2 py-0.5 rounded-md">
                Condition: {product.condition}
              </span>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              {product.title}
            </h1>

            {/* Price display block */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4.5 flex items-center justify-between mt-2">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Listing Price</span>
                <span className="text-3xl font-extrabold text-indigo-400">
                  ₦{new Intl.NumberFormat().format(product.price)}
                </span>
              </div>
              <span className="text-xs font-medium text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-2.5 py-1 rounded-lg">
                Available for Purchase
              </span>
            </div>
          </div>

          {/* Description Block */}
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Item Details</h3>
            <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line bg-slate-950 border border-slate-900 p-4 rounded-xl">
              {product.description || 'No description provided for this listing.'}
            </p>
          </div>

          {/* Lead Purchase CTAs */}
          {product.status !== 'sold' ? (
            <div className="flex flex-col gap-3.5 bg-slate-900/40 border border-slate-800 rounded-2xl p-5.5 mt-2">
              <div className="flex items-start gap-3">
                <Eye className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">How to Buy</span>
                  <span className="text-slate-500 text-[11px] leading-relaxed">
                    This platform routes sales directly. Clicking below opens a prefilled message.
                  </span>
                </div>
              </div>

              {/* Direct Buttons */}
              <div className="flex flex-col gap-3 mt-1.5">
                {/* WhatsApp primary button */}
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-500 transition-colors"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  Contact on WhatsApp (Primary)
                </a>

                {/* Instagram secondary button */}
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:opacity-90 px-5 py-3.5 text-sm font-bold text-white shadow-lg transition-all"
                >
                  <Instagram className="w-5 h-5" />
                  Send Instagram DM
                </a>
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-slate-900 border border-slate-850 p-5 text-center text-slate-500">
              <p className="text-sm font-bold uppercase tracking-wider text-rose-400">Sold Out</p>
              <p className="text-xs text-slate-500 mt-1">This product has been claimed. Browse our listing for alternatives!</p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="flex flex-col gap-6 border-t border-slate-900 pt-12 mt-8">
          <div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">More from this category</span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1">Related Products</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
