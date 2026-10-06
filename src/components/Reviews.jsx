import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaStar,
  FaArrowLeft,
  FaArrowRight,
  FaBriefcase,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const reviews = [
  {
    name: "Kende Attila",
    rating: 4,
    key: "kende",
  },
  {
    name: "Dilnoza Karimova",
    rating: 5,
    key: "dilnoza",
  },
  {
    name: "Jasur Toshmatov",
    rating: 4,
    key: "jasur",
  },
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
    <section className="border-t border-b border-gray-100 py-16">
      <div className="max-w-3xl mx-auto px-6 text-center">

        {/* TITLE */}
        <h2 className="text-2xl md:text-3xl font-bold text-navy mb-4">
          {t("reviews.title")}
        </h2>

        {/* DESCRIPTION */}
        <p className="text-gray-500 max-w-xl mx-auto mb-5">
          {t("reviews.description")}
        </p>

        {/* TRUST TEXT */}
        <div className="inline-flex items-center gap-2 text-green-600 font-semibold mb-10">
          <span className="text-yellow-400">★</span>

          {t("reviews.trusted")}
        </div>

        {/* REVIEW */}
        <div className="flex items-center justify-center gap-4">

          {/* PREVIOUS */}
          <button
            type="button"
            onClick={prev}
            aria-label={t("reviews.previous")}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-navy hover:bg-gray-50 transition"
          >
            <FaArrowLeft size={14} />
          </button>

          {/* CONTENT */}
          <div className="flex-1">

            <div className="min-h-[130px] flex items-center justify-center">
              <p className="text-gray-600 leading-7">
                "{t(`reviews.items.${review.key}.text`)}"
              </p>
            </div>

            {/* NAME + STARS */}
            <div className="flex flex-col items-center gap-3 mt-5">

              <span className="font-semibold text-navy">
                {review.name}
              </span>

              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar
                    key={i}
                    size={14}
                    className={
                      i < review.rating
                        ? "text-yellow-400"
                        : "text-gray-200"
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          {/* NEXT */}
          <button
            type="button"
            onClick={next}
            aria-label={t("reviews.next")}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-navy hover:bg-gray-50 transition"
          >
            <FaArrowRight size={14} />
          </button>
        </div>

        {/* DOTS */}
        <div className="flex justify-center gap-2 mt-8">
          {reviews.map((item, i) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={t("reviews.goTo", {
                number: i + 1,
              })}
              className={`w-2.5 h-2.5 rounded-full transition ${
                i === index
                  ? "bg-brand"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* VACANCIES BUTTON */}
        <div className="mt-10">
          <button
            type="button"
            onClick={() => navigate("/vakansiyalar")}
            className="inline-flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
          >
            <FaBriefcase />

            {t("reviews.viewVacancies")}
          </button>
        </div>
      </div>
    </section>
  );
}