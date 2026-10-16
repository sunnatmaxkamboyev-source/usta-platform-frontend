import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  FaWrench,
  FaHome,
  FaBroom,
  FaTree,
  FaTools,
  FaBath,
  FaKey,
  FaPhoneAlt,
  FaArrowRight,
} from "react-icons/fa";

const services = [
  { icon: <FaWrench />, category: "santexnik", key: "plumbing" },
  { icon: <FaHome />, category: "tom-tamirlash", key: "roofRepair" },
  { icon: <FaBroom />, category: "zamburug-tozalash", key: "moldCleaning" },
  { icon: <FaTree />, category: "daraxt-kesish", key: "treeCutting" },
  { icon: <FaTools />, category: "maishiy-texnika", key: "applianceRepair" },
  { icon: <FaBath />, category: "hammom", key: "bathroomRepair" },
  { icon: <FaKey />, category: "qulfsoz", key: "locksmith" },
];

export default function ServicesGrid() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleServiceClick = (category) => {
    navigate(`/vakansiyalar?category=${encodeURIComponent(category)}`);
  };

  return (
    <section id="services" className="bg-slate-50/70 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        {/* SECTION HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <span className="inline-flex items-center gap-2 text-brand text-xs sm:text-sm font-bold uppercase tracking-[0.16em] mb-4">
            <span className="w-7 h-[2px] bg-brand rounded-full" />
            Usta Platform
            <span className="w-7 h-[2px] bg-brand rounded-full" />
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-navy mb-4">
            {t("services.title")}
          </h2>

          <p className="text-gray-500 leading-7 max-w-xl mx-auto">
            {t("services.description")}
          </p>
        </div>

        {/* SERVICE CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {services.map((service) => (
            <button
              key={service.category}
              type="button"
              onClick={() => handleServiceClick(service.category)}
              className="group relative text-left bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 min-h-[220px] flex flex-col items-start shadow-sm hover:shadow-xl hover:shadow-slate-200/60 hover:border-brand/40 hover:-translate-y-1 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#0F1B3D] text-white text-lg mb-6 group-hover:bg-brand group-hover:scale-105 transition-all duration-300">
                {service.icon}
              </div>

              <h3 className="text-base font-bold text-navy mb-2 group-hover:text-brand transition-colors">
                {t(`services.items.${service.key}.title`)}
              </h3>

              <p className="text-sm text-gray-500 leading-6 flex-1">
                {t(`services.items.${service.key}.description`)}
              </p>

              <div className="flex items-center gap-2 mt-5 text-sm font-semibold text-brand">
                <span>{t("services.viewVacancies")}</span>
                <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform duration-200" />
              </div>

              <span className="absolute top-5 right-5 w-2 h-2 rounded-full bg-brand/20 group-hover:bg-brand transition-colors" />
            </button>
          ))}

          {/* OTHER SERVICE */}
          <div className="relative overflow-hidden bg-[#0F1B3D] text-white rounded-2xl p-6 sm:p-7 min-h-[220px] flex flex-col justify-between shadow-sm">
            <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full border-[24px] border-white/5 pointer-events-none" />

            <div className="relative">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-brand text-white text-lg mb-6">
                <FaPhoneAlt />
              </div>

              <h3 className="font-bold text-lg mb-2">
                {t("services.other.title")}
              </h3>

              <p className="text-sm text-slate-300 leading-6">
                {t("services.other.description")}
              </p>
            </div>

            <a
              href="tel:+998881234567"
              className="relative mt-6 inline-flex items-center justify-center gap-2 bg-white text-navy hover:bg-brand hover:text-white rounded-xl px-4 py-3 text-sm font-bold w-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
            >
              <FaPhoneAlt className="text-xs" />
              {t("services.other.call")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}