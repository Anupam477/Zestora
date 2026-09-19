import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, ArrowRight } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 text-center">
      <div className="luxury-card p-12 rounded-3xl max-w-lg space-y-6 shadow-2xl border border-slate-800">
        <div className="w-16 h-16 rounded-2xl bg-primary/15 text-primary flex items-center justify-center mx-auto">
          <UtensilsCrossed className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-6xl font-black font-heading text-primary">404</h1>
          <h2 className="text-2xl font-bold font-heading text-white mt-2">Course Not Found</h2>
          <p className="text-sm text-slate-400 mt-2">
            The page or recipe you are looking for has been moved or retired from our seasonal menu.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary to-accent-orange text-[#0B1120] font-black text-xs uppercase tracking-wider shadow-lg shadow-primary/20 hover:brightness-110 transition-all"
        >
          Return to Grand Hall
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
