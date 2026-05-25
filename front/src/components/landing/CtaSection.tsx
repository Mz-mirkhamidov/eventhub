export default function CtaSection() {
  return (
    <section id="cta" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A56DB] via-[#1A56DB] to-blue-600 px-8 py-16 text-center shadow-2xl shadow-[#1A56DB]/30 sm:px-16 sm:py-20">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          </div>

          <div className="relative">
            <h2 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              Tadbiringizni bugun rejalashtiring
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-blue-100">
              Minglab foydalanuvchilar Eventhub.uz orqali muvaffaqiyatli tadbirlar tashkil qilmoqda
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/register"
                className="w-full rounded-full bg-white px-8 py-4 text-base font-semibold text-[#1A56DB] shadow-lg transition-all hover:bg-blue-50 sm:w-auto"
              >
                Ro&apos;yxatdan o&apos;tish
              </a>
              <a
                href="#how-it-works"
                className="w-full rounded-full border-2 border-white/80 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white/10 sm:w-auto"
              >
                Ko&apos;proq bilish
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
