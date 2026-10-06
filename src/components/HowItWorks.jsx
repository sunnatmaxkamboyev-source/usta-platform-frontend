import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import {
  FaCheck,
  FaSearch,
  FaPhoneAlt,
  FaTools,
} from "react-icons/fa";

export default function HowItWorks() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const steps = [
    {
      number: "01",
      icon: <FaSearch />,
      title: t("howItWorks.steps.find.title"),
      description: t("howItWorks.steps.find.description"),
    },
    {
      number: "02",
      icon: <FaPhoneAlt />,
      title: t("howItWorks.steps.contact.title"),
      description: t("howItWorks.steps.contact.description"),
    },
    {
      number: "03",
      icon: <FaTools />,
      title: t("howItWorks.steps.agree.title"),
      description: t("howItWorks.steps.agree.description"),
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* HEADER */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-14">
          {/* IMAGE */}
          <div className="relative">
            <div className="overflow-hidden rounded-3xl bg-gray-100">
              <img
                src="/images/how-it-works.png"
                alt={t("howItWorks.imageAlt")}
                className="w-full h-[360px] object-cover"
              />
            </div>

            {/* BADGE */}
            <div className="absolute -bottom-6 -right-4 md:right-8 bg-white shadow-xl rounded-2xl px-5 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center">
                <FaCheck size={15} />
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  {t("howItWorks.badge")}
                </p>

                <p className="font-bold text-navy">
                  {t("howItWorks.badgeTitle")}
                </p>
              </div>
            </div>
          </div>

          {/* TEXT */}
          <div>
            <span className="inline-block text-brand font-bold text-sm tracking-widest mb-3">
              {t("howItWorks.smallTitle")}
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-navy leading-tight mb-5">
              {t("howItWorks.title")}
            </h2>

            <p className="text-gray-500 leading-7 max-w-xl">
              {t("howItWorks.description")}
            </p>

            <button
              type="button"
              onClick={() => navigate("/vakansiyalar")}
              className="mt-7 inline-flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              {t("howItWorks.button")}
              <span>→</span>
            </button>
          </div>
        </div>

        {/* STEPS */}
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative bg-gray-50 border border-gray-100 rounded-2xl p-7 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
            >
              {/* NUMBER */}
              <span className="absolute top-5 right-6 text-4xl font-black text-gray-100">
                {step.number}
              </span>

              {/* ICON */}
              <div className="w-12 h-12 rounded-xl bg-navy text-white flex items-center justify-center mb-5">
                {step.icon}
              </div>

              {/* TITLE */}
              <h3 className="text-lg font-bold text-navy mb-3">
                {step.title}
              </h3>

              {/* DESCRIPTION */}
              <p className="text-sm text-gray-500 leading-6">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}