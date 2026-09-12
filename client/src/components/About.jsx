import React from "react";

export default function About() {
  return (
    <div className="max-w-5xl mx-auto space-y-16 py-10 text-left animate-fade-in">
      {/* Editorial Overview Header Section */}
      <div className="border-b border-slate-200 pb-6">
        <span className="inline-flex bg-emerald-50 text-emerald-700 text-xs font-black uppercase tracking-widest border border-emerald-100 px-3 py-1.5 rounded-full">
          Corporate Overview
        </span>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mt-4 leading-tight">
          Architecting The Future of <br />
          <span className="text-emerald-600">Dining Information Systems</span>
        </h2>
      </div>

      {/* Narrative Split Column with Eye-Catching Imagery Asset */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-4">
          <p className="text-slate-600 text-sm leading-relaxed font-medium">
            Founded with a strict core mandate to eliminate operational table
            scheduling bottlenecks, MultiResto provides an advanced backend
            system connecting prospective diners directly with real-time
            restaurant table seating arrangements.
          </p>
          <p className="text-slate-500 text-sm leading-relaxed font-medium">
            By completely automation-enforcing runtime slot checks, our custom
            cloud application clusters seamlessly maximize table allocations
            while providing zero-overhead data security shields to multi-tenant
            store branch nodes globally.
          </p>
        </div>

        {/* Highly Reliable Public Food Canvas Mock Illustration Frame */}
        {/* 🌟 Premium Production-Ready Cloudinary Image Container Grid Frame */}
        <div className="w-full h-64 md:h-72 rounded-3xl bg-slate-900 shadow-xl border border-slate-800 overflow-hidden relative group">
          <img
            src="https://res.cloudinary.com/x1dwchxh/image/upload/v1788900643/hero_bg_img_elbg53.jpg"
            alt="Premium Culinary Network"
            className="w-full h-full object-cover transform group-hover:scale-[1.02] transition duration-500"
          />

          {/* Subtle corporate dark overlay blend effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none"></div>

          {/* Floating descriptive caption on top of the image layout */}
          <div className="absolute bottom-6 left-6 right-6 z-10 text-left">
            <h4 className="!text-white font-bold text-lg tracking-tight">
              Premium Culinary Network
            </h4>
            <p className="text-slate-300 text-xs font-medium mt-0.5">
              Connecting diners with real-time restaurant table seating
              arrangements.
            </p>
          </div>
        </div>
      </section>

      {/* Three-Column Value Ingestion Matrices Row */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 md:p-10 border border-slate-950 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-6">
          <h3 className="text-xl font-extrabold !text-emerald-400 tracking-tight">
            The Precision Engineering Core Principles
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-2">
            <div className="space-y-2">
              <div className="text-xl">🛡️</div>
              <h4 className="font-bold text-sm !text-white tracking-tight">
                Interval Isolation
              </h4>
              <p className="text-slate-400 text-xs leading-relaxed font-medium">
                Rigorous mathematical verification routines testing overlapping
                timestamps instantly inside data clusters.
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-xl">🎯</div>
              <h4 className="font-bold text-sm !text-white tracking-tight">
                Context Enrichment
              </h4>
              <p className="text-slate-400 text-xs leading-relaxed font-medium">
                Harnessing optimized LLM prompt workflows to analyze, strip
                modifiers, and filter complex taste requirements.
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-xl">👑</div>
              <h4 className="font-bold text-sm !text-white tracking-tight">
                Tenant Sovereignty
              </h4>
              <p className="text-slate-400 text-xs leading-relaxed font-medium">
                Enforcing highly sandboxed authorization access roles parameters
                protecting registered partner ledgers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
