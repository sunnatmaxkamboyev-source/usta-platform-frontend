import { useEffect, useState } from "react";

import {
  Form,
  Input,
  Button,
  Card,
  message,
  Modal,
} from "antd";

import {
  FaUserShield,
  FaUser,
  FaLock,
  FaSave,
  FaSignOutAlt,
  FaArrowLeft,
  FaKey,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";

export default function AdminSettings() {
  const navigate = useNavigate();

  const [admin, setAdmin] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [passwordLoading, setPasswordLoading] =
    useState(false);

  const [form] = Form.useForm();

  const [passwordForm] =
    Form.useForm();

  // ========================================
  // GET ADMIN PROFILE
  // ========================================

  const fetchAdminProfile =
    async () => {
      try {
        const token =
          localStorage.getItem(
            "admin_token"
          );

        if (!token) {
          navigate("/admin/login");
          return;
        }

        const response =
          await fetch(
            "http://localhost:5000/api/admin/profile",
            {
              method: "GET",

              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (
          response.status ===
          401
        ) {
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

          navigate(
            "/admin/login"
          );

          return;
        }

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Admin ma'lumotlarini olishda xatolik"
          );
        }

        setAdmin(
          data.admin
        );

        form.setFieldsValue({
          name:
            data.admin.name ||
            "Admin",
        });

        // Navbar/Header uchun
        // localStorage ham yangilanadi
        localStorage.setItem(
          "admin",
          JSON.stringify(
            data.admin
          )
        );
      } catch (error) {
        console.error(
          "Fetch admin profile error:",
          error
        );

        message.error(
          error.message ||
            "Server bilan bog'lanishda xatolik"
        );
      }
    };

  // ========================================
  // LOAD
  // ========================================

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  // ========================================
  // UPDATE ADMIN NAME
  // ========================================

  const handleSave = async (
    values
  ) => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem(
          "admin_token"
        );

      if (!token) {
        navigate("/admin/login");
        return;
      }

      const response =
        await fetch(
          "http://localhost:5000/api/admin/profile",
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",

              Authorization: `Bearer ${token}`,
            },

            body: JSON.stringify({
              name: values.name,
            }),
          }
        );

      const data =
        await response.json();

      if (
        response.status ===
        401
      ) {
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

        navigate(
          "/admin/login"
        );

        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Ma'lumotlarni saqlashda xatolik"
        );
      }

      setAdmin(
        data.admin
      );

      localStorage.setItem(
        "admin",
        JSON.stringify(
          data.admin
        )
      );

      message.success(
        "Admin ma'lumotlari muvaffaqiyatli saqlandi."
      );
    } catch (error) {
      console.error(
        "Update admin error:",
        error
      );

      message.error(
        error.message ||
          "Ma'lumotlarni saqlashda xatolik yuz berdi."
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // CHANGE PASSWORD
  // ========================================

  const handleChangePassword =
    async (values) => {
      try {
        setPasswordLoading(
          true
        );

        const token =
          localStorage.getItem(
            "admin_token"
          );

        if (!token) {
          navigate(
            "/admin/login"
          );

          return;
        }

        const response =
          await fetch(
            "http://localhost:5000/api/admin/password",
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization: `Bearer ${token}`,
              },

              body: JSON.stringify({
                currentPassword:
                  values.currentPassword,

                newPassword:
                  values.newPassword,
              }),
            }
          );

        const data =
          await response.json();

        if (
          response.status ===
          401
        ) {
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

          navigate(
            "/admin/login"
          );

          return;
        }

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Parolni o'zgartirishda xatolik"
          );
        }

        message.success(
          "Parol muvaffaqiyatli o‘zgartirildi."
        );

        passwordForm.resetFields();

        // Xavfsizlik uchun
        // eski JWT sessiyani tugatamiz.
        localStorage.removeItem(
          "admin_token"
        );

        localStorage.removeItem(
          "admin"
        );

        localStorage.removeItem(
          "admin_role"
        );

        message.info(
          "Xavfsizlik sabab qayta login qiling."
        );

        navigate(
          "/admin/login"
        );
      } catch (error) {
        console.error(
          "Change password error:",
          error
        );

        message.error(
          error.message ||
            "Parolni o‘zgartirishda xatolik yuz berdi."
        );
      } finally {
        setPasswordLoading(
          false
        );
      }
    };

  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = () => {
    localStorage.removeItem(
      "admin_token"
    );

    localStorage.removeItem(
      "admin"
    );

    localStorage.removeItem(
      "admin_role"
    );

    message.success(
      "Admin paneldan chiqildi."
    );

    navigate(
      "/admin/login"
    );
  };

  // ========================================
  // LOADING PROFILE
  // ========================================

  if (!admin) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar />

        <div className="flex-1 min-w-0">
          <AdminHeader />

          <main className="p-6">
            <div className="flex items-center justify-center min-h-[500px]">
              <div className="text-gray-500">
                Admin ma'lumotlari
                yuklanmoqda...
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // ========================================
  // UI
  // ========================================

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* SIDEBAR */}

      <AdminSidebar />

      {/* MAIN */}

      <div className="flex-1 min-w-0">
        <AdminHeader />

        <main className="p-6 max-w-5xl">
          {/* PAGE TITLE */}

          <div className="flex items-center gap-3 mb-7">
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
              <FaArrowLeft
                size={13}
              />
            </button>

            <div>
              <h2 className="text-2xl font-bold text-navy">
                Sozlamalar
              </h2>

              <p className="text-gray-500 mt-1">
                Admin akkauntingizni
                boshqaring.
              </p>
            </div>
          </div>

          {/* ADMIN PROFILE */}

          <Card
            className="rounded-2xl mb-6"
            styles={{
              body: {
                padding: "28px",
              },
            }}
          >
            <div className="flex items-center gap-4 mb-7">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-brand flex items-center justify-center text-2xl">
                <FaUserShield />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-navy">
                  Admin profili
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  Admin akkauntingiz
                  ma'lumotlari.
                </p>
              </div>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSave}
            >
              {/* NAME */}

              <Form.Item
                label="Admin nomi"
                name="name"
                rules={[
                  {
                    required: true,
                    message:
                      "Admin nomini kiriting",
                  },

                  {
                    min: 2,
                    message:
                      "Admin nomi kamida 2 ta belgidan iborat bo‘lishi kerak",
                  },
                ]}
              >
                <Input
                  size="large"
                  prefix={
                    <FaUser className="text-gray-400" />
                  }
                  placeholder="Admin"
                />
              </Form.Item>

              {/* ROLE */}

              <Form.Item label="Rol">
                <Input
                  size="large"
                  value="Administrator"
                  prefix={
                    <FaUserShield className="text-gray-400" />
                  }
                  disabled
                />
              </Form.Item>

              {/* USERNAME */}

              <Form.Item label="Login">
                <Input
                  size="large"
                  value={
                    admin.username
                  }
                  prefix={
                    <FaLock className="text-gray-400" />
                  }
                  disabled
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                size="large"
                icon={<FaSave />}
                loading={loading}
              >
                O‘zgarishlarni
                saqlash
              </Button>
            </Form>
          </Card>

          {/* SECURITY */}

          <Card
            className="rounded-2xl mb-6"
            styles={{
              body: {
                padding: "28px",
              },
            }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand flex items-center justify-center text-xl">
                <FaLock />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-navy">
                  Xavfsizlik
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  Admin akkaunti
                  xavfsizlik sozlamalari.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white text-brand flex items-center justify-center">
                  <FaKey />
                </div>

                <div>
                  <p className="text-sm font-medium text-navy">
                    Parolni o‘zgartirish
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Admin parolingizni
                    xavfsiz tarzda
                    yangilang.
                  </p>
                </div>
              </div>

              <Button
                type="primary"
                ghost
                className="mt-4"
                onClick={() =>
                  passwordForm.resetFields()
                }
              >
                Parolni o‘zgartirish
              </Button>
            </div>

            {/* PASSWORD FORM */}

            <div className="mt-6 border-t border-gray-100 pt-6">
              <h3 className="font-semibold text-navy mb-4">
                Yangi parol
              </h3>

              <Form
                form={passwordForm}
                layout="vertical"
                onFinish={
                  handleChangePassword
                }
              >
                <Form.Item
                  label="Joriy parol"
                  name="currentPassword"
                  rules={[
                    {
                      required: true,
                      message:
                        "Joriy parolni kiriting",
                    },
                  ]}
                >
                  <Input.Password
                    size="large"
                    prefix={
                      <FaLock className="text-gray-400" />
                    }
                    placeholder="Joriy parol"
                  />
                </Form.Item>

                <Form.Item
                  label="Yangi parol"
                  name="newPassword"
                  rules={[
                    {
                      required: true,
                      message:
                        "Yangi parolni kiriting",
                    },

                    {
                      min: 6,
                      message:
                        "Yangi parol kamida 6 ta belgidan iborat bo‘lishi kerak",
                    },
                  ]}
                >
                  <Input.Password
                    size="large"
                    prefix={
                      <FaLock className="text-gray-400" />
                    }
                    placeholder="Yangi parol"
                  />
                </Form.Item>

                <Form.Item
                  label="Yangi parolni tasdiqlang"
                  name="confirmPassword"
                  dependencies={[
                    "newPassword",
                  ]}
                  rules={[
                    {
                      required: true,
                      message:
                        "Yangi parolni qayta kiriting",
                    },

                    ({ getFieldValue }) => ({
                      validator(
                        _,
                        value
                      ) {
                        if (
                          !value ||
                          getFieldValue(
                            "newPassword"
                          ) === value
                        ) {
                          return Promise.resolve();
                        }

                        return Promise.reject(
                          new Error(
                            "Parollar mos kelmaydi"
                          )
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    size="large"
                    prefix={
                      <FaLock className="text-gray-400" />
                    }
                    placeholder="Yangi parolni qayta kiriting"
                  />
                </Form.Item>

                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  icon={<FaKey />}
                  loading={
                    passwordLoading
                  }
                >
                  Parolni yangilash
                </Button>
              </Form>
            </div>
          </Card>

          {/* LOGOUT */}

          <Card
            className="rounded-2xl"
            styles={{
              body: {
                padding: "28px",
              },
            }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div>
                <h2 className="text-lg font-semibold text-navy">
                  Admin paneldan chiqish
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Joriy admin sessiyasini
                  yakunlash.
                </p>
              </div>

              <Button
                danger
                size="large"
                icon={
                  <FaSignOutAlt />
                }
                onClick={
                  handleLogout
                }
              >
                Chiqish
              </Button>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}