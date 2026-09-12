import React, { useState } from "react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-slate-100 mt-6 text-left animate-fade-in">
      <div className="mb-6">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Corporate Relations Intake Form
        </h2>
        <p className="text-slate-400 text-xs font-medium mt-1">
          Submit your system diagnostics inquiry or partner integration
          telemetry tickets here.
        </p>
      </div>

      {submitted ? (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-6 rounded-2xl text-center text-sm font-semibold">
          Ticket Successfully Mounted! Our network operations center team will
          interface shortly.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-1">
              Corporate Identity / Name
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="E.g., Alexander Mercer"
            />
          </div>
          <div>
            <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-1">
              Secure Return Mail Endpoint
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="corporate@mail.com"
            />
          </div>
          <div>
            <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-1">
              Telemetry Domain / Message Context
            </label>
            <textarea
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium h-28 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Outline integration details or API requests..."
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition tracking-wide text-sm cursor-pointer"
          >
            Dispatch Telemetry Ticket
          </button>
        </form>
      )}
    </div>
  );
}
