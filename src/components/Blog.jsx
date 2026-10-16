
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaArrowRight,
  FaTools,
  FaHome,
  FaLightbulb,
  FaRegClock,
} from "react-icons/fa";

const posts = [
  {
    image: "/images/blog-smart-home.png",
    key: "technicalService",
    icon: FaTools,
    number: "01",
  },
  {
    image: "/images/blog-roof-guide.png",
    key: "homeRepair",
    icon: FaHome,
    number: "02",
  },
  {
    image: "/images/blog-master-tips.png",
    key: "masterTips",
    icon: FaLightbulb,
    number: "03",
  },
];

export default function Blog() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section
      id="blog"
      className="relative overflow-hidden bg-slate-50 py-20 sm:py-24"
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-10 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-700 shadow-sm">
              <FaLightbulb />
              {t("blog.badge")}
            </span>

            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              {t("blog.title")}
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
              {t("blog.description")}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/blog")}
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-3 self-start rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700 hover:shadow-md md:self-auto"
          >
            {t("blog.viewAll")}
            <FaArrowRight size={13} />
          </button>
        </div>

        {/* Blog cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const Icon = post.icon;

            return (
              <article
                key={post.key}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-100 hover:shadow-xl hover:shadow-slate-900/5"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-slate-200 sm:h-60">
                  <img
                    src={post.image}
                    alt={t(`blog.posts.${post.key}.title`)}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />

                  <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/75 px-3 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-md">
                    <Icon size={12} />
                    {t(`blog.posts.${post.key}.category`)}
                  </span>

                  <span className="absolute bottom-4 right-4 text-4xl font-black text-white/70">
                    {post.number}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <div className="mb-4 flex items-center gap-2 text-xs font-medium text-slate-400">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <FaRegClock size={12} />
                    </span>
                    <span>Usta Platform</span>
                  </div>

                  <h3 className="text-lg font-bold leading-7 text-slate-900 transition-colors group-hover:text-blue-700 sm:text-xl">
                    {t(`blog.posts.${post.key}.title`)}
                  </h3>

                  <p className="mt-3 flex-1 text-sm leading-7 text-slate-500">
                    {t(`blog.posts.${post.key}.description`)}
                  </p>

                  <button
                    type="button"
                    onClick={() => navigate("/blog")}
                    className="mt-6 inline-flex w-fit items-center gap-2 border-b border-transparent pb-1 text-sm font-bold text-blue-700 transition-all hover:gap-3 hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-4"
                  >
                    {t("blog.readMore")}
                    <FaArrowRight size={12} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom note */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white/80 px-6 py-5 sm:flex-row">
          <p className="text-center text-sm leading-6 text-slate-500 sm:text-left">
            {t("blog.description")}
          </p>

          <button
            type="button"
            onClick={() => navigate("/blog")}
            className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-slate-800 transition-colors hover:text-blue-700"
          >
            {t("blog.viewAll")}
            <FaArrowRight size={12} />
          </button>
        </div>
      </div>
    </section>
  );
}
