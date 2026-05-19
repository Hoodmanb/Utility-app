'use client';
import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

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

export default function Footer() {
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/used_marketplace_mvp';
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2348000000000';

  const categories = [
    { name: 'Phones & Devices', href: '/products?category=phones' },
    { name: 'Laptops & PCs', href: '/products?category=laptops' },
    { name: 'Gaming Equipment', href: '/products?category=gaming' },
    { name: 'Home Appliances', href: '/products?category=appliances' },
    { name: 'Fashion & Apparel', href: '/products?category=fashion' }
  ];

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 py-12 px-6">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Info Column */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2 group w-fit">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-extrabold shadow-md">
              U
            </span>
            <span className="text-white text-base font-bold tracking-tight">
              Used<span className="text-indigo-400">Sphere</span>
            </span>
          </Link>
          <p className="text-sm leading-relaxed text-slate-400">
            A premium circular economy platform designed to help you buy, sell, and request high-quality pre-owned items effortlessly. Handled by real experts, verified and trusted.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-slate-900 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors"
              aria-label="Instagram Page"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="flex flex-col gap-3.5">
          <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Marketplace</h3>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <Link href="/" className="hover:text-white transition-colors">Home Landing</Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-white transition-colors">Browse Products</Link>
            </li>
            <li>
              <Link href="/requests" className="hover:text-white transition-colors">Buyers' Requests</Link>
            </li>
            <li>
              <Link href="/request-item" className="hover:text-white transition-colors">Request a Product</Link>
            </li>
          </ul>
        </div>

        {/* Categories Column */}
        <div className="flex flex-col gap-3.5">
          <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Categories</h3>
          <ul className="flex flex-col gap-2.5 text-sm">
            {categories.map((cat, idx) => (
              <li key={idx}>
                <Link href={cat.href} className="hover:text-white transition-colors">
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info Column */}
        <div className="flex flex-col gap-3.5">
          <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Contact &amp; Lead Flow</h3>
          <ul className="flex flex-col gap-3 text-sm">
            <li className="flex items-start gap-2.5">
              <Phone className="w-4 h-5 text-indigo-400 flex-shrink-0" />
              <span>+{whatsappNumber} (WhatsApp)</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail className="w-4 h-5 text-indigo-400 flex-shrink-0" />
              <span>inquire@usedsphere.com</span>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-5 text-indigo-400 flex-shrink-0" />
              <span>Lagos, Nigeria &amp; Remote Operations</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-7xl mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <p>&copy; {new Date().getFullYear()} UsedSphere Marketplace MVP. Built with Next.js App Router.</p>
        <p className="text-slate-600">SaaS-Inspired Circular E-commerce Demo</p>
      </div>
    </footer>
  );
}
