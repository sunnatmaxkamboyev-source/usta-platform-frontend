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
} from "react-icons/fa";

const services = [
  {
    icon: <FaWrench />,
    category: "santexnik",
    key: "plumbing",
  },
  {
    icon: <FaHome />,
    category: "tom-tamirlash",
    key: "roofRepair",
  },
  {
    icon: <FaBroom />,
    category: "zamburug-tozalash",
    key: "moldCleaning",
  },
  {
    icon: <FaTree />,
    category: "daraxt-kesish",
    key: "treeCutting",
  },
  {
    icon: <FaTools />,
    category: "maishiy-texnika",
    key: "applianceRepair",
  },
  {
    icon: <FaBath />,
    category: "hammom",
    key: "bathroomRepair",
  },
  {
    icon: <FaKey />,
    category: "qulfsoz",
    key: "locksmith",
  },
];

export default function ServicesGrid() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleServiceClick = (category) => {
    navigate(`/vakansiyalar?category=${category}`);
  };

  return (
    <section
      id="services"
      className="max-w-7xl mx-auto px-6 py-16"
    >
      {/* HEADER */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-navy mb-3">
          {t("services.title")}
        </h2>

        <p className="text-gray-500 max-w-lg mx-auto">
          {t("services.description")}
        </p>
      </div>

      {/* SERVICES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service) => (
          <button
            key={service.category}
            type="button"
            onClick={() => handleServiceClick(service.category)}
            className="text-left border border-gray-100 rounded-2xl p-5 hover:shadow-md hover:-translate-y-1 transition-all duration-200 bg-white cursor-pointer"
          >
            {/* ICON */}
            <div className="w-10 h-10 rounded-xl bg-navy text-white flex items-center justify-center mb-4">
              {service.icon}
            </div>

            {/* TITLE */}
            <h3 className="font-semibold text-navy mb-1">
              {t(`services.items.${service.key}.title`)}
            </h3>

            {/* DESCRIPTION */}
            <p className="text-sm text-gray-500">
              {t(`services.items.${service.key}.description`)}
            </p>

            {/* LINK */}
            <div className="mt-4 text-sm font-medium text-brand">
              {t("services.viewVacancies")} →
            </div>
          </button>
        ))}

        {/* OTHER SERVICE */}
        <div className="bg-brand text-white rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold mb-1">
              {t("services.other.title")}
            </h3>

            <p className="text-sm text-white/90">
              {t("services.other.description")}
            </p>
          </div>

          <a
            href="tel:+998881234567"
            className="mt-4 inline-flex items-center justify-center gap-2 bg-white text-brand rounded-full px-4 py-2 text-sm font-semibold w-fit"
          >
            <FaPhoneAlt size={12} />
            {t("services.other.call")}
          </a>
        </div>
      </div>
    </section>
  );
}