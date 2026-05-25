const features = [
  {
    title: "Toyxonalar",
    description:
      "Shahar bo'ylab eng yaxshi toyxonalarni toping, narxlarni solishtiring va onlayn band qiling.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    title: "San'atkorlar",
    description:
      "DJ, qo'shiqchi, fotograf va boshqa mutaxassislarni toifalar bo'yicha qidiring va to'g'ridan-to'g'ri bog'laning.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
  },
  {
    title: "Barter tizimi",
    description:
      "Bizneslar mahsulotlarini ijtimoiy tarmoqdagi obunachilar evaziga san'atkorlar bilan almashtiradi.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-slate-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#1A56DB]">
            Imkoniyatlar
          </h2>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Barcha tadbir ehtiyojlari bir joyda
          </p>
          <p className="mt-4 text-lg text-slate-600">
            Eventhub.uz orqali to&apos;liq tadbir rejalashtirish jarayonini boshqaring
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#1A56DB]/30 hover:shadow-xl hover:shadow-[#1A56DB]/10"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-6 inline-flex rounded-xl bg-[#1A56DB]/10 p-4 text-[#1A56DB] transition-colors group-hover:bg-[#1A56DB] group-hover:text-white">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
              <p className="mt-3 leading-relaxed text-slate-600">{feature.description}</p>
              <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-[#1A56DB]/5 transition-transform group-hover:scale-150" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
