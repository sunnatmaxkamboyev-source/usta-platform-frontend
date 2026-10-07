import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  FaUserTie,
  FaBriefcase,
  FaEye,
  FaArrowUp,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

import { Spin, message } from "antd";

import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // ========================================
  // STATE
  // ========================================

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalMasters: 0,
    totalVacancies: 0,
    activeVacancies: 0,
    deletedVacancies: 0,
    totalViews: 0,
  });

  const [latestVacancies, setLatestVacancies] =
    useState([]);

  // ========================================
  // ADMIN DASHBOARD API
  // ========================================

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const token =
          localStorage.getItem("admin_token");

        // Token bo'lmasa login
        if (!token) {
          message.error(
            "Admin sifatida qayta kirishingiz kerak"
          );

          navigate("/admin/login");
          return;
        }

        const response = await fetch(
          "https://usta-platform-backend.onrender.com/api/admin/dashboard",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        // ========================================
        // TOKEN XATOSI
        // ========================================

        if (response.status === 401) {
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin");
          localStorage.removeItem("admin_role");

          message.error(
            "Admin sessiyasi tugagan. Qayta kiring."
          );

          navigate("/admin/login");
          return;
        }

        // ========================================
        // BOSHQA API XATOSI
        // ========================================

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Dashboard ma'lumotlarini olishda xatolik"
          );
        }

        // ========================================
        // STATISTIKA
        // ========================================

        setStats({
          totalMasters:
            data.stats?.totalMasters || 0,

          totalVacancies:
            data.stats?.totalVacancies || 0,

          activeVacancies:
            data.stats?.activeVacancies || 0,

          deletedVacancies:
            data.stats?.deletedVacancies || 0,

          totalViews:
            data.stats?.totalViews || 0,
        });

        // ========================================
        // SO'NGGI VAKANSIYALAR
        // ========================================

        setLatestVacancies(
          Array.isArray(data.latestVacancies)
            ? data.latestVacancies
            : []
        );
      } catch (error) {
        console.error(
          "Admin dashboard error:",
          error
        );

        message.error(
          error.message ||
            "Server bilan bog'lanishda xatolik"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  // ========================================
  // STATISTICS
  // ========================================

  const statistics = [
    {
      title: "Jami ustalar",
      value: stats.totalMasters,
      icon: <FaUserTie />,
      description: "Ro‘yxatdan o‘tgan ustalar",
    },

    {
      title: "Jami vakansiyalar",
      value: stats.totalVacancies,
      icon: <FaBriefcase />,
      description: "Joylangan vakansiyalar",
    },

    {
      title: "Faol vakansiyalar",
      value: stats.activeVacancies,
      icon: <FaCheckCircle />,
      description: "Hozir mavjud vakansiyalar",
    },

    {
      title: "Ko‘rishlar",
      value: stats.totalViews,
      icon: <FaEye />,
      description: "Vakansiya ko‘rishlari",
    },
  ];

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar />

        <div className="flex-1 min-w-0">
          <AdminHeader />

          <main className="p-6">
            <div className="flex items-center justify-center min-h-[500px]">
              <div className="text-center">
                <Spin size="large" />

                <p className="text-gray-500 mt-4">
                  Dashboard ma'lumotlari
                  yuklanmoqda...
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // ========================================
  // MAIN
  // ========================================

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN */}
      <div className="flex-1 min-w-0">
        <AdminHeader />

        <main className="p-6">
          {/* PAGE TITLE */}

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-navy">
              Dashboard
            </h2>

            <p className="text-gray-500 mt-1">
              Usta Platform faoliyatining umumiy
              ko‘rsatkichlarini boshqaring.
            </p>
          </div>

          {/* STATISTICS */}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {statistics.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      {item.title}
                    </p>

                    <h3 className="text-3xl font-bold text-navy mt-2">
                      {item.value}
                    </h3>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand flex items-center justify-center text-xl">
                    {item.icon}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-5 text-sm">
                  <span className="flex items-center gap-1 text-green-600 font-medium">
                    <FaArrowUp size={10} />
                    Real
                  </span>

                  <span className="text-gray-400">
                    {item.description}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* MAIN CONTENT */}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
            {/* RECENT VACANCIES */}

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-navy">
                    So‘nggi vakansiyalar
                  </h3>

                  <p className="text-sm text-gray-400 mt-1">
                    Platformaga joylangan vakansiyalar
                  </p>
                </div>

                <FaBriefcase className="text-gray-300" />
              </div>

              {latestVacancies.length === 0 ? (
                <div className="py-10 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 text-gray-300 flex items-center justify-center mx-auto text-xl">
                    <FaBriefcase />
                  </div>

                  <p className="text-gray-500 mt-4">
                    Hozircha vakansiyalar yo‘q
                  </p>

                  <p className="text-gray-400 text-sm mt-1">
                    Usta vakansiya joylagandan
                    so‘ng bu yerda ko‘rinadi.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {latestVacancies.map(
                    (vacancy) => (
                      <div
                        key={vacancy._id}
                        className="flex items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="font-medium text-navy truncate">
                            {vacancy.title}
                          </p>

                          <p className="text-xs text-gray-400 mt-1">
                            {vacancy.usta?.name ||
                              "Usta"}
                            {" • "}
                            {vacancy.location}
                          </p>
                        </div>

                        <span className="text-sm font-semibold text-brand whitespace-nowrap">
                          {vacancy.price ||
                            "Kelishiladi"}
                        </span>
                      </div>
                    )
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        "/admin/vacancies"
                      )
                    }
                    className="w-full flex items-center justify-center gap-2 mt-4 py-3 rounded-xl text-sm font-medium text-brand bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    Barcha vakansiyalarni ko‘rish

                    <FaArrowRight size={12} />
                  </button>
                </div>
              )}
            </div>

            {/* QUICK MANAGEMENT */}

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-navy">
                  Tezkor boshqaruv
                </h3>

                <p className="text-sm text-gray-400 mt-1">
                  Admin uchun asosiy bo‘limlar
                </p>
              </div>

              <div className="space-y-3">
                {/* USTALAR */}

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/admin/masters"
                    )
                  }
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg bg-blue-100 text-brand flex items-center justify-center">
                      <FaUserTie />
                    </span>

                    <div className="text-left">
                      <p className="font-medium text-navy">
                        Ustalarni boshqarish
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {stats.totalMasters} ta usta
                      </p>
                    </div>
                  </div>

                  <FaArrowRight className="text-gray-300 group-hover:text-brand transition-colors" />
                </button>

                {/* VAKANSIYALAR */}

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/admin/vacancies"
                    )
                  }
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg bg-blue-100 text-brand flex items-center justify-center">
                      <FaBriefcase />
                    </span>

                    <div className="text-left">
                      <p className="font-medium text-navy">
                        Vakansiyalarni boshqarish
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {stats.totalVacancies} ta
                        vakansiya
                      </p>
                    </div>
                  </div>

                  <FaArrowRight className="text-gray-300 group-hover:text-brand transition-colors" />
                </button>

                {/* KO'RISHLAR */}

                <div className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg bg-blue-100 text-brand flex items-center justify-center">
                      <FaEye />
                    </span>

                    <div className="text-left">
                      <p className="font-medium text-navy">
                        Platforma ko‘rishlari
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        Vakansiya ko‘rishlari
                      </p>
                    </div>
                  </div>

                  <span className="text-sm font-semibold text-brand">
                    {stats.totalViews}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* INFORMATION */}

          <div className="mt-6 bg-navy rounded-2xl p-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div>
                <p className="text-brand text-sm font-semibold">
                  USTA PLATFORM
                </p>

                <h3 className="text-xl font-bold mt-2">
                  Admin boshqaruv markazi
                </h3>

                <p className="text-gray-300 text-sm mt-2 max-w-2xl">
                  Bu panel orqali ustalar va ular
                  joylagan vakansiyalarni
                  boshqarishingiz mumkin.
                  Statistikalar MongoDB
                  ma’lumotlari asosida ishlaydi.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/admin/masters"
                  )
                }
                className="inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark px-5 py-3 rounded-xl font-semibold text-sm whitespace-nowrap"
              >
                Ustalarni ko‘rish

                <FaArrowRight size={12} />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}