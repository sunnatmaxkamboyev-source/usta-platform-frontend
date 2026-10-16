
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
      icon: FaUserTie,
      title: t("guarantee.items.masterInfo.title"),
      description: t("guarantee.items.masterInfo.description"),
    },
    {
      icon: FaClipboardCheck,
      title: t("guarantee.items.detailedVacancies.title"),
      description: t("guarantee.items.detailedVacancies.description"),
    },
    {
      icon: FaMapMarkerAlt,
      title: t("guarantee.items.localMasters.title"),
      description: t("guarantee.items.localMasters.description"),
    },
    {
      icon: FaPhoneAlt,
      title: t("guarantee.items.quickContact.title"),
      description: t("guarantee.items.quickContact.description"),
    },
    {
      icon: FaClock,
      title: t("guarantee.items.agreedTime.title"),
      description: t("guarantee.items.agreedTime.description"),
    },
    {
      icon: FaComments,
      title: t("guarantee.items.directCommunication.title"),
      description: t("guarantee.items.directCommunication.description"),
    },
  ];

  return (
    <section className="bg-slate-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="mb-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            {t("guarantee.badge")}
          </span>

          <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
            {t("guarantee.title")}
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
            {t("guarantee.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white p-4 transition-colors hover:border-blue-200"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Icon size={17} />
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-bold leading-5 text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
