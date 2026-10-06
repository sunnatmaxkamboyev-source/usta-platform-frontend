import { useNavigate } from "react-router-dom";

import {
  FaCheck,
  FaPhoneAlt,
  FaSearch,
  FaUserPlus,
} from "react-icons/fa";

import { useTranslation } from "react-i18next";

const features = [
  "repairInstallation",
  "plumbing",
  "electrical",
  "applianceRepair",
  "houseBuildingRepair",
  "otherSpecialists",
];

export default function AboutServices() {
  const navigate = useNavigate();

  const { t } = useTranslation();

  return (
    <section
      id="about"
      className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
    >
      {/* =========================
          LEFT CONTENT
      ========================== */}

      <div>
        {/* SMALL TITLE */}

        <p className="text-brand font-semibold text-sm mb-2">
          {t("about.badge")}
        </p>

        {/* TITLE */}

        <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4 leading-tight">
          {t("about.title")}
        </h2>

        {/* DESCRIPTION */}

        <p className="text-gray-500 mb-6 max-w-lg leading-6">
          {t("about.description")}
        </p>

        {/* FEATURES */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mb-8">
          {features.map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-2 text-sm text-navy font-medium"
            >
              <span className="w-5 h-5 rounded-full bg-blue-50 text-brand flex items-center justify-center shrink-0">
                <FaCheck size={10} />
              </span>

              {t(`about.features.${feature}`)}
            </div>
          ))}
        </div>

        {/* ACTIONS */}

        <div className="flex flex-col sm:flex-row gap-3 mb-6">

          {/* FIND MASTER */}

          <button
            type="button"
            onClick={() => navigate("/vakansiyalar")}
            className="inline-flex items-center justify-center gap-2 bg-brand text-white hover:bg-brand-dark transition-colors rounded-full px-6 py-3 font-semibold text-sm"
          >
            <FaSearch />

            {t("about.findMaster")}
          </button>

          {/* BECOME MASTER */}

          <button
            type="button"
            onClick={() => navigate("/register")}
            className="inline-flex items-center justify-center gap-2 border border-navy text-navy hover:bg-navy hover:text-white transition-colors rounded-full px-6 py-3 font-semibold text-sm"
          >
            <FaUserPlus />

            {t("about.becomeMaster")}
          </button>

        </div>

        {/* PHONE */}

        <a
          href="tel:+998881234567"
          className="inline-flex items-center gap-3 bg-navy text-white hover:bg-brand transition-colors rounded-xl px-5 py-4"
        >
          <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <FaPhoneAlt size={16} />
          </span>

          <div className="text-sm">
            <p className="text-gray-300">
              {t("about.contactText")}
            </p>

            <p className="font-semibold mt-1">
              +998 88 123 45 67
            </p>
          </div>
        </a>
      </div>

      {/* =========================
          IMAGE
      ========================== */}

      <div className="relative">
        <img
          src="/images/about-roof.png"
          alt={t("about.imageAlt")}
          className="w-full h-[420px] rounded-3xl object-cover"
        />

        {/* IMAGE BADGE */}

        <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
          <p className="text-xs text-gray-400 mb-1">
            Usta Platform
          </p>

          <p className="font-semibold text-navy">
            {t("about.imageTitle")}
          </p>
        </div>
      </div>
    </section>
  );
}