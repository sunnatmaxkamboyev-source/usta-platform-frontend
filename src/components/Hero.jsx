import {
  FaCheck,
  FaPhoneAlt,
  FaSearch,
  FaUserPlus,
} from "react-icons/fa";

import {
  MdVerified,
  MdAccessTime,
  MdLocationOn,
  MdEventAvailable,
} from "react-icons/md";

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const badges = [
  { icon: <MdVerified />, key: "trustedMasters" },
  { icon: <MdAccessTime />, key: "service24" },
  { icon: <MdLocationOn />, key: "localExperts" },
  { icon: <MdEventAvailable />, key: "convenientTime" },
];

export default function Hero() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="bg-navy text-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-[0.85fr_1.5fr_0.85fr] items-stretch">
        {/* LEFT IMAGE */}
        <div className="hidden md:block relative min-h-[440px] lg:min-h-[520px]">
          <img
            src="/images/hero-left.png"
            alt={t("hero.imageAlt")}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-navy/20 to-navy" />
        </div>

        {/* CENTER CONTENT */}
        <div className="relative z-10 flex flex-col justify-center text-center px-6 sm:px-10 py-16 md:py-20 lg:px-12">
          <div className="w-16 h-1 bg-brand rounded-full mx-auto mb-6" />

          <p className="text-xs sm:text-sm uppercase tracking-[0.16em] text-blue-200 mb-5 leading-6">
            {t("hero.smallText1")}
            <span className="mx-2 text-brand">•</span>
            {t("hero.smallText2")}
            <span className="mx-2 text-brand">•</span>
            {t("hero.smallText3")}
          </p>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.15] tracking-tight mb-6">
            {t("hero.title")}
            <span className="block text-brand mt-2">
              {t("hero.titleHighlight")}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8 leading-7">
            {t("hero.description")}
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-6 text-sm text-slate-200 mb-9">
            <span className="flex items-center gap-2">
              <FaCheck className="text-brand shrink-0" />
              {t("hero.benefitTrusted")}
            </span>

            <span className="flex items-center gap-2">
              <FaCheck className="text-brand shrink-0" />
              {t("hero.benefitDirect")}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/vakansiyalar")}
              className="inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark text-white px-7 py-3.5 rounded-xl font-semibold shadow-lg shadow-blue-950/20 transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <FaSearch />
              {t("hero.findMaster")}
            </button>

            <button
              type="button"
              onClick={() => navigate("/register")}
              className="inline-flex items-center justify-center gap-2 border border-white/20 bg-white/5 hover:bg-white/10 px-7 py-3.5 rounded-xl font-semibold transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <FaUserPlus />
              {t("hero.becomeMaster")}
            </button>
          </div>

          <a
            href="tel:+998881234567"
            className="inline-flex flex-wrap items-center justify-center gap-2 text-slate-300 hover:text-white transition-colors mt-7 text-sm"
          >
            <FaPhoneAlt className="text-brand" />
            <span>{t("hero.callUs")}</span>
            <span className="font-semibold text-white">
              +998 88 123 45 67
            </span>
          </a>
        </div>

        {/* RIGHT IMAGE */}
        <div className="hidden md:block relative min-h-[440px] lg:min-h-[520px]">
          <img
            src="/images/hero-right.png"
            alt={t("hero.imageAlt")}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-navy/20 to-navy" />
        </div>
      </div>

      {/* BADGES */}
      <div className="border-t border-white/10 bg-[#0b1532]/60">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-y-5 gap-x-4 px-5 sm:px-8 py-6">
          {badges.map((badge) => (
            <div
              key={badge.key}
              className="flex items-center justify-center gap-2.5 text-xs sm:text-sm text-slate-200"
            >
              <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand/10 border border-brand/20 text-brand text-lg shrink-0">
                {badge.icon}
              </span>

              <span>{t(`hero.badges.${badge.key}`)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}