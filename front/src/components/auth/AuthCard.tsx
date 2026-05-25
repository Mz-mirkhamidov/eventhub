import Link from "next/link";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footerText: string;
  footerHref: string;
  footerLinkLabel: string;
}

export default function AuthCard({
  title,
  subtitle,
  children,
  footerText,
  footerHref,
  footerLinkLabel,
}: AuthCardProps) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-4 py-4">
        <Link href="/" className="mx-auto flex max-w-md items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1A56DB] text-sm font-bold text-white">
            E
          </span>
          <span className="text-lg font-bold text-slate-900">
            Event<span className="text-[#1A56DB]">hub</span>.uz
          </span>
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            {children}
          </div>

          <p className="mt-6 text-center text-sm text-slate-600">
            {footerText}{" "}
            <Link href={footerHref} className="font-medium text-[#1A56DB] hover:underline">
              {footerLinkLabel}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
