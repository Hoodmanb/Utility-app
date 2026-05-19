'use client';
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/Toast';
import { 
  Package, GitPullRequest, Plus, Trash2, Edit3, 
  Check, X, Star, Upload, ShoppingBag, 
  User, DollarSign, Tag, Clock, CheckCircle2, XCircle, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('products');
  
  // Data State
  const [products, setProducts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State (Products CRUD)
  const [showProductModal, setShowProductModal] = useState(false);
  const [editProductId, setEditProductId] = useState(null); // null means creating, value means editing
  const [productForm, setProductForm] = useState({
    title: '',
    price: '',
    condition: 'Excellent',
    category: 'phones',
    status: 'available',
    featured: false,
    description: '',
    images: []
  });
  
  const [uploadingImage, setUploadingImage] = useState(false);

  const categoryOptions = ['phones', 'laptops', 'gaming', 'appliances', 'fashion'];
  const conditionOptions = ['Like New', 'Excellent', 'Used - Good', 'Used - Fair', 'Vintage'];
  const statusOptions = ['available', 'reserved', 'sold'];

  // Data Fetching
  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, reqRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/requests')
      ]);

      if (!prodRes.ok || !reqRes.ok) {
        throw new Error('Data fetch failed');
      }

      const prodData = await prodRes.json();
      const reqData = await reqRes.json();

      setProducts(prodData);
      setRequests(reqData);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      showToast('Failed to load dashboard data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Image Upload Action
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      setProductForm((prev) => ({
        ...prev,
        images: [data.filePath] // store path
      }));
      showToast('Image uploaded successfully!', 'success');
    } catch (err) {
      console.error('Upload error:', err);
      showToast(err.message || 'Image upload failed. Fallback used.', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  // Product CRUD Handlers
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    
    if (!productForm.title.trim() || !productForm.price || !productForm.description.trim()) {
      showToast('Please fill out all required fields!', 'error');
      return;
    }

    const payload = {
      ...productForm,
      price: Number(productForm.price),
      featured: Boolean(productForm.featured)
    };

    try {
      let res;
      if (editProductId) {
        // Edit Product
        res = await fetch(`/api/products/${editProductId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        // Create Product
        res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Operation failed');
      }

      showToast(
        editProductId ? 'Product updated successfully!' : 'Product added successfully!',
        'success'
      );
      
      setShowProductModal(false);
      resetProductForm();
      loadData();
    } catch (err) {
      console.error('Product save error:', err);
      showToast(err.message || 'Failed to save product details.', 'error');
    }
  };

  const handleEditClick = (product) => {
    setEditProductId(product.id);
    setProductForm({
      title: product.title,
      price: product.price,
      condition: product.condition,
      category: product.category,
      status: product.status,
      featured: product.featured || false,
      description: product.description || '',
      images: product.images || []
    });
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Delete failed');

      showToast('Listing removed successfully.', 'success');
      loadData();
    } catch (err) {
      console.error('Delete error:', err);
      showToast('Failed to delete product.', 'error');
    }
  };

  // Toggle quick statuses directly
  const handleQuickStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error('Status update failed');

      showToast(`Status marked as ${newStatus}!`, 'success');
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Failed to update status.', 'error');
    }
  };

  const handleQuickFeaturedToggle = async (id, currentFeatured) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !currentFeatured })
      });

      if (!res.ok) throw new Error('Featured toggle failed');

      showToast(!currentFeatured ? 'Set as featured!' : 'Removed from featured.', 'success');
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Failed to toggle featured state.', 'error');
    }
  };

  // Request Moderation Handlers
  const handleRequestModeration = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error('Moderation failed');

      showToast(
        newStatus === 'approved' ? 'Request approved publicly!' : 'Request marked as rejected.',
        'success'
      );
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Failed to update request state.', 'error');
    }
  };

  const handleDeleteRequest = async (id) => {
    if (!confirm('Are you sure you want to delete this buyer request?')) return;

    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Delete failed');

      showToast('Request deleted successfully.', 'success');
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Failed to delete request.', 'error');
    }
  };

  const resetProductForm = () => {
    setEditProductId(null);
    setProductForm({
      title: '',
      price: '',
      condition: 'Excellent',
      category: 'phones',
      status: 'available',
      featured: false,
      description: '',
      images: []
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 w-full flex-1 flex flex-col gap-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-900 pb-6 gap-4">
        <div className="text-left">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Admin Dashboard</span>
          <h1 className="text-3xl font-black text-white tracking-tight mt-1">UsedSphere Operations Room</h1>
          <p className="text-slate-400 text-sm mt-0.5 font-normal">
            Manage your store catalog listings, mark items sold, and approve or reject user wanted-item requests.
          </p>
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg border transition-all ${
              activeTab === 'products'
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg border transition-all ${
              activeTab === 'requests'
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <GitPullRequest className="w-4 h-4" />
            Buyer Requests ({requests.length})
          </button>
        </div>
      </div>

      {loading ? (
        /* LOADING */
        <div className="flex-1 flex items-center justify-center py-20">
          <RefreshCw className="w-10 h-10 text-indigo-500 animate-spin" />
        </div>
      ) : (
        /* CORE CONTENT */
        <div className="flex-1 flex flex-col justify-start">
          
          {/* TAB 1: PRODUCTS LISTINGS */}
          {activeTab === 'products' && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-extrabold text-white">All Store Listings</h2>
                <button
                  onClick={() => {
                    resetProductForm();
                    setShowProductModal(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-indigo-500 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add New Product
                </button>
              </div>

              {products.length > 0 ? (
                /* Products Table */
                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/20 backdrop-blur-sm">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                        <th className="p-4">Item Details</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Condition</th>
                        <th className="p-4">Featured</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-slate-900/30 transition-colors text-slate-300">
                          {/* Image & Title */}
                          <td className="p-4 flex items-center gap-3">
                            <div className="w-14 h-10 rounded-lg overflow-hidden border border-slate-800 bg-slate-950 flex-shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={product.images && product.images[0] ? product.images[0] : '/uploads/phone.svg'}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="font-bold text-white line-clamp-1 max-w-[200px]">{product.title}</span>
                          </td>

                          {/* Category */}
                          <td className="p-4">
                            <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                              {product.category}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="p-4 font-extrabold text-white">
                            ₦{new Intl.NumberFormat().format(product.price)}
                          </td>

                          {/* Condition */}
                          <td className="p-4 text-xs font-semibold text-slate-400">
                            {product.condition}
                          </td>

                          {/* Featured */}
                          <td className="p-4">
                            <button
                              onClick={() => handleQuickFeaturedToggle(product.id, product.featured)}
                              className={`p-1.5 rounded-lg border transition-colors ${
                                product.featured
                                  ? 'bg-indigo-500/10 border-indigo-500/35 text-indigo-400'
                                  : 'bg-slate-950 border-slate-800 text-slate-600 hover:text-slate-400'
                              }`}
                              title={product.featured ? 'Remove featured' : 'Make featured'}
                            >
                              <Star className="w-4 h-4 fill-current" />
                            </button>
                          </td>

                          {/* Status Select Toggle */}
                          <td className="p-4">
                            <select
                              value={product.status}
                              onChange={(e) => handleQuickStatusChange(product.id, e.target.value)}
                              className={`px-2.5 py-1.5 text-xs font-bold uppercase rounded-lg border focus:outline-none bg-slate-950 border-slate-850 cursor-pointer ${
                                product.status === 'available'
                                  ? 'text-emerald-400 border-emerald-500/20'
                                  : product.status === 'reserved'
                                  ? 'text-amber-400 border-amber-500/20'
                                  : 'text-rose-400 border-rose-500/20'
                              }`}
                            >
                              {statusOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* Actions */}
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEditClick(product)}
                                className="p-2 bg-slate-900 border border-slate-800 rounded-lg hover:border-indigo-500/40 hover:text-indigo-400 transition-colors"
                                title="Edit Product"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-2 bg-slate-900 border border-slate-800 rounded-lg hover:border-rose-500/40 hover:text-rose-400 transition-colors"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center text-slate-500">
                  No products in catalog. Click "Add New Product" to populate your listings.
                </div>
              )}
            </div>
          )}

          {/* TAB 2: BUYER REQUESTS MODERATION */}
          {activeTab === 'requests' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-extrabold text-white text-left">Community Item Requests</h2>

              {requests.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {requests.map((request) => (
                    <div
                      key={request.id}
                      className={`relative flex flex-col md:flex-row rounded-xl border p-5 md:p-6 justify-between gap-6 backdrop-blur-sm transition-all ${
                        request.status === 'pending'
                          ? 'bg-amber-950/10 border-amber-500/20 hover:border-amber-500/40'
                          : request.status === 'approved'
                          ? 'bg-indigo-950/10 border-indigo-500/20 hover:border-indigo-500/40'
                          : 'bg-slate-950/50 border-slate-900 hover:border-slate-800'
                      }`}
                    >
                      {/* Left Block Details */}
                      <div className="flex-1 flex flex-col gap-2 text-left">
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Status Badge */}
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              request.status === 'pending'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : request.status === 'approved'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-slate-900 text-slate-500 border border-slate-850'
                            }`}
                          >
                            {request.status}
                          </span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(request.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Request Title */}
                        <h3 className="text-lg font-bold text-white tracking-tight">
                          {request.itemName}
                        </h3>

                        {/* Description */}
                        <p className="text-slate-400 text-xs leading-relaxed max-w-2xl font-normal">
                          {request.description}
                        </p>

                        {/* Meta information row */}
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 text-xs text-slate-400 mt-2">
                          <span className="flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5 text-slate-500" />
                            Condition: <strong className="text-slate-300">{request.condition}</strong>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                            Budget: <strong className="text-indigo-400">₦{new Intl.NumberFormat().format(request.budget)}</strong>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-500" />
                            Contact: <strong className="text-slate-300 select-all bg-slate-950 border border-slate-900 px-1.5 py-0.5 rounded">{request.contact}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Right Block Admin Actions */}
                      <div className="flex flex-row md:flex-col justify-center items-center gap-2 flex-shrink-0 md:min-w-[150px] border-t md:border-t-0 md:border-l border-slate-900 pt-4 md:pt-0 md:pl-4">
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleRequestModeration(request.id, 'approved')}
                              className="flex-1 w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600/10 border border-emerald-500/20 px-3.5 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all"
                            >
                              <Check className="w-4 h-4" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleRequestModeration(request.id, 'rejected')}
                              className="flex-1 w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-rose-600/10 border border-rose-500/20 px-3.5 py-2 text-xs font-bold text-rose-400 hover:bg-rose-600 hover:text-white transition-all"
                            >
                              <X className="w-4 h-4" />
                              Reject
                            </button>
                          </>
                        )}
                        {request.status === 'approved' && (
                          <button
                            onClick={() => handleRequestModeration(request.id, 'rejected')}
                            className="flex-1 w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs font-bold text-slate-400 hover:text-slate-200 transition-all"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject/Hide
                          </button>
                        )}
                        {request.status === 'rejected' && (
                          <button
                            onClick={() => handleRequestModeration(request.id, 'approved')}
                            className="flex-1 w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600/10 border border-indigo-500/20 px-3.5 py-2 text-xs font-bold text-indigo-400 hover:bg-indigo-650 transition-all"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteRequest(request.id)}
                          className="flex-shrink-0 p-2 bg-slate-950 border border-slate-900 rounded-lg hover:border-rose-500/40 hover:text-rose-400 transition-colors"
                          title="Delete Request"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center text-slate-500">
                  No requests found from users. They will appear here when submitted.
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* PRODUCT CREATION/EDITING DIALOG MODAL */}
      <AnimatePresence>
        {showProductModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProductModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh] flex flex-col gap-5 text-left"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-white">
                  {editProductId ? 'Edit Listing Details' : 'Add New Product Listing'}
                </h3>
                <button
                  onClick={() => setShowProductModal(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form fields */}
              <form onSubmit={handleProductSubmit} className="flex flex-col gap-4">
                
                {/* Title */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Product Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. iPhone 13 Pro Max - 256GB"
                    value={productForm.title}
                    onChange={(e) => setProductForm((p) => ({ ...p, title: e.target.value }))}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                {/* Price & Condition */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Price */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Price (₦) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="650000"
                      value={productForm.price}
                      onChange={(e) => setProductForm((p) => ({ ...p, price: e.target.value }))}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  {/* Condition */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Condition</label>
                    <select
                      value={productForm.condition}
                      onChange={(e) => setProductForm((p) => ({ ...p, condition: e.target.value }))}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
                    >
                      {conditionOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Category & Status */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Category */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm((p) => ({ ...p, category: e.target.value }))}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
                    >
                      {categoryOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</label>
                    <select
                      value={productForm.status}
                      onChange={(e) => setProductForm((p) => ({ ...p, status: e.target.value }))}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Featured Checklist */}
                <div className="flex items-center gap-2 bg-slate-950/50 border border-slate-800 p-3 rounded-xl">
                  <input
                    type="checkbox"
                    id="featuredCheckbox"
                    checked={productForm.featured}
                    onChange={(e) => setProductForm((p) => ({ ...p, featured: e.target.checked }))}
                    className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                  />
                  <label htmlFor="featuredCheckbox" className="text-xs font-semibold text-slate-300 cursor-pointer select-none">
                    Feature this listing on homepage hero section
                  </label>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description *</label>
                  <textarea
                    required
                    rows="3"
                    placeholder="Enter details on condition, specs, box, chargers..."
                    value={productForm.description}
                    onChange={(e) => setProductForm((p) => ({ ...p, description: e.target.value }))}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  />
                </div>

                {/* Image Upload Block */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Product Photo</label>
                  <div className="flex items-center gap-4">
                    {/* Preview circle */}
                    <div className="w-16 h-12 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center flex-shrink-0">
                      {productForm.images && productForm.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={productForm.images[0]}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ShoppingBag className="w-5 h-5 text-slate-700" />
                      )}
                    </div>

                    {/* Upload button wrapper */}
                    <label className="flex-1 flex items-center justify-center gap-2 border border-dashed border-slate-850 hover:border-slate-700 rounded-xl px-4 py-3 cursor-pointer text-slate-400 hover:text-white transition-all text-xs font-semibold">
                      <Upload className="w-4 h-4 text-slate-500" />
                      {uploadingImage ? 'Uploading Image...' : 'Click to Upload Image'}
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>
                  {productForm.images && productForm.images[0] && (
                    <span className="text-[10px] text-slate-500 mt-1 truncate">
                      File Path: {productForm.images[0]}
                    </span>
                  )}
                </div>

                {/* Actions submit */}
                <button
                  type="submit"
                  className="mt-2 w-full inline-flex items-center justify-center rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white hover:bg-indigo-505 transition-colors shadow-lg shadow-indigo-600/20"
                >
                  {editProductId ? 'Update Listing' : 'Publish Listing'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
