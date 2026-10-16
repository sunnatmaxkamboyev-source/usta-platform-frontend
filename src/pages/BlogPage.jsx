
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaTools,
  FaHome,
  FaLightbulb,
} from "react-icons/fa";

const posts = [
  {
    id: 1,
    image: "/images/blog-smart-home.png",
    category: "Texnik xizmat",
    title: "Uy texnikasini to‘g‘ri parvarishlash",
    description:
      "Uy jihozlarini asrash va muammolarni vaqtida aniqlash bo‘yicha maslahatlar.",
    icon: FaTools,
  },
  {
    id: 2,
    image: "/images/blog-roof-guide.png",
    category: "Uy ta'miri",
    title: "Ta'mirdan oldin nimalarni bilish kerak?",
    description:
      "Ishlarni rejalashtirish va kerakli xizmatni tanlash bo‘yicha qisqa qo‘llanma.",
    icon: FaHome,
  },
  {
    id: 3,
    image: "/images/blog-master-tips.png",
    category: "Maslahatlar",
    title: "Yaxshi ustani qanday tanlash mumkin?",
    description:
      "Usta bilan ish boshlashdan oldin xizmat va narxni kelishib oling.",
    icon: FaLightbulb,
  },
];

export default function BlogPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="bg-navy text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-base font-bold transition-colors hover:text-blue-300"
          >
            Usta Platform
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-white"
          >
            <FaArrowLeft size={12} />
            Bosh sahifa
          </button>
        </div>
      </header>

      {/* INTRO */}
      <section className="border-b border-slate-100 bg-white px-5 py-10 text-center sm:px-6 sm:py-12">
        <p className="text-xs font-bold uppercase tracking-widest text-brand">
          USTA PLATFORM BLOGI
        </p>

        <h1 className="mt-3 text-2xl font-extrabold text-navy sm:text-4xl">
          Foydali maslahatlar
        </h1>

        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
          Uy ta'miri va ishonchli usta tanlash haqida.
        </p>
      </section>

      {/* ARTICLES */}
      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-12">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const Icon = post.icon;

            return (
              <article
                key={post.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >
                <div className="relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    className="h-44 w-full object-cover sm:h-48"
                  />

                  <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-lg bg-navy/90 px-3 py-2 text-xs font-medium text-white">
                    <Icon size={12} />
                    {post.category}
                  </span>
                </div>

                <div className="p-5">
                  <p className="text-xs font-medium text-brand">
                    Usta Platform
                  </p>

                  <h2 className="mt-2 text-lg font-bold leading-6 text-navy">
                    {post.title}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {post.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand"
          >
            <FaArrowLeft size={12} />
            Bosh sahifaga qaytish
          </button>
        </div>
      </main>
    </div>
  );
}
