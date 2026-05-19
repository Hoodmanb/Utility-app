'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Browse Items', href: '/products' },
    { name: 'Public Requests', href: '/requests' },
    { name: 'Request an Item', href: '/request-item' }
  ];

  const isActive = (path) => pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white font-extrabold shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            U
          </span>
          <span className="bg-gradient-to-r from-white via-slate-200 to-indigo-200 bg-clip-text text-lg font-bold tracking-tight text-transparent">
            Used<span className="text-indigo-400">Sphere</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative text-sm font-medium transition-colors hover:text-white ${
                isActive(link.href) ? 'text-indigo-400 font-semibold' : 'text-slate-400'
              }`}
            >
              {link.name}
              {isActive(link.href) && (
                <motion.span
                  layoutId="activeNavIndicator"
                  className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Call to action (Desktop) */}
        <div className="hidden md:block">
          <Link
            href="/request-item"
            className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-4.5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500 transition-all hover:translate-x-0.5 active:translate-y-0.5"
          >
            Submit Request
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-white md:hidden transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b border-slate-800 bg-slate-950 px-6 py-6"
          >
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-base font-medium py-2 rounded-lg px-3 transition-colors ${
                    isActive(link.href)
                      ? 'bg-slate-900 text-indigo-400 font-semibold'
                      : 'text-slate-300 hover:bg-slate-900/50 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="mt-4 border-t border-slate-800 pt-4 px-3">
                <Link
                  href="/request-item"
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg hover:bg-indigo-500 transition-colors"
                >
                  Submit Request
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
