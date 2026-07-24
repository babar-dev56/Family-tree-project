"use client";

import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header>
      <nav className="fixed left-0 top-0 z-50 w-full bg-white/95 shadow-md backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div>
            <h1 className="text-xl font-bold text-blue-600 sm:text-2xl">Family Tree</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 transition hover:border-blue-300 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 md:hidden"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="mr-2">Menu</span>
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>

            <a href="/members/add" className="hidden sm:inline-flex items-center gap-2 rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-white shadow-sm transform transition duration-200 hover:-translate-y-1 hover:scale-105 hover:shadow-2xl active:translate-y-0 btn-3d">
              Add Family Member
            </a>

            <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 sm:px-5">
              Login
            </button>
          </div>

          <div className={`w-full md:w-auto ${menuOpen ? "block" : "hidden"} md:block`}>
            <ul className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white/95 p-4 text-sm font-medium text-gray-700 shadow-sm md:flex-row md:border-none md:bg-transparent md:p-0 md:shadow-none md:gap-6 md:text-base md:items-center">
              <li>
                <a href="/" className="block rounded-lg px-3 py-2 transition hover:bg-blue-50 hover:text-blue-600 md:p-0 md:hover:bg-transparent">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="block rounded-lg px-3 py-2 transition hover:bg-blue-50 hover:text-blue-600 md:p-0 md:hover:bg-transparent">
                  About
                </a>
              </li>
              <li>
                <a href="/members" className="block rounded-lg px-3 py-2 transition hover:bg-blue-50 hover:text-blue-600 md:p-0 md:hover:bg-transparent">
                  Members
                </a>
              </li>
              <li>
                <a href="/family-tree" className="block rounded-lg px-3 py-2 transition hover:bg-blue-50 hover:text-blue-600 md:p-0 md:hover:bg-transparent">
                  Family Tree
                </a>
              </li>
              <li>
                <a href="/contact" className="block rounded-lg px-3 py-2 transition hover:bg-blue-50 hover:text-blue-600 md:p-0 md:hover:bg-transparent">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
