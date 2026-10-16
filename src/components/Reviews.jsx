
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaStar,
  FaArrowLeft,
  FaArrowRight,
  FaBriefcase,
  FaQuoteLeft,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const reviews = [
  { name: "Kende Attila", rating: 4, key: "kende" },
  { name: "Dilnoza Karimova", rating: 5, key: "dilnoza" },
  { name: "Jasur Toshmatov", rating: 4, key: "jasur" },
];

export default function Reviews() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);

  const review = reviews[index];

  const prev = () => {
    setIndex((current) =>
      current === 0 ? reviews.length - 1 : current - 1
    );
  };

  const next = () => {
    setIndex((current) =>
      current === reviews.length - 1 ? 0 : current + 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((current) =>
        current === reviews.length - 1 ? 0 : current + 1
      );
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden border-y border-slate-100 bg-white py-20 sm:py-24">
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-cyan-100/50 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-700">
            <FaStar />
            {t("reviews.trusted")}
          </span>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {t("reviews.title")}
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
            {t("reviews.description")}
          </p>
        </div>

        {/* Review card */}
        <div className="mx-auto max-w-3xl">
          <div className="relative rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-10 lg:p-12">
            <div className="absolute right-7 top-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 sm:right-10 sm:top-10">
              <FaQuoteLeft size={19} />
            </div>

            {/* Stars */}
            <div className="flex gap-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar
                  key={i}
                  size={16}
                  className={
                    i < review.rating
                      ? "text-amber-400"
                      : "text-slate-200"
                  }
                />
              ))}
            </div>

            {/* Review text */}
            <div
              key={review.key}
              className="mt-8 min-h-32 animate-[fadeIn_0.35s_ease-out]"
            >
              <p className="max-w-2xl text-lg font-medium leading-8 text-slate-700 sm:text-xl sm:leading-9">
                “{t(`reviews.items.${review.key}.text`)}”
              </p>
            </div>

            {/* Reviewer */}
            <div className="mt-8 flex flex-col gap-5 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-base font-extrabold text-white shadow-lg shadow-blue-600/15">
                  {review.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)}
                </div>

                <div>
                  <p className="font-bold text-slate-900">
                    {review.name}
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-400">
                    Usta Platform foydalanuvchisi
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-3">
                <span className="mr-2 text-sm font-semibold tabular-nums text-slate-400">
                  {String(index + 1).padStart(2, "0")} /{" "}
                  {String(reviews.length).padStart(2, "0")}
                </span>

                <button
                  type="button"
                  onClick={prev}
                  aria-label={t("reviews.previous")}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <FaArrowLeft size={14} />
                </button>

                <button
                  type="button"
                  onClick={next}
                  aria-label={t("reviews.next")}
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <FaArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Slide indicators */}
          <div className="mt-6 flex items-center justify-center gap-2">
            {reviews.map((item, i) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={t("reviews.goTo", { number: i + 1 })}
                aria-current={i === index ? "true" : undefined}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index
                    ? "w-8 bg-blue-600"
                    : "w-2 bg-slate-300 hover:bg-blue-300"
                }`}
              />
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => navigate("/vakansiyalar")}
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-[#0B1530] px-6 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-900/15 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <FaBriefcase size={15} />
              {t("reviews.viewVacancies")}
              <FaArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
