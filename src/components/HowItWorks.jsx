
import { useTranslation } from "react-i18next";
import {
  FaCheck,
  FaSearch,
  FaPhoneAlt,
  FaTools,
} from "react-icons/fa";

export default function HowItWorks() {
  const { t } = useTranslation();

  const steps = [
    {
      number: "01",
      icon: FaSearch,
      title: t("howItWorks.steps.find.title"),
      description: t("howItWorks.steps.find.description"),
    },
    {
      number: "02",
      icon: FaPhoneAlt,
      title: t("howItWorks.steps.contact.title"),
      description: t("howItWorks.steps.contact.description"),
    },
    {
      number: "03",
      icon: FaTools,
      title: t("howItWorks.steps.agree.title"),
      description: t("howItWorks.steps.agree.description"),
    },
  ];

  return (
    <section className="bg-white py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        {/* HEADER */}
        <div className="mb-8 grid items-center gap-6 lg:grid-cols-2">
          {/* IMAGE */}
          <div className="relative min-w-0">
            <div className="flex min-h-[200px] items-center justify-center overflow-hidden rounded-2xl bg-slate-50 sm:min-h-[260px]">
              <img
                src="/images/how-it-works.png"
                alt={t("howItWorks.imageAlt")}
                className="block h-auto max-h-[320px] w-full object-contain sm:max-h-[340px]"
                loading="lazy"
              />
            </div>

            {/* BADGE */}
            <div className="absolute bottom-3 left-3 flex max-w-[calc(100%-24px)] items-center gap-2 rounded-xl border border-slate-100 bg-white/95 px-3 py-2 shadow-md">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                <FaCheck size={13} />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-slate-400">
                  {t("howItWorks.badge")}
                </p>
                <p className="text-sm font-bold text-navy">
                  {t("howItWorks.badgeTitle")}
                </p>
              </div>
            </div>
          </div>

          {/* TEXT */}
          <div className="lg:pl-3">
            <span className="text-xs font-bold uppercase tracking-widest text-brand">
              {t("howItWorks.smallTitle")}
            </span>

            <h2 className="mt-2 text-2xl font-extrabold leading-tight text-navy sm:text-3xl">
              {t("howItWorks.title")}
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              {t("howItWorks.description")}
            </p>
          </div>
        </div>

        {/* STEPS */}
        <div className="grid gap-3 sm:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <article
                key={step.number}
                className="group relative flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-md"
              >
                <span className="absolute right-3 top-3 text-2xl font-black text-slate-200">
                  {step.number}
                </span>

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy text-white transition-colors group-hover:bg-brand">
                  <Icon size={15} />
                </div>

                <div className="relative min-w-0 pr-5">
                  <h3 className="text-sm font-bold leading-5 text-navy">
                    {step.title}
                  </h3>

                  <p className="mt-1.5 text-xs leading-5 text-slate-500 sm:text-sm">
                    {step.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
