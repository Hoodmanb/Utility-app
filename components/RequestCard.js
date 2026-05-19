'use client';
import React from 'react';
import { Calendar, Tag, MessageSquare, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RequestCard({ request }) {
  const { id, itemName, budget, condition, description, createdAt } = request;
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2348000000000';
  
  const requestLink = `${siteUrl}/requests#${id}`;
  const responseMessage = `Hello, I saw this request on your website:
Request: ${itemName}
Budget: ₦${new Intl.NumberFormat().format(budget)}
Link: ${requestLink}

I have this item available and would like to discuss!`;

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(responseMessage)}`;
  
  // Format date
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      id={id}
      className="relative flex flex-col md:flex-row rounded-2xl border border-indigo-950 bg-slate-950/60 backdrop-blur-md overflow-hidden hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300 group"
    >
      {/* Glow highlight */}
      <span className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-indigo-500 to-purple-500 group-hover:from-indigo-400 group-hover:to-purple-400 transition-colors" />

      {/* Ticket Details Column */}
      <div className="flex-1 p-6 md:p-8 flex flex-col justify-between gap-4">
        <div>
          {/* Header row */}
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md uppercase tracking-wider">
              <Tag className="w-3 h-3" />
              Buyer Request
            </span>
            <span className="inline-flex items-center gap-1 text-slate-500 text-[11px]">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
          </div>

          {/* Requested Item Name */}
          <h3 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-indigo-300 transition-colors">
            {itemName}
          </h3>

          {/* Description */}
          <p className="text-sm text-slate-400 leading-relaxed font-normal">
            {description || 'The buyer did not leave a specific description. Contact them to check details.'}
          </p>
        </div>

        {/* Lower Info Meta Row */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs border-t border-slate-900 pt-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Preferred Condition:</span>
            <span className="font-semibold text-slate-200 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-lg">
              {condition}
            </span>
          </div>
        </div>
      </div>

      {/* Dashed Border divider for Ticket Stub Look */}
      <div className="hidden md:flex flex-col items-center justify-between py-2 flex-shrink-0">
        <div className="w-4 h-4 bg-slate-950 border-r border-b border-indigo-950 rounded-full -mt-4 transform translate-y-1"></div>
        <div className="w-0.5 h-full border-l border-dashed border-indigo-900/60 my-2"></div>
        <div className="w-4 h-4 bg-slate-950 border-r border-t border-indigo-950 rounded-full -mb-4 transform -translate-y-1"></div>
      </div>

      {/* Ticket Stub Action Column */}
      <div className="p-6 md:p-8 bg-slate-900/40 border-t md:border-t-0 md:border-l border-slate-900 flex flex-col justify-center items-center gap-4 text-center min-w-[200px] flex-shrink-0">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Max Budget</span>
          <span className="text-2xl font-black text-indigo-400">
            ₦{new Intl.NumberFormat().format(budget)}
          </span>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500 transition-colors"
        >
          <MessageSquare className="w-4 h-4 fill-current" />
          I Have This Item
        </a>
      </div>
    </motion.div>
  );
}
