import { useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaArrowRight,
  FaTools,
  FaHome,
  FaLightbulb,
} from "react-icons/fa";

const posts = [
  {
    id: 1,
    image: "/images/blog-smart-home.png",
    category: "Texnik xizmat",
    title:
      "Uyda texnik xizmat ko‘rsatishda nimalarga e'tibor berish kerak?",
    description:
      "Uy jihozlari va texnik tizimlardan to‘g‘ri foydalanish hamda muammolarni vaqtida aniqlash bo‘yicha foydali maslahatlar.",
    icon: <FaTools />,
  },
  {
    id: 2,
    image: "/images/blog-roof-guide.png",
    category: "Uy ta'miri",
    title:
      "Uy ta'mirini boshlashdan oldin bilishingiz kerak bo‘lgan narsalar",
    description:
      "Ta'mirlash ishlarini rejalashtirish, kerakli xizmat turini aniqlash va mos mutaxassisni topish bo‘yicha qo‘llanma.",
    icon: <FaHome />,
  },
  {
    id: 3,
    image: "/images/blog-master-tips.png",
    category: "Foydali maslahat",
    title:
      "Uy uchun usta tanlashda nimalarga qarash kerak?",
    description:
      "Vakansiya ma'lumotlarini o‘qish, xizmat tafsilotlarini tekshirish va usta bilan ish boshlashdan oldin nimalarni kelishib olish kerakligi haqida.",
    icon: <FaLightbulb />,
  },
];

export default function BlogPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-navy text-white">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="font-bold text-lg hover:text-brand transition-colors"
          >
            Usta Platform
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
          >
            <FaArrowLeft />
            Bosh sahifa
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <p className="text-brand font-semibold text-sm mb-3">
            USTA PLATFORM BLOGI
          </p>

          <h1 className="text-3xl md:text-5xl font-bold text-navy mb-5">
            Foydali ma'lumotlar
          </h1>

          <p className="text-gray-500 max-w-2xl mx-auto leading-7">
            Uy ta'miri, xizmatlar va kerakli ustani
            tanlash bo‘yicha foydali maslahatlar,
            qo‘llanmalar va tavsiyalar.
          </p>
        </div>
      </section>

      {/* POSTS */}
      <main className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
            >
              <div className="relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-56 object-cover"
                />

                <span className="absolute top-4 left-4 flex items-center gap-2 bg-navy text-white text-xs rounded-full px-3 py-2">
                  {post.icon}
                  {post.category}
                </span>
              </div>

              <div className="p-6">
                <p className="text-xs text-gray-400 mb-3">
                  Usta Platform
                </p>

                <h2 className="text-xl font-semibold text-navy leading-snug mb-4">
                  {post.title}
                </h2>

                <p className="text-sm text-gray-500 leading-6 mb-6">
                  {post.description}
                </p>

                <button
                  type="button"
                  className="inline-flex items-center gap-2 text-brand font-semibold text-sm hover:gap-3 transition-all"
                >
                  Maqolani o‘qish
                  <FaArrowRight size={12} />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* BACK */}
        <div className="text-center mt-12">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 bg-navy text-white rounded-full px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <FaArrowLeft size={13} />
            Bosh sahifaga qaytish
          </button>
        </div>
      </main>
    </div>
  );
}