import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaSearch,
  FaUserTie,
  FaPhone,
  FaBriefcase,
  FaEye,
  FaTrash,
  FaArrowLeft,
} from "react-icons/fa";

import {
  Button,
  Empty,
  Input,
  Modal,
  message,
  Spin,
} from "antd";

import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";

export default function AdminMasters() {
  const navigate = useNavigate();

  // ========================================
  // STATE
  // ========================================

  const [search, setSearch] = useState("");

  const [selectedMaster, setSelectedMaster] =
    useState(null);

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [detailLoading, setDetailLoading] =
    useState(false);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);

  // ========================================
  // ADMIN TOKEN
  // ========================================

  const getToken = () => {
    return localStorage.getItem(
      "admin_token"
    );
  };

  // ========================================
  // ADMIN LOGOUT
  // ========================================

  const handleAdminSessionExpired = () => {
    localStorage.removeItem(
      "admin_token"
    );

    localStorage.removeItem("admin");

    localStorage.removeItem(
      "admin_role"
    );

    message.error(
      "Admin sessiyasi tugagan. Qayta kiring."
    );

    navigate("/admin/login");
  };

  // ========================================
  // GET ALL MASTERS
  // ========================================

  const fetchMasters = async () => {
    try {
      setLoading(true);

      const token = getToken();

      if (!token) {
        message.error(
          "Admin sifatida qayta kirishingiz kerak"
        );

        navigate("/admin/login");

        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/admin/masters",
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
        handleAdminSessionExpired();

        return;
      }

      // ========================================
      // API XATOSI
      // ========================================

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Ustalarni olishda xatolik"
        );
      }

      setUsers(
        Array.isArray(data.masters)
          ? data.masters
          : []
      );
    } catch (error) {
      console.error(
        "Fetch masters error:",
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

  // ========================================
  // LOAD MASTERS
  // ========================================

  useEffect(() => {
    fetchMasters();
  }, []);

  // ========================================
  // SEARCH
  // ========================================

  const filteredMasters = useMemo(() => {
    const value = search
      .trim()
      .toLowerCase();

    if (!value) {
      return users;
    }

    return users.filter((master) => {
      return (
        master.name
          ?.toLowerCase()
          .includes(value) ||

        master.phone
          ?.toLowerCase()
          .includes(value) ||

        master.profession
          ?.toLowerCase()
          .includes(value)
      );
    });
  }, [users, search]);

  // ========================================
  // GET MASTER DETAIL
  // ========================================

  const handleViewMaster = async (id) => {
    try {
      setDetailLoading(true);

      const token = getToken();

      if (!token) {
        handleAdminSessionExpired();

        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/admin/masters/${id}`,
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
        handleAdminSessionExpired();

        return;
      }

      // ========================================
      // API XATOSI
      // ========================================

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Usta ma'lumotlarini olishda xatolik"
        );
      }

      // Backenddan kelgan usta
      setSelectedMaster(
        data.master
      );
    } catch (error) {
      console.error(
        "Get master detail error:",
        error
      );

      message.error(
        error.message ||
          "Usta ma'lumotlarini olishda xatolik"
      );
    } finally {
      setDetailLoading(false);
    }
  };

  // ========================================
  // DELETE MASTER
  // ========================================

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Ustani o‘chirish",

      content:
        "Bu ustani o‘chirishni tasdiqlaysizmi? Unga tegishli ma'lumotlar ham o‘chirilishi mumkin.",

      okText: "O‘chirish",

      cancelText: "Bekor qilish",

      okButtonProps: {
        danger: true,
      },

      onOk: async () => {
        try {
          setDeleteLoading(true);

          setDeletingId(id);

          const token = getToken();

          if (!token) {
            handleAdminSessionExpired();

            return;
          }

          const response = await fetch(
            `http://localhost:5000/api/admin/masters/${id}`,
            {
              method: "DELETE",

              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data =
            await response.json();

          // ========================================
          // TOKEN XATOSI
          // ========================================

          if (response.status === 401) {
            handleAdminSessionExpired();

            return;
          }

          // ========================================
          // API XATOSI
          // ========================================

          if (!response.ok) {
            throw new Error(
              data.message ||
                "Ustani o‘chirishda xatolik"
            );
          }

          // ========================================
          // FRONTEND RO'YXATDAN OLIB TASHLASH
          // ========================================

          setUsers((prevUsers) =>
            prevUsers.filter(
              (user) =>
                user._id !== id
            )
          );

          // Agar modal ochiq bo'lsa yopamiz
          setSelectedMaster(null);

          message.success(
            "Usta muvaffaqiyatli o‘chirildi."
          );
        } catch (error) {
          console.error(
            "Delete master error:",
            error
          );

          message.error(
            error.message ||
              "Ustani o‘chirishda xatolik yuz berdi"
          );
        } finally {
          setDeleteLoading(false);

          setDeletingId(null);
        }
      },
    });
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
                  Ustalar yuklanmoqda...
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
                  Ustalar
                </h2>
              </div>

              <p className="text-gray-500 mt-2">
                Platformada ro‘yxatdan o‘tgan
                ustalarni boshqaring.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white border border-gray-100 rounded-xl px-5 py-3">
                <p className="text-xs text-gray-400">
                  Jami ustalar
                </p>

                <p className="text-xl font-bold text-navy">
                  {users.length}
                </p>
              </div>
            </div>
          </div>

          {/* SEARCH */}

          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
            <Input
              size="large"
              prefix={
                <FaSearch className="text-gray-400" />
              }
              placeholder="Usta nomi, telefon yoki kasb bo‘yicha qidiring..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              allowClear
            />
          </div>

          {/* TABLE */}

          {filteredMasters.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12">
              <Empty
                image={
                  <FaUserTie className="text-gray-200 text-5xl mx-auto" />
                }
                description={
                  users.length === 0
                    ? "Hozircha ro‘yxatdan o‘tgan ustalar yo‘q."
                    : "Qidiruv bo‘yicha usta topilmadi."
                }
              />
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {/* DESKTOP TABLE */}

              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                        Usta
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                        Kasbi
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                        Telefon
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                        Rol
                      </th>

                      <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                        Amallar
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredMasters.map(
                      (master) => (
                        <tr
                          key={master._id}
                          className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors"
                        >
                          {/* USTA */}

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-full bg-blue-50 text-brand flex items-center justify-center">
                                <FaUserTie />
                              </div>

                              <div>
                                <p className="font-semibold text-navy">
                                  {master.name}
                                </p>

                                <p className="text-xs text-gray-400 mt-1">
                                  ID: {master._id}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* KASB */}

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2 text-gray-600">
                              <FaBriefcase className="text-brand" />

                              <span>
                                {master.profession ||
                                  "Kasb ko‘rsatilmagan"}
                              </span>
                            </div>
                          </td>

                          {/* PHONE */}

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2 text-gray-600">
                              <FaPhone className="text-gray-400" />

                              <span>
                                {master.phone}
                              </span>
                            </div>
                          </td>

                          {/* ROLE */}

                          <td className="px-6 py-5">
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-brand text-xs font-semibold">
                              Usta
                            </span>
                          </td>

                          {/* ACTIONS */}

                          <td className="px-6 py-5">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                type="text"
                                icon={
                                  <FaEye />
                                }
                                loading={
                                  detailLoading &&
                                  selectedMaster?._id ===
                                    master._id
                                }
                                onClick={() =>
                                  handleViewMaster(
                                    master._id
                                  )
                                }
                              >
                                Ko‘rish
                              </Button>

                              <Button
                                danger
                                type="text"
                                icon={
                                  <FaTrash />
                                }
                                loading={
                                  deleteLoading &&
                                  deletingId ===
                                    master._id
                                }
                                onClick={() =>
                                  handleDelete(
                                    master._id
                                  )
                                }
                              >
                                O‘chirish
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS */}

              <div className="md:hidden divide-y divide-gray-100">
                {filteredMasters.map(
                  (master) => (
                    <div
                      key={master._id}
                      className="p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-blue-50 text-brand flex items-center justify-center">
                            <FaUserTie />
                          </div>

                          <div>
                            <p className="font-semibold text-navy">
                              {master.name}
                            </p>

                            <p className="text-sm text-gray-500">
                              {master.profession ||
                                "Kasb ko‘rsatilmagan"}
                            </p>
                          </div>
                        </div>

                        <span className="text-xs font-semibold text-brand bg-blue-50 rounded-full px-3 py-1">
                          Usta
                        </span>
                      </div>

                      <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                        <FaPhone />

                        {master.phone}
                      </div>

                      <div className="flex gap-2 mt-5">
                        <Button
                          icon={
                            <FaEye />
                          }
                          loading={
                            detailLoading &&
                            selectedMaster?._id ===
                              master._id
                          }
                          onClick={() =>
                            handleViewMaster(
                              master._id
                            )
                          }
                        >
                          Ko‘rish
                        </Button>

                        <Button
                          danger
                          icon={
                            <FaTrash />
                          }
                          loading={
                            deleteLoading &&
                            deletingId ===
                              master._id
                          }
                          onClick={() =>
                            handleDelete(
                              master._id
                            )
                          }
                        >
                          O‘chirish
                        </Button>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MASTER DETAILS MODAL */}

      <Modal
        open={!!selectedMaster}
        title="Usta ma'lumotlari"
        footer={null}
        onCancel={() =>
          setSelectedMaster(null)
        }
      >
        {selectedMaster && (
          <div className="space-y-5">
            {/* PROFILE */}

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-brand flex items-center justify-center text-2xl">
                <FaUserTie />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-navy">
                  {selectedMaster.name}
                </h3>

                <p className="text-gray-500">
                  {selectedMaster.profession ||
                    "Kasb ko‘rsatilmagan"}
                </p>
              </div>
            </div>

            {/* INFO */}

            <div className="border-t border-gray-100 pt-5 space-y-4">
              <div>
                <p className="text-xs text-gray-400">
                  Telefon
                </p>

                <p className="text-gray-700 font-medium mt-1">
                  {selectedMaster.phone}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Rol
                </p>

                <p className="text-gray-700 font-medium mt-1">
                  Usta
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Foydalanuvchi ID
                </p>

                <p className="text-gray-700 font-medium mt-1 break-all">
                  {selectedMaster._id}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Ro‘yxatdan o‘tgan sana
                </p>

                <p className="text-gray-700 font-medium mt-1">
                  {selectedMaster.createdAt
                    ? new Date(
                        selectedMaster.createdAt
                      ).toLocaleDateString(
                        "uz-UZ"
                      )
                    : "—"}
                </p>
              </div>
            </div>

            {/* DELETE */}

            <div className="border-t border-gray-100 pt-5 flex justify-end">
              <Button
                danger
                icon={<FaTrash />}
                loading={
                  deleteLoading &&
                  deletingId ===
                    selectedMaster._id
                }
                onClick={() =>
                  handleDelete(
                    selectedMaster._id
                  )
                }
              >
                Ustani o‘chirish
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

