"use client";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-transparent px-4 py-8 sm:px-6 lg:px-8 animate-[fadeInUp_0.4s_ease-out]">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">Our Story</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">About the Family Tree Project</h1>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.06)] space-y-6 text-slate-700 leading-relaxed">
          <p className="text-lg text-slate-800 font-medium">
            The Family Tree Project is a modern tool designed to help you preserve, visualize, and share your family's history across generations.
          </p>
          <p>
            Whether you want to document your lineage, record memories, or browse the relationships between ancestors and descendants, our responsive tree visualization makes history feel alive.
          </p>
          <div className="border-t border-slate-100 my-6 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Key Features</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Interactive Family Tree browser with visual generation mapping.</li>
              <li>Complete member registry database for logging profile details, age, and parent-child relations.</li>
              <li>Fully automated parent-child relative resolving.</li>
              <li>Responsive web design optimised for desktops, tablets, and mobile screens.</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
