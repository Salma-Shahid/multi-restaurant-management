import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-slate-900 border-t border-slate-950 text-slate-300 mt-20 rounded-t-3xl relative overflow-hidden">
      {/* Subtle geometric light accent layer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.04),transparent_40%)]"></div>

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10 grid grid-cols-1 md:grid-cols-4 gap-10 text-left">
        {/* Brand Information Column */}
        <div className="space-y-4">
          <Link
            to="/"
            className="text-xl font-black text-white tracking-tight flex items-center gap-2"
          >
             MultiResto
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            Next-generation dynamic table orchestration engine. Synchronizing
            high-end dining hubs with conversational machine intelligence
            seamlessly.
          </p>
          <div className="flex gap-3 pt-2">
            {/* Social Handles Matrix */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition text-xs font-bold"
            >
              LN
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition text-xs font-bold"
            >
              GH
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition text-xs font-bold"
            >
              X
            </a>
          </div>
        </div>

        {/* Quick Institutional Mappings Column */}
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400">
            Navigation Hub
          </h4>
          <ul className="space-y-2.5 text-xs font-semibold">
            <li>
              <Link to="/about" className="hover:text-white transition">
                About Corporate
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition">
                Contact Relations
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-white transition">
                Marketplace Registry
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Information Details Column */}
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400">
            Contact Channels
          </h4>
          <ul className="space-y-2.5 text-xs font-medium text-slate-400">
            <li className="flex items-center gap-2">
              🏢{" "}
              <span className="text-slate-300">
                HQ Corporate Tower, Phase 5 DHA
              </span>
            </li>
            <li className="flex items-center gap-2">
              📞 <span className="text-slate-300">+92 (21) 111-RESTO</span>
            </li>
            <li className="flex items-center gap-2">
              ✉️{" "}
              <span className="text-slate-300">relations@multiresto.com</span>
            </li>
          </ul>
        </div>

        {/* Operational Newsletter Subscription Column */}
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400">
            Corporate Briefs
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            Subscribe to our cluster telemetry briefs to receive updates
            regarding partner integrations.
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="corporate@mail.com"
              className="bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-xs outline-none focus:border-emerald-500 text-white font-medium w-full"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer shrink-0"
            >
              {subscribed ? "Joined!" : "Join"}
            </button>
          </form>
        </div>
      </div>

      {/* Copyright Disclaimer Row */}
      <div className="max-w-7xl mx-auto px-6 py-6 border-t border-white/5 flex flex-col md:flex-row justify-between text-left items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
        <div>© 2026 MultiResto Systems Inc. All Rights Reserved.</div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-slate-400 transition">
            Privacy Protocol
          </a>
          <a href="#" className="hover:text-slate-400 transition">
            SLA Constraints
          </a>
        </div>
      </div>
    </footer>
  );
}
