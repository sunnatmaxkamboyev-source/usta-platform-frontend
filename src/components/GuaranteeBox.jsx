import { useTranslation } from "react-i18next";

import {
  FaUserTie,
  FaClipboardCheck,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaClock,
  FaComments,
} from "react-icons/fa";

export default function GuaranteeBox() {
  const { t } = useTranslation();

  const items = [
    {
      icon: <FaUserTie />,
      title: t("guarantee.items.masterInfo.title"),
      description: t("guarantee.items.masterInfo.description"),
    },
    {
      icon: <FaClipboardCheck />,
      title: t("guarantee.items.detailedVacancies.title"),
      description: t("guarantee.items.detailedVacancies.description"),
    },
    {
      icon: <FaMapMarkerAlt />,
      title: t("guarantee.items.localMasters.title"),
      description: t("guarantee.items.localMasters.description"),
    },
    {
      icon: <FaPhoneAlt />,
      title: t("guarantee.items.quickContact.title"),
      description: t("guarantee.items.quickContact.description"),
    },
    {
      icon: <FaClock />,
      title: t("guarantee.items.agreedTime.title"),
      description: t("guarantee.items.agreedTime.description"),
    },
    {
      icon: <FaComments />,
      title: t("guarantee.items.directCommunication.title"),
      description: t("guarantee.items.directCommunication.description"),
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block text-brand font-bold text-sm tracking-widest mb-3">
            {t("guarantee.badge")}
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
            {t("guarantee.title")}
          </h2>

          <p className="text-gray-500 leading-7">
            {t("guarantee.description")}
          </p>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.title}
              className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-xl bg-navy text-white flex items-center justify-center mb-5">
                {item.icon}
              </div>

              <h3 className="text-lg font-bold text-navy mb-3">
                {item.title}
              </h3>

              <p className="text-sm text-gray-500 leading-6">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}