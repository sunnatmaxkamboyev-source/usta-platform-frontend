import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  FaCheck,
  FaPhoneAlt,
  FaSearch,
  FaUserPlus,
} from "react-icons/fa";

export default function CTABanner() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        <div>
          <p className="text-brand font-semibold text-sm mb-3">
            USTA PLATFORM
          </p>

          <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-5">
            {t("cta.title")}
          </h2>

          <p className="text-gray-300 leading-6 max-w-xl mb-6">
            {t("cta.description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-sm text-gray-300 mb-7">
            <span className="flex items-center gap-2">
              <FaCheck className="text-brand" />
              {t("cta.benefits.availableVacancies")}
            </span>

            <span className="flex items-center gap-2">
              <FaCheck className="text-brand" />
              {t("cta.benefits.directContact")}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() =>
                navigate("/vakansiyalar")
              }
              className="inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark transition-colors px-6 py-3 rounded-full font-semibold"
            >
              <FaSearch />
              {t("cta.findMaster")}
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/register")
              }
              className="inline-flex items-center justify-center gap-2 bg-white text-navy hover:bg-gray-100 transition-colors px-6 py-3 rounded-full font-semibold"
            >
              <FaUserPlus />
              {t("cta.becomeMaster")}
            </button>
          </div>

          <a
            href="tel:+998943851181"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors mt-5 text-sm"
          >
            <FaPhoneAlt />

            {t("cta.phoneLabel")}

            <span className="font-semibold text-white">
              +998 94 385 11 81
            </span>
          </a>
        </div>

        <div>
          <img
            src="/images/cta-banner.png"
            alt={t("cta.imageAlt")}
            className="w-full h-80 md:h-[360px] rounded-2xl object-cover"
          />
        </div>

      </div>
    </section>
  );
}