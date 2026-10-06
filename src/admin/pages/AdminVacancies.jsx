import { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  FaSearch,
  FaBriefcase,
  FaUserTie,
  FaMapMarkerAlt,
  FaPhone,
  FaTelegramPlane,
  FaEye,
  FaTrash,
  FaArrowLeft,
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import {
  Button,
  Empty,
  Input,
  Modal,
  Select,
  Tag,
  message,
  Spin,
} from "antd";

import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";

const categoryOptions = [
  {
    value: "all",
    label: "Barcha xizmatlar",
  },
  {
    value: "santexnik",
    label: "Santexnik",
  },
  {
    value: "elektrik",
    label: "Elektrik",
  },
  {
    value: "payvandchi",
    label: "Payvandchi",
  },
  {
    value: "quruvchi",
    label: "Quruvchi",
  },
  {
    value: "mebelchi",
    label: "Mebelchi",
  },
  {
    value: "boyoqchi",
    label: "Bo‘yoqchi",
  },
  {
    value: "tom-tamirlash",
    label: "Tom ta'mirlash",
  },
  {
    value: "zamburug-tozalash",
    label: "Zamburug' tozalash",
  },
  {
    value: "daraxt-kesish",
    label: "Daraxt kesish",
  },
  {
    value: "maishiy-texnika",
    label: "Maishiy texnika ta'miri",
  },
  {
    value: "hammom",
    label: "Hammom ta'mirlash",
  },
  {
    value: "qulfsoz",
    label: "Qulfsoz",
  },
  {
    value: "boshqa",
    label: "Boshqa",
  },
];

const statusOptions = [
  {
    value: "all",
    label: "Barcha holatlar",
  },
  {
    value: "active",
    label: "Faol",
  },
  {
    value: "inactive",
    label: "Nofaol",
  },
  {
    value: "deleted",
    label: "O‘chirilgan",
  },
];

const getCategoryLabel = (value) => {
  const category = categoryOptions.find(
    (item) => item.value === value
  );

  return category?.label || value || "Boshqa";
};

const getStatusInfo = (status) => {
  if (status === "active") {
    return {
      label: "Faol",
      color: "green",
      icon: <FaCheckCircle />,
    };
  }

  if (status === "deleted") {
    return {
      label: "O‘chirilgan",
      color: "red",
      icon: <FaTimesCircle />,
    };
  }

  return {
    label: "Nofaol",
    color: "orange",
    icon: <FaTimesCircle />,
  };
};

export default function AdminVacancies() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [category, setCategory] =
    useState("all");

  const [status, setStatus] =
    useState("all");

  const [selectedVacancy, setSelectedVacancy] =
    useState(null);

  const [vacancies, setVacancies] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  // ========================================
  // GET ALL VACANCIES
  // ========================================

  const fetchVacancies = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem(
          "admin_token"
        );

      if (!token) {
        message.error(
          "Admin sifatida qayta kirishingiz kerak"
        );

        navigate("/admin/login");

        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/admin/vacancies",
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      // TOKEN EXPIRED
      if (response.status === 401) {
        localStorage.removeItem(
          "admin_token"
        );

        localStorage.removeItem(
          "admin"
        );

        localStorage.removeItem(
          "admin_role"
        );

        message.error(
          "Admin sessiyasi tugagan. Qayta kiring."
        );

        navigate("/admin/login");

        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Vakansiyalarni olishda xatolik"
        );
      }

      setVacancies(
        data.vacancies || []
      );
    } catch (error) {
      console.error(
        "Fetch admin vacancies error:",
        error
      );

      message.error(
        error.message ||
          "Server bilan bog‘lanishda xatolik"
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // LOAD DATA
  // ========================================

  useEffect(() => {
    fetchVacancies();
  }, []);

  // ========================================
  // FILTER
  // ========================================

  const filteredVacancies = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return vacancies.filter(
      (vacancy) => {
        const ustaName =
          vacancy.usta?.name || "";

        const ustaProfession =
          vacancy.usta?.profession || "";

        const ustaPhone =
          vacancy.usta?.phone || "";

        const matchesSearch =
          !searchValue ||
          vacancy.title
            ?.toLowerCase()
            .includes(searchValue) ||
          vacancy.description
            ?.toLowerCase()
            .includes(searchValue) ||
          vacancy.location
            ?.toLowerCase()
            .includes(searchValue) ||
          ustaName
            .toLowerCase()
            .includes(searchValue) ||
          ustaProfession
            .toLowerCase()
            .includes(searchValue) ||
          ustaPhone
            .toLowerCase()
            .includes(searchValue);

        const matchesCategory =
          category === "all" ||
          vacancy.category === category;

        const matchesStatus =
          status === "all" ||
          vacancy.status === status;

        return (
          matchesSearch &&
          matchesCategory &&
          matchesStatus
        );
      }
    );
  }, [
    vacancies,
    search,
    category,
    status,
  ]);

  // ========================================
  // DELETE VACANCY
  // ========================================

  const handleDelete = async (id) => {
    try {
      setDeleteLoading(true);

      const token =
        localStorage.getItem(
          "admin_token"
        );

      if (!token) {
        message.error(
          "Admin sifatida qayta kirishingiz kerak"
        );

        navigate("/admin/login");

        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/admin/vacancies/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      // TOKEN EXPIRED
      if (response.status === 401) {
        localStorage.removeItem(
          "admin_token"
        );

        localStorage.removeItem(
          "admin"
        );

        localStorage.removeItem(
          "admin_role"
        );

        message.error(
          "Admin sessiyasi tugagan. Qayta kiring."
        );

        navigate("/admin/login");

        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Vakansiyani o‘chirishda xatolik"
        );
      }

      // Local state'da ham
      // statusni deleted qilamiz
      setVacancies(
        (previousVacancies) =>
          previousVacancies.map(
            (vacancy) =>
              vacancy._id === id
                ? {
                    ...vacancy,
                    status: "deleted",
                  }
                : vacancy
          )
      );

      setSelectedVacancy(null);

      message.success(
        "Vakansiya muvaffaqiyatli o‘chirildi."
      );
    } catch (error) {
      console.error(
        "Delete vacancy error:",
        error
      );

      message.error(
        error.message ||
          "Vakansiyani o‘chirishda xatolik yuz berdi"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // ========================================
  // CLEAR FILTERS
  // ========================================

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setStatus("all");
  };

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
                  Vakansiyalar yuklanmoqda...
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
          {/* PAGE HEADER */}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-7">
            <div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/admin/dashboard"
                    )
                  }
                  className="w-9 h-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:text-brand hover:border-brand transition-colors"
                  aria-label="Dashboardga qaytish"
                >
                  <FaArrowLeft size={13} />
                </button>

                <h2 className="text-2xl font-bold text-navy">
                  Vakansiyalar
                </h2>
              </div>

              <p className="text-gray-500 mt-2">
                Platformadagi barcha
                vakansiyalarni boshqaring.
              </p>
            </div>

            {/* TOTAL */}

            <div className="bg-white border border-gray-100 rounded-xl px-5 py-3">
              <p className="text-xs text-gray-400">
                Jami vakansiyalar
              </p>

              <p className="text-xl font-bold text-navy">
                {vacancies.length}
              </p>
            </div>
          </div>

          {/* STATUS SUMMARY */}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {/* ACTIVE */}

            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">
                    Faol
                  </p>

                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {
                      vacancies.filter(
                        (vacancy) =>
                          vacancy.status ===
                          "active"
                      ).length
                    }
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                  <FaCheckCircle />
                </div>
              </div>
            </div>

            {/* INACTIVE */}

            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">
                    Nofaol
                  </p>

                  <p className="text-2xl font-bold text-orange-500 mt-1">
                    {
                      vacancies.filter(
                        (vacancy) =>
                          vacancy.status ===
                          "inactive"
                      ).length
                    }
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                  <FaTimesCircle />
                </div>
              </div>
            </div>

            {/* DELETED */}

            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">
                    O‘chirilgan
                  </p>

                  <p className="text-2xl font-bold text-red-500 mt-1">
                    {
                      vacancies.filter(
                        (vacancy) =>
                          vacancy.status ===
                          "deleted"
                      ).length
                    }
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                  <FaTrash />
                </div>
              </div>
            </div>
          </div>

          {/* FILTERS */}

          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_220px_220px_auto] gap-4">
              <Input
                size="large"
                prefix={
                  <FaSearch className="text-gray-400" />
                }
                placeholder="Vakansiya, manzil yoki usta bo‘yicha qidiring..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                allowClear
              />

              <Select
                size="large"
                value={category}
                onChange={setCategory}
                className="w-full"
                options={categoryOptions}
              />

              <Select
                size="large"
                value={status}
                onChange={setStatus}
                className="w-full"
                options={statusOptions}
              />

              <Button
                size="large"
                onClick={clearFilters}
              >
                Tozalash
              </Button>
            </div>
          </div>

          {/* RESULT COUNT */}

          <div className="mb-4">
            <p className="text-sm text-gray-500">
              {filteredVacancies.length} ta
              vakansiya ko‘rsatilmoqda
            </p>
          </div>

          {/* VACANCIES */}

          {filteredVacancies.length ===
          0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12">
              <Empty
                image={
                  <FaBriefcase className="text-gray-200 text-5xl mx-auto" />
                }
                description={
                  vacancies.length ===
                  0
                    ? "Hozircha vakansiyalar mavjud emas."
                    : "Qidiruv bo‘yicha vakansiya topilmadi."
                }
              />
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {/* DESKTOP */}

              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                        Vakansiya
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                        Usta
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                        Manzil
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                        Narx
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                        Holat
                      </th>

                      <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                        Amallar
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredVacancies.map(
                      (vacancy) => {
                        const statusInfo =
                          getStatusInfo(
                            vacancy.status
                          );

                        return (
                          <tr
                            key={
                              vacancy._id
                            }
                            className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors"
                          >
                            {/* VACANCY */}

                            <td className="px-6 py-5">
                              <div className="max-w-xs">
                                <div className="flex items-center gap-2 mb-2">
                                  <Tag color="blue">
                                    {getCategoryLabel(
                                      vacancy.category
                                    )}
                                  </Tag>
                                </div>

                                <p className="font-semibold text-navy line-clamp-2">
                                  {
                                    vacancy.title
                                  }
                                </p>

                                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                  {
                                    vacancy.description
                                  }
                                </p>
                              </div>
                            </td>

                            {/* USTA */}

                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-blue-50 text-brand flex items-center justify-center">
                                  <FaUserTie
                                    size={
                                      13
                                    }
                                  />
                                </div>

                                <div>
                                  <p className="font-medium text-gray-700">
                                    {vacancy
                                      .usta
                                      ?.name ||
                                      "Usta"}
                                  </p>

                                  <p className="text-xs text-gray-400">
                                    {vacancy
                                      .usta
                                      ?.profession ||
                                      vacancy.category}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* LOCATION */}

                            <td className="px-6 py-5">
                              <div className="flex items-center gap-2 text-gray-600">
                                <FaMapMarkerAlt className="text-brand" />

                                <span>
                                  {
                                    vacancy.location
                                  }
                                </span>
                              </div>
                            </td>

                            {/* PRICE */}

                            <td className="px-6 py-5">
                              <span className="font-semibold text-brand">
                                {vacancy.price ||
                                  "Kelishiladi"}
                              </span>
                            </td>

                            {/* STATUS */}

                            <td className="px-6 py-5">
                              <Tag
                                color={
                                  statusInfo.color
                                }
                                icon={
                                  statusInfo.icon
                                }
                              >
                                {
                                  statusInfo.label
                                }
                              </Tag>
                            </td>

                            {/* ACTIONS */}

                            <td className="px-6 py-5">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  type="text"
                                  icon={
                                    <FaEye />
                                  }
                                  onClick={() =>
                                    setSelectedVacancy(
                                      vacancy
                                    )
                                  }
                                >
                                  Ko‘rish
                                </Button>

                                {vacancy.status !==
                                  "deleted" && (
                                  <Button
                                    danger
                                    type="text"
                                    icon={
                                      <FaTrash />
                                    }
                                    onClick={() =>
                                      handleDelete(
                                        vacancy._id
                                      )
                                    }
                                  >
                                    O‘chirish
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>

              {/* MOBILE / TABLET */}

              <div className="lg:hidden divide-y divide-gray-100">
                {filteredVacancies.map(
                  (vacancy) => {
                    const statusInfo =
                      getStatusInfo(
                        vacancy.status
                      );

                    return (
                      <div
                        key={
                          vacancy._id
                        }
                        className="p-5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <Tag color="blue">
                              {getCategoryLabel(
                                vacancy.category
                              )}
                            </Tag>

                            <h3 className="font-semibold text-navy mt-3">
                              {
                                vacancy.title
                              }
                            </h3>
                          </div>

                          <span className="text-brand font-semibold whitespace-nowrap">
                            {vacancy.price ||
                              "Kelishiladi"}
                          </span>
                        </div>

                        <div className="mt-4 flex items-center gap-2">
                          <Tag
                            color={
                              statusInfo.color
                            }
                            icon={
                              statusInfo.icon
                            }
                          >
                            {
                              statusInfo.label
                            }
                          </Tag>
                        </div>

                        <div className="mt-4 space-y-2 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <FaUserTie />

                            {vacancy
                              .usta
                              ?.name ||
                              "Usta"}
                          </div>

                          <div className="flex items-center gap-2">
                            <FaMapMarkerAlt />

                            {
                              vacancy.location
                            }
                          </div>
                        </div>

                        <p className="text-sm text-gray-500 leading-6 mt-4 line-clamp-3">
                          {
                            vacancy.description
                          }
                        </p>

                        <div className="flex gap-2 mt-5">
                          <Button
                            icon={
                              <FaEye />
                            }
                            onClick={() =>
                              setSelectedVacancy(
                                vacancy
                              )
                            }
                          >
                            Ko‘rish
                          </Button>

                          {vacancy.status !==
                            "deleted" && (
                            <Button
                              danger
                              icon={
                                <FaTrash />
                              }
                              onClick={() =>
                                handleDelete(
                                  vacancy._id
                                )
                              }
                            >
                              O‘chirish
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* DETAIL MODAL */}

      <Modal
        open={!!selectedVacancy}
        title="Vakansiya ma'lumotlari"
        footer={null}
        width={700}
        onCancel={() =>
          setSelectedVacancy(null)
        }
      >
        {selectedVacancy && (
          <div>
            {/* TITLE */}

            <div>
              <div className="flex items-center gap-2">
                <Tag color="blue">
                  {getCategoryLabel(
                    selectedVacancy.category
                  )}
                </Tag>

                <Tag
                  color={
                    getStatusInfo(
                      selectedVacancy.status
                    ).color
                  }
                >
                  {
                    getStatusInfo(
                      selectedVacancy.status
                    ).label
                  }
                </Tag>
              </div>

              <h2 className="text-2xl font-bold text-navy mt-3">
                {
                  selectedVacancy.title
                }
              </h2>
            </div>

            {/* DETAILS */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {/* USTA */}

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-brand mb-2">
                  <FaUserTie />

                  <span className="text-xs text-gray-400">
                    Usta
                  </span>
                </div>

                <p className="font-medium text-gray-700">
                  {selectedVacancy
                    .usta?.name ||
                    "Usta"}
                </p>

                <p className="text-sm text-gray-400 mt-1">
                  {selectedVacancy
                    .usta?.profession ||
                    selectedVacancy.category}
                </p>
              </div>

              {/* LOCATION */}

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-brand mb-2">
                  <FaMapMarkerAlt />

                  <span className="text-xs text-gray-400">
                    Manzil
                  </span>
                </div>

                <p className="font-medium text-gray-700">
                  {
                    selectedVacancy.location
                  }
                </p>
              </div>

              {/* PRICE */}

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-brand mb-2">
                  <FaMoneyBillWave />

                  <span className="text-xs text-gray-400">
                    Narx
                  </span>
                </div>

                <p className="font-medium text-gray-700">
                  {selectedVacancy.price ||
                    "Kelishiladi"}
                </p>
              </div>

              {/* PHONE */}

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-brand mb-2">
                  <FaPhone />

                  <span className="text-xs text-gray-400">
                    Telefon
                  </span>
                </div>

                <p className="font-medium text-gray-700">
                  {selectedVacancy
                    .contactPhone ||
                    selectedVacancy.usta
                      ?.phone ||
                    "Ko‘rsatilmagan"}
                </p>
              </div>

              {/* VIEWS */}

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-brand mb-2">
                  <FaEye />

                  <span className="text-xs text-gray-400">
                    Ko‘rishlar
                  </span>
                </div>

                <p className="font-medium text-gray-700">
                  {selectedVacancy.views ||
                    0}
                </p>
              </div>

              {/* CREATED DATE */}

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-brand mb-2">
                  <FaBriefcase />

                  <span className="text-xs text-gray-400">
                    Yaratilgan sana
                  </span>
                </div>

                <p className="font-medium text-gray-700">
                  {selectedVacancy.createdAt
                    ? new Date(
                        selectedVacancy.createdAt
                      ).toLocaleDateString(
                        "uz-UZ"
                      )
                    : "Ko‘rsatilmagan"}
                </p>
              </div>
            </div>

            {/* DESCRIPTION */}

            <div className="mt-6">
              <h3 className="font-semibold text-navy mb-3">
                Tavsif
              </h3>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-600 leading-7 whitespace-pre-line">
                  {selectedVacancy.description ||
                    "Tavsif mavjud emas."}
                </p>
              </div>
            </div>

            {/* TELEGRAM */}

            <div className="mt-5 flex items-center gap-2 text-gray-600">
              <FaTelegramPlane className="text-brand" />

              <span>
                {selectedVacancy.telegram
                  ? `@${selectedVacancy.telegram.replace(
                      "@",
                      ""
                    )}`
                  : "Telegram ko‘rsatilmagan"}
              </span>
            </div>

            {/* ACTION */}

            <div className="border-t border-gray-100 mt-6 pt-5 flex justify-end">
              {selectedVacancy.status !==
                "deleted" && (
                <Button
                  danger
                  icon={<FaTrash />}
                  loading={deleteLoading}
                  onClick={() =>
                    handleDelete(
                      selectedVacancy._id
                    )
                  }
                >
                  Vakansiyani o‘chirish
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}