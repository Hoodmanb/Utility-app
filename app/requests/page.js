import React from 'react';
import { readJsonFile } from '@/lib/storage';
import RequestCard from '@/components/RequestCard';
import { HelpCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';

const REQUESTS_FILE = 'server/data/requests.json';

export const metadata = {
  title: 'Active Buyer Requests',
  description: 'See what buyers in our community are currently looking for. If you have any of these items available, contact us instantly to sell it!'
};

export default async function RequestsPage() {
  const requests = await readJsonFile(REQUESTS_FILE);
  
  // Strictly filter for approved requests only
  const approvedRequests = requests
    .filter((r) => r.status === 'approved')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 w-full flex-1 flex flex-col gap-10">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-slate-900 pb-6">
        <div className="flex-1 flex flex-col gap-2">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest text-left">Active Demands</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight text-left">What Buyers Are Looking For</h1>
          <p className="text-slate-400 text-sm max-w-2xl text-left font-normal">
            These are verified, pre-screened item requests from active buyers in our marketplace. Browse what people need and cash in by supplying it!
          </p>
        </div>
        <div className="flex-shrink-0">
          <Link
            href="/request-item"
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 px-5 py-3 text-xs font-bold text-white transition-all hover:translate-x-0.5"
          >
            Submit Your Own Request
          </Link>
        </div>
      </div>

      {/* Main content listings */}
      <div className="flex-1 flex flex-col justify-start">
        {approvedRequests.length > 0 ? (
          <div className="flex flex-col gap-6">
            {approvedRequests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="rounded-2xl border border-dashed border-slate-800 p-16 text-center flex flex-col items-center gap-4 max-w-md mx-auto w-full mt-6">
            <HelpCircle className="w-12 h-12 text-slate-600 animate-pulse" />
            <h3 className="text-lg font-bold text-white">No active requests</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              There are currently no active approved buyer requests. If you are looking to buy a specific item, submit a request and it will appear here upon approval!
            </p>
            <Link
              href="/request-item"
              className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-indigo-505 transition-colors"
            >
              Submit Wanted Item
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
