
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  FaArrowRight,
  FaCheck,
  FaSearch,
  FaUserPlus,
  FaBolt,
} from "react-icons/fa";

export default function CTABanner() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="relative isolate overflow-hidden bg-[#081329] text-white">
      {/* BACKGROUND DECORATION */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-0 -z-10 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-0 -z-10 h-80 w-80 rounded-full bg-cyan-500/10 blur-[100px]"
      />

      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* LEFT CONTENT */}
          <div className="max-w-2xl">
            {/* EYEBROW */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2">
              <FaBolt className="text-sm text-sky-400" />

              <span className="text-xs font-bold uppercase tracking-[0.16em] text-sky-300">
                USTA PLATFORM
              </span>
            </div>

            {/* TITLE */}
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl xl:text-[54px]">
              {t("cta.title")}
            </h2>

            {/* DESCRIPTION */}
            <p className="mt-6 max-w-xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
              {t("cta.description")}
            </p>

            {/* BENEFITS */}
            <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-x-7">
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400">
                  <FaCheck size={11} />
                </span>

                <span className="text-sm text-slate-200">
                  {t("cta.benefits.availableVacancies")}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400">
                  <FaCheck size={11} />
                </span>

                <span className="text-sm text-slate-200">
                  {t("cta.benefits.directContact")}
                </span>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/vakansiyalar")}
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-xl bg-brand px-6 py-4 text-sm font-bold text-white shadow-lg shadow-blue-950/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/20"
              >
                <FaSearch size={15} />

                {t("cta.findMaster")}

                <FaArrowRight
                  size={13}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>

              <button
                type="button"
                onClick={() => navigate("/register")}
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/[0.04] px-6 py-4 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.08]"
              >
                <FaUserPlus
                  size={15}
                  className="text-sky-400"
                />

                {t("cta.becomeMaster")}

                <FaArrowRight
                  size={13}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </div>

            {/* BOTTOM NOTE */}
            <div className="mt-7 flex items-center gap-3 text-xs leading-5 text-slate-400">
              <span className="h-px w-8 bg-sky-500/60" />

              <span>Usta Platform — xizmatlar va imkoniyatlar bir joyda.</span>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            {/* IMAGE GLOW */}
            <div
              aria-hidden="true"
              className="absolute -inset-4 rounded-[32px] bg-gradient-to-br from-blue-500/20 via-transparent to-cyan-400/10 blur-2xl"
            />

            {/* IMAGE FRAME */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-2 shadow-2xl shadow-black/30 sm:rounded-[28px] sm:p-3">
              <div className="relative overflow-hidden rounded-xl sm:rounded-[21px]">
                <img
                  src="/images/cta-banner.png"
                  alt={t("cta.imageAlt")}
                  loading="lazy"
                  className="h-[280px] w-full object-cover transition-transform duration-700 hover:scale-[1.03] sm:h-[360px] lg:h-[420px]"
                />

                {/* IMAGE OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#081329]/80 via-transparent to-[#081329]/10" />

                {/* IMAGE LABEL */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#081329]/70 px-3 py-2 text-xs font-medium text-white shadow-lg backdrop-blur-md">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />

                    <span>Usta Platform</span>
                  </div>
                </div>
              </div>
            </div>

            {/* DECORATIVE CORNER */}
            <div
              aria-hidden="true"
              className="absolute -right-2 -top-3 h-16 w-16 rounded-2xl border border-sky-400/20 sm:-right-4 sm:-top-4 sm:h-20 sm:w-20"
            />

            <div
              aria-hidden="true"
              className="absolute -bottom-3 -left-2 h-12 w-12 rounded-xl border border-blue-400/20 sm:-bottom-4 sm:-left-4 sm:h-16 sm:w-16"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
