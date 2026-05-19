'use client';
import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsApp() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2348000000000';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const message = `Hello, I'm visiting your website (${siteUrl}) and I would like to make a general inquiry about buying/selling used items!`;
  
  const whatsappUrl = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-300 group"
      aria-label="Contact us on WhatsApp"
    >
      {/* Pulsing Outer Aura */}
      <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-25 group-hover:animate-none"></span>
      
      {/* WhatsApp Custom Icon */}
      <MessageCircle className="w-7 h-7 relative z-10 fill-current" />
      
      {/* Tooltip on Hover */}
      <span className="absolute right-16 scale-0 group-hover:scale-100 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md whitespace-nowrap transition-all duration-200 border border-slate-800">
        Chat with us
      </span>
    </a>
  );
}
