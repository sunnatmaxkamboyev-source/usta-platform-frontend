import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import {
  FaChevronDown,
  FaSearch,
  FaUserTie,
  FaPhoneAlt,
} from "react-icons/fa";

export default function FAQ() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [openIndex, setOpenIndex] = useState(null);

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

  const toggleFAQ = (index) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block text-brand font-bold text-sm tracking-widest mb-3">
            {t("faq.badge")}
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
            {t("faq.title")}
          </h2>

          <p className="text-gray-500 leading-7">
            {t("faq.description")}
          </p>
        </div>

        {/* FAQ LIST */}
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
                  isOpen
                    ? "border-brand shadow-sm"
                    : "border-gray-200"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between gap-5 text-left px-6 py-5 bg-white hover:bg-gray-50 transition"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-navy">
                    {faq.question}
                  </span>

                  <span
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isOpen
                        ? "bg-brand text-white rotate-180"
                        : "bg-gray-100 text-navy"
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
                    <div className="px-6 pb-5">
                      <p className="text-sm text-gray-500 leading-7 border-t border-gray-100 pt-5">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid md:grid-cols-3 gap-5 mt-12">
          {/* FIND MASTER */}
          <button
            type="button"
            onClick={() => navigate("/vakansiyalar")}
            className="group text-left bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
          >
            <div className="w-11 h-11 rounded-xl bg-navy text-white flex items-center justify-center mb-5">
              <FaSearch />
            </div>

            <h3 className="font-bold text-navy mb-2">
              {t("faq.actions.findMaster.title")}
            </h3>

            <p className="text-sm text-gray-500 leading-6">
              {t("faq.actions.findMaster.description")}
            </p>

            <span className="inline-block mt-4 text-sm font-semibold text-brand group-hover:translate-x-1 transition-transform">
              {t("faq.actions.findMaster.button")} →
            </span>
          </button>

          {/* BECOME MASTER */}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="group text-left bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
          >
            <div className="w-11 h-11 rounded-xl bg-brand text-white flex items-center justify-center mb-5">
              <FaUserTie />
            </div>

            <h3 className="font-bold text-navy mb-2">
              {t("faq.actions.becomeMaster.title")}
            </h3>

            <p className="text-sm text-gray-500 leading-6">
              {t("faq.actions.becomeMaster.description")}
            </p>

            <span className="inline-block mt-4 text-sm font-semibold text-brand group-hover:translate-x-1 transition-transform">
              {t("faq.actions.becomeMaster.button")} →
            </span>
          </button>

          {/* CONTACT */}
          <a
            href="tel:+998881234567"
            className="group text-left bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
          >
            <div className="w-11 h-11 rounded-xl bg-navy text-white flex items-center justify-center mb-5">
              <FaPhoneAlt />
            </div>

            <h3 className="font-bold text-navy mb-2">
              {t("faq.actions.contact.title")}
            </h3>

            <p className="text-sm text-gray-500 leading-6">
              {t("faq.actions.contact.description")}
            </p>

            <span className="inline-block mt-4 text-sm font-semibold text-brand group-hover:translate-x-1 transition-transform">
              +998 88 123 45 67 →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}