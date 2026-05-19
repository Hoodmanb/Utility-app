'use client';
import React, { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/ProductCard';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const categories = [
    { name: 'All Categories', value: 'all' },
    { name: 'Phones', value: 'phones' },
    { name: 'Laptops', value: 'laptops' },
    { name: 'Gaming', value: 'gaming' },
    { name: 'Appliances', value: 'appliances' },
    { name: 'Fashion', value: 'fashion' }
  ];

  const statuses = [
    { name: 'All Statuses', value: 'all' },
    { name: 'Available', value: 'available' },
    { name: 'Reserved', value: 'reserved' },
    { name: 'Sold Out', value: 'sold' }
  ];

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/products');
      if (!res.ok) {
        throw new Error('Failed to load products');
      }
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please check server connections.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(search.toLowerCase()) || 
                          (product.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 w-full flex-1 flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2 border-b border-slate-900 pb-6">
        <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Premium Catalog</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Browse Used Items</h1>
        <p className="text-slate-400 text-sm max-w-2xl">
          Explore our certified stock of high-quality electronics, gaming equipment, home appliances, and fashion items. Tap any product to check details and buy.
        </p>
      </div>

      {/* Search and Filters panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center bg-slate-900/40 p-4 rounded-2xl border border-slate-800 backdrop-blur-sm">
        {/* Search Input */}
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search items by keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Category Selector */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Selector */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
          >
            {statuses.map((stat) => (
              <option key={stat.value} value={stat.value}>
                {stat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Content Container */}
      <div className="flex-1 flex flex-col justify-start">
        {loading ? (
          /* SKELETON LOADER GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, idx) => (
              <div
                key={idx}
                className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/30 overflow-hidden animate-pulse h-[340px]"
              >
                <div className="aspect-video w-full bg-slate-850" />
                <div className="p-5 flex-1 flex flex-col gap-4">
                  <div className="h-3 w-16 bg-slate-800 rounded-md" />
                  <div className="h-5 w-40 bg-slate-800 rounded-md" />
                  <div className="h-4 w-full bg-slate-800 rounded-md" />
                  <div className="mt-auto pt-4 border-t border-slate-800 flex justify-between items-center">
                    <div className="h-6 w-20 bg-slate-800 rounded-md" />
                    <div className="h-8 w-24 bg-slate-800 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          /* ERROR UI */
          <div className="rounded-2xl border border-dashed border-rose-500/20 bg-rose-500/5 p-12 text-center flex flex-col items-center gap-4">
            <XCircle className="w-12 h-12 text-rose-400" />
            <p className="text-rose-200 font-semibold">{error}</p>
            <button
              onClick={fetchProducts}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 border border-slate-800 px-4 py-2 text-sm text-white hover:bg-slate-850 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        ) : filteredProducts.length > 0 ? (
          /* ACTUAL FILTERED PRODUCTS GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          /* EMPTY STATE */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-dashed border-slate-800 p-16 text-center flex flex-col items-center gap-4 max-w-lg mx-auto w-full mt-10"
          >
            <Search className="w-12 h-12 text-slate-600 animate-bounce" />
            <h3 className="text-lg font-bold text-white">No items found</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              We couldn't find any products matching your search term or filter selection. Try removing keywords or adjusting category/status selects!
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('all');
                setSelectedStatus('all');
              }}
              className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4.5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-500 transition-colors"
            >
              Reset Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
