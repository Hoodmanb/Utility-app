'use client';
import React, { useState } from 'react';
import { useToast } from '@/components/Toast';
import { PlusCircle, HelpCircle, CheckCircle, Tag, Sparkles, User, Info, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RequestItemPage() {
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form Fields State
  const [itemName, setItemName] = useState('');
  const [budget, setBudget] = useState('');
  const [condition, setCondition] = useState('Used - Good');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');

  const conditionOptions = [
    'Like New',
    'Excellent',
    'Used - Good',
    'Used - Fair',
    'Vintage',
    'Any Condition'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!itemName.trim() || !budget || !contact.trim() || !description.trim()) {
      showToast('Please fill out all required fields!', 'error');
      return;
    }

    if (isNaN(budget) || Number(budget) <= 0) {
      showToast('Please enter a valid numeric budget!', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          itemName: itemName.trim(),
          budget: Number(budget),
          condition,
          description: description.trim(),
          contact: contact.trim()
        })
      });

      if (!res.ok) {
        throw new Error('Server response failed');
      }

      showToast('Item request submitted successfully!', 'success');
      setSuccess(true);
      
      // Reset Form
      setItemName('');
      setBudget('');
      setCondition('Used - Good');
      setDescription('');
      setContact('');
    } catch (err) {
      console.error('Submission error:', err);
      showToast('Failed to submit request. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-12 w-full flex-1 flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {!success ? (
          /* FORM VIEW */
          <motion.div
            key="request-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex flex-col gap-8"
          >
            {/* Header */}
            <div className="flex flex-col gap-2 border-b border-slate-900 pb-5">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest text-left">Buyer Desk</span>
              <h1 className="text-3xl font-black text-white tracking-tight text-left flex items-center gap-2">
                <PlusCircle className="w-8 h-8 text-indigo-500" />
                Submit Wanted Request
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed text-left">
                Can't find the item you are looking for in our catalogs? Fill out this quick form. We will display it on the Public Requests board once verified!
              </p>
            </div>

            {/* Form Container */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 bg-slate-900/40 p-6 sm:p-8 rounded-2xl border border-slate-800 backdrop-blur-sm">
              
              {/* Item Name */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-indigo-400" />
                  Item Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PlayStation 5 Slim, MacBook Pro M2"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Budget and Condition Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Budget */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-indigo-400" />
                    Max Budget (₦) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 500000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                {/* Condition */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    Preferred Condition
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    {conditionOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-indigo-400" />
                  Description / Specifications <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows="4"
                  placeholder="Detail your request: color, storage size, accessories, or when you need it..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                />
              </div>

              {/* Contact Info */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  Your Contact Details <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Phone number (WhatsApp preferred) or Email address"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 leading-relaxed font-normal">
                  Your phone/email will remain hidden publicly and will only be visible to the site administrator to verify the match.
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {submitting ? 'Submitting Request...' : 'Submit Request'}
              </button>
            </form>
          </motion.div>
        ) : (
          /* SUCCESS VIEW */
          <motion.div
            key="success-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center text-center p-8 bg-slate-900/60 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-sm gap-6 max-w-lg mx-auto w-full"
          >
            <div className="relative">
              <span className="absolute inset-0 bg-emerald-500/20 rounded-full blur-md animate-ping"></span>
              <CheckCircle className="w-16 h-16 text-emerald-500 relative z-10" />
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-black text-white tracking-tight">Request Submitted!</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Your request has been successfully filed in our system under moderation status. 
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 text-xs text-slate-500 leading-relaxed text-left">
              <strong>What happens next?</strong>
              <ul className="list-disc list-inside mt-2 flex flex-col gap-1.5">
                <li>An administrator will review your item request and verify your contact details.</li>
                <li>Upon approval, your item request will appear on the public board under the category budget.</li>
                <li>Sellers will see it and click "I Have This Item" to immediately match and chat with us.</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
              <button
                onClick={() => setSuccess(false)}
                className="flex-1 rounded-xl bg-slate-900 border border-slate-800 px-5 py-3 text-xs font-bold text-slate-300 hover:text-white transition-colors"
              >
                Submit Another Request
              </button>
              <a
                href="/requests"
                className="flex-1 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-indigo-500 transition-colors"
              >
                View Public Requests
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
