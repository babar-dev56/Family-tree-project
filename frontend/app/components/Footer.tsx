import { navigationItems } from "./navigationData";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-gray-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 py-8 text-white shadow-[0_-10px_30px_rgba(0,0,0,0.2)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-md">
          <h2 className="text-xl font-semibold text-cyan-400">Family Tree</h2>
          <p className="mt-2 text-sm leading-6 text-gray-300">
            Preserving family stories and meaningful connections with a modern, welcoming experience.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {navigationItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full border border-gray-700 bg-white/5 px-4 py-2 text-sm font-medium text-gray-200 transition duration-300 ease-out hover:-translate-y-1 hover:border-cyan-400 hover:bg-cyan-500 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}