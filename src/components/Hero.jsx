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
  {
    icon: <MdVerified />,
    key: "trustedMasters",
  },
  {
    icon: <MdAccessTime />,
    key: "service24",
  },
  {
    icon: <MdLocationOn />,
    key: "localExperts",
  },
  {
    icon: <MdEventAvailable />,
    key: "convenientTime",
  },
];

export default function Hero() {
  const navigate = useNavigate();

  const { t } = useTranslation();

  return (
    <section className="bg-navy text-white">

      {/* =========================
          HERO MAIN
      ========================== */}

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.4fr_1fr] items-stretch">

        {/* =========================
            LEFT IMAGE
        ========================== */}

        <div className="hidden md:block">
          <img
            src="/images/hero-left.png"
            alt={t("hero.imageAlt")}
            className="w-full h-full object-cover"
          />
        </div>

        {/* =========================
            CENTER CONTENT
        ========================== */}

        <div className="px-6 py-14 text-center flex flex-col justify-center">

          {/* SMALL TEXT */}

          <p className="text-sm text-gray-300 mb-3">
            {t("hero.smallText1")}

            <span className="mx-2">•</span>

            {t("hero.smallText2")}

            <span className="mx-2">•</span>

            {t("hero.smallText3")}
          </p>

          {/* TITLE */}

          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">

            {t("hero.title")}

            <span className="text-brand">
              {" "}
              {t("hero.titleHighlight")}
            </span>

          </h1>

          {/* DESCRIPTION */}

          <p className="text-gray-300 max-w-xl mx-auto mb-6 leading-6">
            {t("hero.description")}
          </p>

          {/* BENEFITS */}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm text-gray-300 mb-7">

            <span className="flex items-center gap-2">
              <FaCheck className="text-brand" />

              {t("hero.benefitTrusted")}
            </span>

            <span className="flex items-center gap-2">
              <FaCheck className="text-brand" />

              {t("hero.benefitDirect")}
            </span>

          </div>

          {/* ACTIONS */}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">

            {/* FIND MASTER */}

            <button
              type="button"
              onClick={() => navigate("/vakansiyalar")}
              className="inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark transition-colors px-6 py-3 rounded-full font-semibold w-full sm:w-auto"
            >
              <FaSearch />

              {t("hero.findMaster")}
            </button>

            {/* BECOME MASTER */}

            <button
              type="button"
              onClick={() => navigate("/register")}
              className="inline-flex items-center justify-center gap-2 bg-white text-navy hover:bg-gray-100 transition-colors px-6 py-3 rounded-full font-semibold w-full sm:w-auto"
            >
              <FaUserPlus />

              {t("hero.becomeMaster")}
            </button>

          </div>

          {/* PHONE */}

          <a
            href="tel:+998881234567"
            className="inline-flex items-center justify-center gap-2 text-gray-300 hover:text-white transition-colors mt-5 text-sm"
          >
            <FaPhoneAlt />

            {t("hero.callUs")}

            <span className="font-semibold text-white">
              +998 88 123 45 67
            </span>
          </a>

        </div>

        {/* =========================
            RIGHT IMAGE
        ========================== */}

        <div className="hidden md:block">
          <img
            src="/images/hero-right.png"
            alt={t("hero.imageAlt")}
            className="w-full h-full object-cover"
          />
        </div>

      </div>

      {/* =========================
          BADGES
      ========================== */}

      <div className="border-t border-white/10">

        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 px-6 py-5">

          {badges.map((badge) => (
            <div
              key={badge.key}
              className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-200"
            >
              <span className="text-brand text-lg">
                {badge.icon}
              </span>

              {t(`hero.badges.${badge.key}`)}
            </div>
          ))}

        </div>

      </div>

    </section>
  );
}