import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  FaArrowRight,
  FaTools,
  FaHome,
  FaLightbulb,
} from "react-icons/fa";

const posts = [
  {
    image: "/images/blog-smart-home.png",
    key: "technicalService",
    icon: <FaTools />,
  },
  {
    image: "/images/blog-roof-guide.png",
    key: "homeRepair",
    icon: <FaHome />,
  },
  {
    image: "/images/blog-master-tips.png",
    key: "masterTips",
    icon: <FaLightbulb />,
  },
];

export default function Blog() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section
      id="blog"
      className="max-w-7xl mx-auto px-6 py-16"
    >
      <div className="text-center mb-12">
        <p className="text-brand font-semibold text-sm mb-2">
          {t("blog.badge")}
        </p>

        <h2 className="text-3xl font-bold text-navy mb-3">
          {t("blog.title")}
        </h2>

        <p className="text-gray-500 max-w-lg mx-auto leading-6">
          {t("blog.description")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {posts.map((post) => (
          <article
            key={post.key}
            className="rounded-2xl overflow-hidden border border-gray-100 bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
          >
            <div className="relative">
              <img
                src={post.image}
                alt={t(
                  `blog.posts.${post.key}.title`
                )}
                className="w-full h-48 object-cover"
              />

              <span className="absolute top-4 left-4 flex items-center gap-2 bg-navy text-white text-xs rounded-full px-3 py-2">
                {post.icon}

                {t(
                  `blog.posts.${post.key}.category`
                )}
              </span>
            </div>

            <div className="p-5">
              <p className="text-xs text-gray-400 mb-3">
                Usta Platform
              </p>

              <h3 className="font-semibold text-navy mb-3 leading-snug text-lg">
                {t(
                  `blog.posts.${post.key}.title`
                )}
              </h3>

              <p className="text-sm text-gray-500 mb-5 leading-6 line-clamp-3">
                {t(
                  `blog.posts.${post.key}.description`
                )}
              </p>

              <button
                type="button"
                onClick={() => navigate("/blog")}
                className="inline-flex items-center gap-2 text-brand font-semibold text-sm hover:gap-3 transition-all"
              >
                {t("blog.readMore")}

                <FaArrowRight size={12} />
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={() => navigate("/blog")}
          className="inline-flex items-center gap-2 bg-navy text-white rounded-full px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          {t("blog.viewAll")}

          <FaArrowRight size={13} />
        </button>
      </div>
    </section>
  );
}