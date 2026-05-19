import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShoppingBag, PlusCircle, HelpCircle, MessageSquare } from 'lucide-react';
import { readJsonFile } from '@/lib/storage';
import ProductCard from '@/components/ProductCard';
import RequestCard from '@/components/RequestCard';

const PRODUCTS_FILE = 'server/data/products.json';
const REQUESTS_FILE = 'server/data/requests.json';

export default async function Home() {
  // Load data on the server
  const products = await readJsonFile(PRODUCTS_FILE);
  const requests = await readJsonFile(REQUESTS_FILE);

  // Filter available and featured products
  const featuredProducts = products
    .filter((p) => p.status === 'available' && p.featured)
    .slice(0, 4);

  // Filter recently added available products
  const recentProducts = products
    .filter((p) => p.status === 'available')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  // Filter approved buyer requests
  const approvedRequests = requests
    .filter((r) => r.status === 'approved')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2348000000000';
  
  // Prefilled sell inquiry message
  const sellInquiryMessage = `Hello, I would like to sell a used item on your platform!
Here are the details of the item I want to sell:
Item Name: 
Brand/Model: 
Condition: 
Expected Price: ₦
Description & Photos: [Attach photos in chat]`;

  const sellWhatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(sellInquiryMessage)}`;

  return (
    <div className="flex flex-col w-full pb-20">
      {/* 1. Hero Section */}
      <section className="relative w-full pt-20 pb-24 md:pt-28 md:pb-36 overflow-hidden px-6">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-pink-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="mx-auto max-w-5xl text-center relative z-10 flex flex-col items-center gap-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 border border-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            Circular Tech Marketplace
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.1] max-w-4xl">
            Buy, Sell &amp; Request <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Verified Used Products
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
            The premium MVP marketplace bridging high-quality second-hand devices with eager buyers. Powered entirely by seamless WhatsApp &amp; Instagram direct lead connections.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4 w-full sm:w-auto">
            <Link
              href="/products"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all hover:translate-y-[-1px]"
            >
              <ShoppingBag className="w-4 h-4" />
              Browse Items
            </Link>
            
            <Link
              href="/request-item"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-6 py-3.5 text-sm font-bold text-slate-300 hover:border-slate-700 hover:text-white transition-all hover:translate-y-[-1px]"
            >
              <PlusCircle className="w-4 h-4" />
              Request an Item
            </Link>

            <a
              href={sellWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-emerald-600/10 border border-emerald-500/20 px-6 py-3.5 text-sm font-bold text-emerald-400 hover:bg-emerald-600/20 transition-all hover:translate-y-[-1px]"
            >
              <MessageSquare className="w-4 h-4" />
              Sell an Item
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 flex flex-col gap-24 w-full">
        {/* 2. Featured Products Section */}
        {featuredProducts.length > 0 && (
          <section className="flex flex-col gap-6">
            <div className="flex items-end justify-between border-b border-slate-900 pb-4">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Handpicked for you</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">Featured Listings</h2>
              </div>
              <Link href="/products" className="group flex items-center gap-1 text-sm font-medium text-slate-400 hover:text-indigo-400 transition-colors">
                View all
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* 3. Recently Added Section */}
        <section className="flex flex-col gap-6">
          <div className="flex items-end justify-between border-b border-slate-900 pb-4">
            <div>
              <span className="text-xs font-bold text-pink-400 uppercase tracking-widest">Just landed</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">Recently Added</h2>
            </div>
            <Link href="/products" className="group flex items-center gap-1 text-sm font-medium text-slate-400 hover:text-indigo-400 transition-colors">
              Browse grid
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          {recentProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recentProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center text-slate-500">
              No products found. Add products in admin panel!
            </div>
          )}
        </section>

        {/* 4. Approved Item Requests Section */}
        {approvedRequests.length > 0 && (
          <section className="flex flex-col gap-6">
            <div className="flex items-end justify-between border-b border-slate-900 pb-4">
              <div>
                <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">Eager Buyers</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">Active Item Requests</h2>
              </div>
              <Link href="/requests" className="group flex items-center gap-1 text-sm font-medium text-slate-400 hover:text-indigo-400 transition-colors">
                See all requests
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {approvedRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          </section>
        )}

        {/* 5. Informative How-It-Works/CTA Section */}
        <section className="relative rounded-3xl border border-slate-800 bg-slate-900/40 p-8 md:p-12 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 pointer-events-none" />
          <div className="flex flex-col gap-3 relative z-10 max-w-xl">
            <h3 className="text-2xl font-bold text-white tracking-tight">Looking for something specific?</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              If our catalog doesn't currently list the phone, laptop, or gaming console you want, you can submit a public request. We'll broadcast it to our community to find a seller instantly.
            </p>
          </div>
          <div className="flex flex-shrink-0 relative z-10 w-full md:w-auto">
            <Link
              href="/request-item"
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all"
            >
              Submit a Wanted Request
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
