"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { href: "#features", label: "Imkoniyatlar" },
  { href: "#how-it-works", label: "Qanday ishlaydi" },
  { href: "#cta", label: "Boshlash" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/60 bg-white/85 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1A56DB] text-lg font-bold text-white shadow-lg shadow-[#1A56DB]/30 transition-transform group-hover:scale-105">
            E
          </span>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Event<span className="text-[#1A56DB]">hub</span>
            <span className="text-sm font-medium text-slate-500">.uz</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-[#1A56DB]"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-[#1A56DB]"
          >
            Kirish
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-[#1A56DB] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#1A56DB]/25 transition-all hover:bg-[#1444b0] hover:shadow-lg hover:shadow-[#1A56DB]/30"
          >
            Ro&apos;yxatdan o&apos;tish
          </Link>
        </div>

        <button
          type="button"
          aria-label="Menyuni ochish"
          className="inline-flex items-center justify-center rounded-lg p-2 text-slate-700 md:hidden"
          onClick={() => setOpen(!open)}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 md:hidden">
          <ul className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block py-2 text-base font-medium text-slate-700"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/login"
                className="block py-2 text-base font-medium text-slate-700"
                onClick={() => setOpen(false)}
              >
                Kirish
              </Link>
            </li>
            <li>
              <Link
                href="/register"
                className="mt-2 block rounded-full bg-[#1A56DB] px-5 py-3 text-center text-sm font-semibold text-white"
                onClick={() => setOpen(false)}
              >
                Ro&apos;yxatdan o&apos;tish
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
