export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-[#1A56DB]/20 blur-3xl animate-pulse-glow" />
        <div className="absolute -right-32 top-40 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl animate-pulse-glow animation-delay-200" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A56DB]/5 via-white to-blue-50 animate-gradient" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="opacity-0-start animate-fade-in-up mb-6 inline-flex items-center gap-2 rounded-full border border-[#1A56DB]/20 bg-[#1A56DB]/5 px-4 py-1.5 text-sm font-medium text-[#1A56DB]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1A56DB] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#1A56DB]" />
            </span>
            O&apos;zbekiston uchun yaratilgan platforma
          </div>

          <h1 className="opacity-0-start animate-fade-in-up animation-delay-100 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl">
            O&apos;zbekistondagi eng yirik{" "}
            <span className="bg-gradient-to-r from-[#1A56DB] to-blue-400 bg-clip-text text-transparent">
              tadbir platformasi
            </span>
          </h1>

          <p className="opacity-0-start animate-fade-in-up animation-delay-200 mx-auto mt-6 max-w-2xl text-lg text-slate-600 sm:text-xl">
            Toyxonalar, san&apos;atkorlar va bizneslar uchun yagona ekotizim. Tadbiringizni
            rejalashtiring, band qiling va barter orqali hamkorlik qiling.
          </p>

          <div className="opacity-0-start animate-fade-in-up animation-delay-300 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="/register"
              className="w-full rounded-full bg-[#1A56DB] px-8 py-4 text-center text-base font-semibold text-white shadow-xl shadow-[#1A56DB]/30 transition-all hover:bg-[#1444b0] hover:shadow-2xl hover:shadow-[#1A56DB]/40 sm:w-auto"
            >
              Ro&apos;yxatdan o&apos;tish
            </a>
            <a
              href="#how-it-works"
              className="w-full rounded-full border-2 border-[#1A56DB] bg-white px-8 py-4 text-center text-base font-semibold text-[#1A56DB] transition-all hover:bg-[#1A56DB]/5 sm:w-auto"
            >
              Ko&apos;proq bilish
            </a>
          </div>

          <div className="opacity-0-start animate-fade-in-up animation-delay-400 mt-16 grid grid-cols-3 gap-6 border-t border-slate-200 pt-10 sm:gap-12">
            {[
              { value: "500+", label: "San'atkorlar" },
              { value: "200+", label: "Toyxonalar" },
              { value: "1000+", label: "Tadbirlar" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-[#1A56DB] sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto mt-16 max-w-5xl animate-float">
          <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-2 shadow-2xl shadow-[#1A56DB]/10 backdrop-blur sm:p-3">
            <div className="overflow-hidden rounded-xl bg-gradient-to-br from-[#1A56DB] to-blue-600 p-8 sm:p-12">
              <div className="grid gap-4 sm:grid-cols-3">
                {["Toyxona bron", "Artist topish", "Barter taklif"].map((item, i) => (
                  <div key={item} className="rounded-lg bg-white/15 px-4 py-6 text-center backdrop-blur-sm">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-2xl">
                      {i === 0 ? "🏛️" : i === 1 ? "🎤" : "🤝"}
                    </div>
                    <p className="font-semibold text-white">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
