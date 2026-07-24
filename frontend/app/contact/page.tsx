"use client";

import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <main className="min-h-screen bg-transparent px-4 py-8 sm:px-6 lg:px-8 animate-[fadeInUp_0.4s_ease-out]">
      <div className="mx-auto max-w-xl">
        <div className="mb-6 rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Support & Feedback</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Get in touch</h1>
          <p className="mt-2 text-sm text-slate-600">Have questions or feature suggestions? Send us a message.</p>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
          {submitted ? (
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold text-emerald-700 mb-2">Message Sent!</h2>
              <p className="text-slate-600 text-sm mb-4">Thank you for reaching out. We will get back to you soon.</p>
              <button onClick={() => setSubmitted(false)} className="btn btn-muted">Send another message</button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-slate-700">Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your Name"
                  className="input"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="input"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-slate-700">Message</label>
                <textarea
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Type your message here..."
                  className="input h-32"
                />
              </div>
              <button type="submit" className="btn btn-primary w-full">Send Message</button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
