
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  FaChevronDown,
  FaUserTie,
  FaArrowRight,
  FaQuestionCircle,
} from "react-icons/fa";

export default function FAQ() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: t("faq.items.platform.question"),
      answer: t("faq.items.platform.answer"),
    },
    {
      question: t("faq.items.registration.question"),
      answer: t("faq.items.registration.answer"),
    },
    {
      question: t("faq.items.contact.question"),
      answer: t("faq.items.contact.answer"),
    },
    {
      question: t("faq.items.becomeMaster.question"),
      answer: t("faq.items.becomeMaster.answer"),
    },
    {
      question: t("faq.items.editVacancy.question"),
      answer: t("faq.items.editVacancy.answer"),
    },
    {
      question: t("faq.items.payment.question"),
      answer: t("faq.items.payment.answer"),
    },
  ];

  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-slate-50 py-20 sm:py-24"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-cyan-200/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
            <FaQuestionCircle />
            <span>{t("faq.badge")}</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {t("faq.title")}
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
            {t("faq.description")}
          </p>

          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-blue-600" />
        </div>

        {/* FAQ layout */}
        <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          {/* Left information panel */}
          <div className="rounded-3xl bg-[#0B1530] p-7 text-white shadow-xl shadow-slate-900/10 sm:p-9">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300">
              <FaQuestionCircle size={25} />
            </div>

            <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
              USTA PLATFORM
            </p>

            <h3 className="mt-3 text-2xl font-bold leading-snug sm:text-3xl">
              {t("faq.title")}
            </h3>

            <p className="mt-4 text-sm leading-7 text-slate-300">
              {t("faq.description")}
            </p>

            <div className="my-7 h-px bg-white/10" />

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-blue-300">
                <FaUserTie size={17} />
              </div>

              <div>
                <h4 className="font-semibold text-white">
                  {t("faq.actions.becomeMaster.title")}
                </h4>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  {t("faq.actions.becomeMaster.description")}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/register")}
              className="mt-7 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-400/30"
            >
              {t("faq.actions.becomeMaster.button")}
              <FaArrowRight size={13} />
            </button>
          </div>

          {/* Questions */}
          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={index}
                  className={`overflow-hidden rounded-2xl border bg-white transition-all duration-200 ${
                    isOpen
                      ? "border-blue-200 shadow-lg shadow-blue-900/5"
                      : "border-slate-200 shadow-sm hover:border-slate-300"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenIndex(isOpen ? null : index)
                    }
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                  >
                    <span
                      className={`text-sm font-bold leading-6 sm:text-base ${
                        isOpen ? "text-blue-700" : "text-slate-800"
                      }`}
                    >
                      <span className="mr-3 text-xs font-bold text-slate-400">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {faq.question}
                    </span>

                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${
                        isOpen
                          ? "rotate-180 bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <FaChevronDown size={12} />
                    </span>
                  </button>

                  <div
                    className={`grid transition-all duration-300 ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 pl-12 text-sm leading-7 text-slate-500 sm:px-6 sm:pb-6 sm:pl-14">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
