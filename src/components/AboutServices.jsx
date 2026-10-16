
import { useNavigate } from "react-router-dom";
import { FaCheck, FaUserPlus } from "react-icons/fa";
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
      className="mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-16"
    >
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        {/* CONTENT */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-brand">
            <span className="h-2 w-2 rounded-full bg-brand" />
            Usta Platform
          </span>

          <h2 className="mb-3 mt-4 text-2xl font-extrabold leading-tight tracking-tight text-navy sm:text-3xl">
            {t("about.title")}
          </h2>

          <p className="mb-5 max-w-lg text-sm leading-6 text-slate-500">
            {t("about.description")}
          </p>

          {/* SERVICES */}
          <div className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-2.5 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-100 text-brand">
                  <FaCheck size={11} />
                </span>

                <span className="text-sm font-medium text-slate-700">
                  {t(`about.features.${feature}`)}
                </span>
              </div>
            ))}
          </div>

          {/* ACTION */}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand"
          >
            <FaUserPlus size={14} />
            {t("about.becomeMaster")}
          </button>
        </div>

        {/* IMAGE */}
        <div className="relative">
          <img
            src="/images/about-roof.png"
            alt={t("about.imageAlt")}
            loading="lazy"
            className="h-64 w-full rounded-2xl object-cover sm:h-80 lg:h-[380px]"
          />

          <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-white/70 bg-white/95 p-3 shadow-lg backdrop-blur-sm sm:bottom-4 sm:left-4 sm:right-4">
            <p className="text-xs font-semibold text-brand">
              Usta Platform
            </p>

            <p className="mt-1 text-sm font-semibold leading-5 text-navy">
              {t("about.imageTitle")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
