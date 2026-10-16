
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaArrowRight,
  FaBriefcase,
  FaHome,
} from "react-icons/fa";

export default function Footer() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const companyLinks = [
    { label: t("footer.links.about"), section: "about" },
    { label: t("footer.links.services"), section: "services" },
    { label: t("footer.links.blog"), section: "blog" },
    { label: t("footer.links.contact"), section: "contact" },
  ];

  const platformLinks = [
    {
      label: t("footer.platform.vacancies"),
      to: "/vakansiyalar",
    },
    {
      label: t("footer.platform.becomeMaster"),
      to: "/register",
    },
    {
      label: t("footer.platform.masterLogin"),
      to: "/login",
    },
  ];

  const legalLinks = [
    t("footer.legal.terms"),
    t("footer.legal.privacy"),
    t("footer.legal.cookies"),
    t("footer.legal.license"),
  ];

  const goToSection = (section) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollToSection: section } });
      return;
    }

    document.getElementById(section)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <footer className="relative overflow-hidden bg-[#0B1530] text-white">
      {/* DECORATIVE BACKGROUND */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 right-[-80px] h-80 w-80 rounded-full bg-blue-500/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-20 left-[-100px] h-72 w-72 rounded-full bg-cyan-500/[0.07] blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-16 lg:py-20">
        {/* TOP BRAND PANEL */}
        <div className="mb-12 flex flex-col gap-7 rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10">
          <div className="max-w-2xl">
            <Link
              to="/"
              className="inline-flex items-center gap-3"
              aria-label="Usta Platform bosh sahifa"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 text-brand">
                <FaHome size={21} />
              </span>

              <span className="text-xl font-black tracking-tight sm:text-2xl">
                USTA <span className="text-brand">PLATFORM</span>
              </span>
            </Link>

            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
              {t("footer.description")}
            </p>
          </div>

          <Link
            to="/vakansiyalar"
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-sky-500 hover:shadow-lg hover:shadow-blue-500/20"
          >
            {t("footer.platform.vacancies")}
            <FaArrowRight size={13} />
          </Link>
        </div>

        {/* FOOTER COLUMNS */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* BRAND INTRO */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
              Usta Platform
            </p>

            <h2 className="mt-3 text-lg font-bold leading-7 text-white">
              {t("footer.platformTitle")}
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              {t("footer.description")}
            </p>
          </div>

          {/* PLATFORM LINKS */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-white">
              {t("footer.platformTitle")}
            </h3>

            <div className="space-y-3">
              {platformLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="group flex w-fit items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
                >
                  <FaArrowRight
                    size={10}
                    className="text-brand opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                  />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* COMPANY LINKS */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-white">
              {t("footer.companyTitle")}
            </h3>

            <div className="space-y-3">
              {companyLinks.map((item) => (
                <button
                  key={item.section}
                  type="button"
                  onClick={() => goToSection(item.section)}
                  className="group flex w-fit items-center gap-2 text-left text-sm text-slate-400 transition-colors hover:text-white"
                >
                  <FaArrowRight
                    size={10}
                    className="text-brand opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                  />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* MASTER CTA */}
          <div className="rounded-2xl border border-blue-400/15 bg-blue-500/[0.07] p-5 sm:p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/15 text-brand">
              <FaBriefcase size={17} />
            </span>

            <h3 className="mt-4 text-base font-bold text-white">
              {t("footer.platform.becomeMaster")}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              {t("footer.description")}
            </p>

            <Link
              to="/register"
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand transition-colors hover:text-white"
            >
              {t("footer.platform.becomeMaster")}
              <FaArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="relative border-t border-white/[0.08]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-6 sm:px-6 md:flex-row md:items-center md:justify-between">
          <p className="text-center text-xs leading-5 text-slate-500 md:text-left">
            {t("footer.copyright")}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
            {legalLinks.map((item) => (
              <span
                key={item}
                title="Bu sahifa keyinchalik qo‘shiladi"
                className="text-xs text-slate-500"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
