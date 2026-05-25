const steps = [
  {
    step: "01",
    title: "Ro'yxatdan o'ting",
    description:
      "Mijoz, san'atkor, toyxona yoki biznes sifatida bepul hisob yarating va profilingizni to'ldiring.",
  },
  {
    step: "02",
    title: "Qidiring va tanlang",
    description:
      "Toyxona yoki san'atkorlarni filtrlash orqali toping, narxlarni ko'ring va band qiling.",
  },
  {
    step: "03",
    title: "Tadbiringizni o'tkazing",
    description:
      "Bronni tasdiqlang, to'lovni amalga oshiring va muvaffaqiyatli tadbir tashkil eting.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#1A56DB]">
            Qanday ishlaydi
          </h2>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            3 oddiy qadamda boshlang
          </p>
        </div>

        <div className="relative mt-16">
          <div className="absolute left-0 right-0 top-12 hidden h-0.5 bg-gradient-to-r from-transparent via-[#1A56DB]/30 to-transparent md:block" />

          <div className="grid gap-12 md:grid-cols-3 md:gap-8">
            {steps.map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1A56DB] to-blue-500 text-2xl font-bold text-white shadow-lg shadow-[#1A56DB]/30">
                  {item.step}
                </div>
                <h3 className="mt-6 text-xl font-bold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
