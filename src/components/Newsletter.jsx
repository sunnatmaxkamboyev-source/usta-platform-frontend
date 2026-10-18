
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { message } from "antd";
import {
  FaArrowRight,
  FaCheck,
  FaEnvelope,
  FaShieldAlt,
  FaRegPaperPlane,
} from "react-icons/fa";

export default function Newsletter() {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      message.error(t("newsletter.invalidEmail"));
      return;
    }

    setLoading(true);

    try {
      const storedEmails = JSON.parse(
        localStorage.getItem("homepro_newsletters") || "[]"
      );

      if (!Array.isArray(storedEmails)) {
        throw new Error("Newsletter ma'lumotlari noto'g'ri formatda");
      }

      const existingEmails = storedEmails.map((item) =>
        String(item).trim().toLowerCase()
      );

      if (existingEmails.includes(normalizedEmail)) {
        message.info(t("newsletter.alreadySubscribed"));
        return;
      }

      const updatedEmails = [
        ...storedEmails,
        normalizedEmail,
      ];

      localStorage.setItem(
        "homepro_newsletters",
        JSON.stringify(updatedEmails)
      );

      setEmail("");
      setSubscribed(true);

      message.success(t("newsletter.success"));
    } catch (error) {
      console.error("Newsletter error:", error);
      message.error(t("newsletter.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-slate-50 px-5 py-16 sm:px-6 sm:py-20 lg:py-24">
      {/* BACKGROUND DECORATION */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-blue-400/10 blur-[100px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-cyan-400/10 blur-[100px]"
      />

      <div className="relative mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0B1530] shadow-2xl shadow-slate-900/10 sm:rounded-[36px]">
          {/* INNER GLOW */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full bg-blue-500/20 blur-[100px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-[100px]"
          />

          <div className="relative px-5 py-10 sm:px-10 sm:py-14 lg:px-16 lg:py-16">
            {!subscribed ? (
              <>
                {/* ICON */}
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-sky-400 shadow-lg shadow-blue-950/20">
                  <FaRegPaperPlane size={25} />
                </div>

                {/* HEADING */}
                <div className="mx-auto mb-9 max-w-2xl text-center">
                  <span className="inline-block rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-sky-300">
                    USTA PLATFORM
                  </span>

                  <h2 className="mt-5 text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
                    {t("newsletter.title")}
                  </h2>

                  <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                    {t("newsletter.description")}
                  </p>
                </div>

                {/* EMAIL FORM */}
                <form
                  onSubmit={handleSubmit}
                  className="mx-auto max-w-2xl"
                >
                  <label
                    htmlFor="newsletter-email"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    {t("newsletter.placeholder")}
                  </label>

                  <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-2 sm:flex-row sm:items-center sm:rounded-full">
                    <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
                      <FaEnvelope
                        className="shrink-0 text-slate-400"
                        size={17}
                      />

                      <input
                        id="newsletter-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@email.com"
                        autoComplete="email"
                        maxLength={254}
                        required
                        disabled={loading}
                        className="min-h-12 w-full min-w-0 border-0 bg-transparent text-sm text-white outline-none placeholder:text-slate-500 focus:ring-0"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60 sm:rounded-full"
                    >
                      {loading
                        ? t("common.loading")
                        : t("newsletter.button")}

                      {!loading && (
                        <FaArrowRight
                          size={13}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      )}
                    </button>
                  </div>
                </form>

                {/* PRIVACY NOTE */}
                <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs leading-5 text-slate-400">
                  <FaShieldAlt
                    className="shrink-0 text-emerald-400"
                    size={13}
                  />

                  <span>
                    Email manzilingiz ushbu brauzer xotirasida saqlanadi.
                  </span>
                </div>
              </>
            ) : (
              /* SUCCESS STATE */
              <div className="mx-auto max-w-xl py-5 text-center sm:py-8">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
                  <FaCheck size={30} />
                </div>

                <h2 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl">
                  {t("newsletter.successTitle")}
                </h2>

                <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
                  {t("newsletter.successDescription")}
                </p>

                <button
                  type="button"
                  onClick={() => setSubscribed(false)}
                  className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  {t("newsletter.button")}
                  <FaArrowRight size={12} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
