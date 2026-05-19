'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductCard({ product }) {
  const { id, title, price, condition, category, status, images, description } = product;
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2348000000000';
  
  const productLink = `${siteUrl}/products/${id}`;
  const inquiryMessage = `Hello, I'm interested in this item:
Product: ${title}
Price: ₦${new Intl.NumberFormat().format(price)}
Link: ${productLink}`;

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(inquiryMessage)}`;
  
  // Format price
  const formattedPrice = `₦${new Intl.NumberFormat().format(price)}`;

  // Determine status badge colors
  const statusStyles = {
    available: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-emerald-500/5',
    reserved: 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-amber-500/5',
    sold: 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-rose-500/5'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm overflow-hidden hover:border-slate-700/80 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300"
    >
      {/* Product Image Wrapper */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images && images[0] ? images[0] : '/uploads/phone.svg'}
          alt={title}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Condition Badge (Top-Left overlay) */}
        <span className="absolute top-3 left-3 rounded-lg bg-slate-950/80 backdrop-blur-md px-2.5 py-1 text-xs font-semibold text-indigo-300 border border-slate-800">
          {condition}
        </span>

        {/* Status Badge (Top-Right overlay) */}
        <span
          className={`absolute top-3 right-3 rounded-lg border px-2.5 py-1 text-xs font-bold uppercase tracking-wider shadow-sm ${
            statusStyles[status] || 'bg-slate-800 text-slate-400 border-slate-700'
          }`}
        >
          {status}
        </span>
      </div>

      {/* Product Details Section */}
      <div className="flex flex-1 flex-col p-5">
        {/* Category Tag */}
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
          {category}
        </span>

        {/* Title and details redirect */}
        <Link href={`/products/${id}`} className="group/title flex items-start justify-between gap-1.5 mb-2">
          <h3 className="text-base font-bold text-white group-hover/title:text-indigo-400 line-clamp-1 transition-colors">
            {title}
          </h3>
          <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover/title:text-indigo-400 transition-colors flex-shrink-0 mt-1" />
        </Link>

        {/* Description Snippet */}
        <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed flex-1">
          {description || 'No description provided.'}
        </p>

        {/* Price and CTA Grid */}
        <div className="flex items-center justify-between gap-4 mt-auto pt-4 border-t border-slate-800">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Price</span>
            <span className="text-lg font-extrabold text-white">{formattedPrice}</span>
          </div>

          {status !== 'sold' ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              I Want This
            </a>
          ) : (
            <button
              disabled
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-500 cursor-not-allowed border border-slate-800/50"
            >
              Sold Out
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
