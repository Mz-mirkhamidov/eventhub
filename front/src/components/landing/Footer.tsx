import Link from "next/link";
import { API_BASE_URL } from "@/lib/config";

const footerLinks = {
  Platforma: [
    { label: "Imkoniyatlar", href: "#features" },
    { label: "Qanday ishlaydi", href: "#how-it-works" },
    { label: "Ro'yxatdan o'tish", href: "#cta" },
  ],
  Hamkorlar: [
    { label: "San'atkorlar", href: "#features" },
    { label: "Toyxonalar", href: "#features" },
    { label: "Bizneslar", href: "#features" },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1A56DB] text-lg font-bold text-white">
                E
              </span>
              <span className="text-xl font-bold text-slate-900">
                Event<span className="text-[#1A56DB]">hub</span>.uz
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              O&apos;zbekistondagi eng yirik tadbir platformasi. Toyxonalar, san&apos;atkorlar va
              barter tizimi.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-slate-900">{title}</h4>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-600 transition-colors hover:text-[#1A56DB]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="font-semibold text-slate-900">Aloqa</h4>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>info@eventhub.uz</li>
              <li>+998 71 000 00 00</li>
              <li>Toshkent, O&apos;zbekiston</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 sm:flex-row">
          <p className="text-sm text-slate-500">
            &copy; {year} Eventhub.uz. Barcha huquqlar himoyalangan.
          </p>
          <p className="text-xs text-slate-400">API: {API_BASE_URL}</p>
        </div>
      </div>
    </footer>
  );
}
