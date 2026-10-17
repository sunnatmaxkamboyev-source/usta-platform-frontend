
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Avatar,
  Button,
  Card,
  Divider,
  Empty,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Spin,
  Tag,
} from "antd";
import {
  UserOutlined,
  PlusOutlined,
  LogoutOutlined,
  DeleteOutlined,
  EditOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  SendOutlined,
  LockOutlined,
  FileTextOutlined,
  SettingOutlined,
  EyeOutlined,
  ToolOutlined,
  SafetyCertificateOutlined,
  CameraOutlined,
} from "@ant-design/icons";

import { logoutUser } from "../utils/auth";
import WorkSamples from "../components/WorkSamples";

const API = "https://usta-platform-backend.onrender.com/api";
const PROFILE_IMAGE_KEY = "ustaProfileImage";
const MAX_IMAGE_SIZE = 1024 * 1024;

export default function Dashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [profileImage, setProfileImage] = useState(() => {
    try {
      return localStorage.getItem(PROFILE_IMAGE_KEY);
    } catch {
      return null;
    }
  });

  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login", { replace: true });
          return;
        }

        const userResponse = await fetch(`${API}/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userData = await userResponse.json();

        if (userResponse.status === 401) {
          logoutUser();
          message.error(t("ustaDashboard.messages.sessionExpired"));
          navigate("/login", { replace: true });
          return;
        }

        if (!userResponse.ok) {
          throw new Error(
            userData.message ||
              t("ustaDashboard.messages.userFetchError")
          );
        }

        setUser(userData.user);
        localStorage.setItem("user", JSON.stringify(userData.user));
        localStorage.setItem("role", userData.user.role);

        const vacancyResponse = await fetch(`${API}/vacancies/my`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const vacancyData = await vacancyResponse.json();

        if (vacancyResponse.status === 401) {
          logoutUser();
          message.error(t("ustaDashboard.messages.sessionExpired"));
          navigate("/login", { replace: true });
          return;
        }

        if (!vacancyResponse.ok) {
          throw new Error(
            vacancyData.message ||
              t("ustaDashboard.messages.vacanciesFetchError")
          );
        }

        setVacancies(vacancyData.vacancies || []);
      } catch (error) {
        console.error("Dashboard loading error:", error);
        message.error(
          error.message ||
            t("ustaDashboard.messages.dashboardFetchError")
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate, t]);

  // Profil rasmini tanlash va saqlash
  const handleChooseProfileImage = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      message.error("Iltimos, rasm faylini tanlang.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      message.error(
        "Rasm hajmi 1 MB dan oshmasligi kerak. Kichikroq rasm tanlang."
      );
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const imageData = reader.result;

        if (typeof imageData !== "string") {
          message.error("Rasmni o‘qib bo‘lmadi.");
          return;
        }

        localStorage.setItem(PROFILE_IMAGE_KEY, imageData);
        setProfileImage(imageData);
        message.success("Profil rasmi saqlandi!");
      } catch (error) {
        console.error("Profile image save error:", error);
        message.error(
          "Rasmni saqlab bo‘lmadi. Kichikroq rasm tanlab ko‘ring."
        );
      }
    };

    reader.onerror = () => {
      message.error("Rasmni o‘qishda xatolik yuz berdi.");
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  };

  // Profil rasmini o‘chirish
  const handleRemoveProfileImage = () => {
    try {
      localStorage.removeItem(PROFILE_IMAGE_KEY);
      setProfileImage(null);
      message.success("Profil rasmi o‘chirildi!");
    } catch (error) {
      console.error("Profile image remove error:", error);
      message.error("Rasmni o‘chirib bo‘lmadi.");
    }
  };

  // Profil rasmini boshqarish oynasi
  const handleManageProfileImage = () => {
    Modal.confirm({
      title: "Profil rasmini boshqarish",
      content: profileImage
        ? "Rasmni almashtirishingiz yoki o‘chirishingiz mumkin."
        : "Kompyuteringizdan yangi profil rasmi tanlang.",
      icon: <CameraOutlined />,
      okText: "Rasm tanlash",
      cancelText: "Bekor qilish",
      onOk: () => {
        fileInputRef.current?.click();
      },
      footer: (_, { OkBtn, CancelBtn }) => (
        <div className="flex flex-wrap justify-end gap-2">
          <CancelBtn />

          {profileImage && (
            <Button
              danger
              onClick={() => {
                Modal.confirm({
                  title: "Rasmni o‘chirish",
                  content: "Profil rasmini o‘chirishni xohlaysizmi?",
                  okText: "Ha, o‘chirish",
                  cancelText: "Bekor qilish",
                  okButtonProps: { danger: true },
                  onOk: handleRemoveProfileImage,
                });
              }}
            >
              Rasmni o‘chirish
            </Button>
          )}

          <OkBtn />
        </div>
      ),
    });
  };

  // Tizimdan chiqish
  const handleLogout = () => {
    logoutUser();
    setUser(null);
    message.success(t("ustaDashboard.messages.logoutSuccess"));
    navigate("/login", { replace: true });
  };

  // Profil oynasini ochish
  const handleOpenProfile = () => {
    profileForm.setFieldsValue({
      name: user?.name || "",
      phone: user?.phone || "",
      profession: user?.profession || "",
    });

    passwordForm.resetFields();
    setProfileModalOpen(true);
  };

  const handleCloseProfile = () => {
    if (profileLoading || passwordLoading) return;

    setProfileModalOpen(false);
    profileForm.resetFields();
    passwordForm.resetFields();
  };

  // Profilni yangilash
  const handleUpdateProfile = async (values) => {
    try {
      setProfileLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        logoutUser();
        navigate("/login", { replace: true });
        return;
      }

      const response = await fetch(`${API}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: values.name,
          phone: values.phone,
          profession: values.profession,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        logoutUser();
        message.error(t("ustaDashboard.messages.sessionExpired"));
        navigate("/login", { replace: true });
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            t("ustaDashboard.messages.profileUpdateError")
        );
      }

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", data.user.role);

      message.success(t("ustaDashboard.messages.profileUpdateSuccess"));
    } catch (error) {
      console.error("Update profile error:", error);
      message.error(
        error.message ||
          t("ustaDashboard.messages.profileUpdateError")
      );
    } finally {
      setProfileLoading(false);
    }
  };

  // Parolni almashtirish
  const handleChangePassword = async (values) => {
    try {
      setPasswordLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        logoutUser();
        navigate("/login", { replace: true });
        return;
      }

      const response = await fetch(`${API}/auth/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        logoutUser();
        message.error(
          data.message ||
            t("ustaDashboard.messages.sessionExpired")
        );
        navigate("/login", { replace: true });
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            t("ustaDashboard.messages.passwordUpdateError")
        );
      }

      passwordForm.resetFields();
      message.success(t("ustaDashboard.messages.passwordUpdateSuccess"));
    } catch (error) {
      console.error("Change password error:", error);
      message.error(
        error.message ||
          t("ustaDashboard.messages.passwordUpdateError")
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  // E'lonni o‘chirish
  const handleDelete = async (id) => {
    try {
      setDeleteLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        logoutUser();
        navigate("/login", { replace: true });
        return;
      }

      const response = await fetch(`${API}/vacancies/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.status === 401) {
        logoutUser();
        message.error(t("ustaDashboard.messages.sessionExpired"));
        navigate("/login", { replace: true });
        return;
      }

      if (response.status === 403) {
        message.error(t("ustaDashboard.messages.deletePermission"));
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            t("ustaDashboard.messages.deleteVacancyError")
        );
      }

      setVacancies((previous) =>
        previous.filter((vacancy) => vacancy._id !== id)
      );

      message.success(t("ustaDashboard.messages.deleteSuccess"));
    } catch (error) {
      console.error("Delete vacancy error:", error);
      message.error(
        error.message ||
          t("ustaDashboard.messages.deleteVacancyError")
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/vacancies/edit/${id}`);
  };

  const handleCreate = () => {
    navigate("/vacancies/new");
  };

  const handleDetail = (id) => {
    navigate(`/vakansiyalar/${id}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50">
        <Spin size="large" />
        <p className="text-sm text-slate-500">
          {t("ustaDashboard.loading")}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-[#101D35] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex min-w-0 items-center gap-3 text-left"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600">
              <ToolOutlined className="text-xl text-white" />
            </span>

            <span>
              <span className="block text-base font-bold tracking-tight sm:text-lg">
                Usta Platform
              </span>
              <span className="block text-xs text-slate-400">
                {t("ustaDashboard.title")}
              </span>
            </span>
          </button>

          <Button
            ghost
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            className="!border-slate-600 !text-slate-200 hover:!border-red-400 hover:!text-red-300"
          >
            <span className="hidden sm:inline">{t("auth.logout")}</span>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* PROFIL */}
        <section className="mb-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400" />

          <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex min-w-0 items-center gap-4">
              <div className="relative shrink-0">
                <Avatar
                  size={80}
                  src={profileImage || undefined}
                  icon={<UserOutlined />}
                  className="!bg-blue-50 !text-blue-700"
                />

                <button
                  type="button"
                  onClick={handleManageProfileImage}
                  title="Profil rasmini boshqarish"
                  aria-label="Profil rasmini boshqarish"
                  className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow transition hover:bg-blue-700"
                >
                  <CameraOutlined />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleChooseProfileImage}
                />
              </div>

              <div className="min-w-0">
                <h2 className="break-words text-lg font-bold text-[#15233B] sm:text-xl">
                  {user?.name || t("ustaDashboard.profile.defaultName")}
                </h2>

                <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                  <ToolOutlined />
                  <span>
                    {user?.profession ||
                      t("ustaDashboard.profile.noProfession")}
                  </span>
                </p>

                <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                  <PhoneOutlined />
                  <span>
                    {user?.phone || t("ustaDashboard.profile.noPhone")}
                  </span>
                </p>

                <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                  <SafetyCertificateOutlined />
                  {t("ustaDashboard.title")}
                </span>

                <p className="mt-2 text-xs text-slate-400">
                  Rasmni o‘zgartirish yoki o‘chirish uchun kamera belgisini bosing.
                </p>
              </div>
            </div>

            <Button
              icon={<SettingOutlined />}
              onClick={handleOpenProfile}
              className="!h-10 !rounded-lg !font-medium"
            >
              {t("ustaDashboard.profile.edit")}
            </Button>
          </div>
        </section>

        {/* ISH NAMUNALARI */}
        <WorkSamples />

        {/* SAHIFA SARLAVHASI */}
        <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#15233B] sm:text-3xl">
              {t("ustaDashboard.title")}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              {t("ustaDashboard.description")}
            </p>
          </div>

          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            className="!h-11 !rounded-xl !bg-blue-600 !font-semibold shadow-sm hover:!bg-blue-700"
          >
            {t("ustaDashboard.newVacancy")}
          </Button>
        </section>

        {/* STATISTIKA */}
        <section className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FileTextOutlined className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-slate-500">
                {t("ustaDashboard.title")}
              </p>
              <p className="mt-1 text-2xl font-extrabold text-[#15233B]">
                {vacancies.length}
              </p>
              <p className="text-xs text-slate-400">
                {t("ustaDashboard.vacancy.price")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <UserOutlined className="text-xl" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-slate-500">
                {t("ustaDashboard.profile.edit")}
              </p>
              <p className="mt-1 truncate text-lg font-bold text-[#15233B]">
                {user?.name || t("ustaDashboard.profile.defaultName")}
              </p>
              <p className="text-xs text-slate-400">
                {user?.profession ||
                  t("ustaDashboard.profile.noProfession")}
              </p>
            </div>
          </div>
        </section>

        {/* E'LONLAR SARLAVHASI */}
        <section className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#15233B] sm:text-xl">
              {t("ustaDashboard.title")}
            </h2>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              {t("ustaDashboard.description")}
            </p>
          </div>

          <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-bold text-blue-700">
            {vacancies.length}
          </span>
        </section>

        {/* E'LONLAR */}
        {vacancies.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span className="text-sm text-slate-500">
                  {t("ustaDashboard.empty")}
                </span>
              }
            />

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
              className="!mt-3 !rounded-lg !bg-blue-600"
            >
              {t("ustaDashboard.firstVacancy")}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {vacancies.map((vacancy) => (
              <Card
                key={vacancy._id}
                bordered={false}
                className="!overflow-hidden !rounded-2xl !border !border-slate-200 !shadow-sm transition-all duration-200 hover:!border-blue-200 hover:!shadow-md"
                styles={{ body: { padding: 20 } }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <ToolOutlined className="text-lg" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="break-words text-base font-bold leading-6 text-[#15233B] sm:text-lg">
                      {vacancy.title}
                    </h3>
                    <div className="mt-2">
                      <Tag color="blue" className="!m-0 !rounded-md">
                        {vacancy.category}
                      </Tag>
                    </div>
                  </div>

                  <Popconfirm
                    title={t("ustaDashboard.deleteConfirm.title")}
                    description={t("ustaDashboard.deleteConfirm.description")}
                    okText={t("ustaDashboard.deleteConfirm.yes")}
                    cancelText={t("ustaDashboard.deleteConfirm.no")}
                    okButtonProps={{
                      danger: true,
                      loading: deleteLoading,
                    }}
                    onConfirm={() => handleDelete(vacancy._id)}
                  >
                    <Button
                      danger
                      type="text"
                      icon={<DeleteOutlined />}
                      aria-label={t("ustaDashboard.deleteConfirm.title")}
                    />
                  </Popconfirm>
                </div>

                <div className="mt-5 flex items-start gap-2 text-sm text-slate-500">
                  <EnvironmentOutlined className="mt-1 shrink-0 text-blue-600" />
                  <span className="break-words">{vacancy.location}</span>
                </div>

                <div className="mt-4 rounded-xl bg-slate-50 p-3">
                  <p className="text-xs font-medium text-slate-500">
                    {t("ustaDashboard.vacancy.price")}
                  </p>
                  <p className="mt-1 break-words text-base font-bold text-blue-700">
                    {vacancy.price || t("common.negotiable")}
                  </p>
                </div>

                <p className="mt-4 line-clamp-3 min-h-[60px] text-sm leading-5 text-slate-500">
                  {vacancy.description}
                </p>

                <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <PhoneOutlined className="shrink-0 text-slate-400" />
                    <span className="break-all">
                      {vacancy.contactPhone || "—"}
                    </span>
                  </div>

                  {vacancy.telegram && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <SendOutlined className="shrink-0 text-sky-500" />
                      <span className="break-all">
                        @{vacancy.telegram.replace("@", "")}
                      </span>
                    </div>
                  )}
                </div>

                <Divider className="!my-4" />

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(vacancy._id)}
                    className="!h-10 !rounded-lg !font-medium"
                  >
                    {t("common.edit")}
                  </Button>

                  <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() => handleDetail(vacancy._id)}
                    className="!h-10 !rounded-lg !bg-blue-600 !font-medium hover:!bg-blue-700"
                  >
                    {t("common.viewDetail")}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* PROFIL VA PAROL SOZLAMALARI */}
      <Modal
        title={t("ustaDashboard.profileModal.title")}
        open={profileModalOpen}
        onCancel={handleCloseProfile}
        footer={null}
        destroyOnHidden
        width={520}
        centered
      >
        <div className="mb-5 rounded-xl bg-blue-50 p-4">
          <h3 className="font-bold text-[#15233B]">
            {t("ustaDashboard.profileModal.personalTitle")}
          </h3>
          <p className="mt-1 text-sm leading-5 text-slate-500">
            {t("ustaDashboard.profileModal.personalDescription")}
          </p>
        </div>

        <Form
          form={profileForm}
          layout="vertical"
          onFinish={handleUpdateProfile}
          requiredMark={false}
        >
          <Form.Item
            label={t("ustaDashboard.form.name")}
            name="name"
            rules={[
              {
                required: true,
                message: t("ustaDashboard.validation.nameRequired"),
              },
              {
                min: 2,
                message: t("ustaDashboard.validation.nameMin"),
              },
            ]}
          >
            <Input
              size="large"
              placeholder={t("ustaDashboard.form.namePlaceholder")}
              prefix={<UserOutlined />}
            />
          </Form.Item>

          <Form.Item
            label={t("ustaDashboard.form.phone")}
            name="phone"
            rules={[
              {
                required: true,
                message: t("ustaDashboard.validation.phoneRequired"),
              },
            ]}
          >
            <Input
              size="large"
              placeholder="+998 90 123 45 67"
              prefix={<PhoneOutlined />}
            />
          </Form.Item>

          <Form.Item
            label={t("ustaDashboard.form.profession")}
            name="profession"
            rules={[
              {
                required: true,
                message: t("ustaDashboard.validation.professionRequired"),
              },
              {
                min: 2,
                message: t("ustaDashboard.validation.professionMin"),
              },
            ]}
          >
            <Input
              size="large"
              placeholder={t("ustaDashboard.form.professionPlaceholder")}
              prefix={<ToolOutlined />}
            />
          </Form.Item>

          <Button
            block
            type="primary"
            htmlType="submit"
            loading={profileLoading}
            icon={<EditOutlined />}
            className="!h-11 !rounded-lg !bg-blue-600 !font-semibold"
          >
            {t("ustaDashboard.form.saveProfile")}
          </Button>
        </Form>

        <Divider />

        <div className="mb-5">
          <h3 className="font-bold text-[#15233B]">
            {t("ustaDashboard.password.title")}
          </h3>
          <p className="mt-1 text-sm leading-5 text-slate-500">
            {t("ustaDashboard.password.description")}
          </p>
        </div>

        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleChangePassword}
          requiredMark={false}
        >
          <Form.Item
            label={t("ustaDashboard.password.current")}
            name="currentPassword"
            rules={[
              {
                required: true,
                message: t("ustaDashboard.validation.currentPasswordRequired"),
              },
            ]}
          >
            <Input.Password
              size="large"
              placeholder={t("ustaDashboard.password.currentPlaceholder")}
              prefix={<LockOutlined />}
            />
          </Form.Item>

          <Form.Item
            label={t("ustaDashboard.password.new")}
            name="newPassword"
            rules={[
              {
                required: true,
                message: t("ustaDashboard.validation.newPasswordRequired"),
              },
              {
                min: 6,
                message: t("ustaDashboard.validation.newPasswordMin"),
              },
            ]}
          >
            <Input.Password
              size="large"
              placeholder={t("ustaDashboard.password.newPlaceholder")}
              prefix={<LockOutlined />}
            />
          </Form.Item>

          <Form.Item
            label={t("ustaDashboard.password.confirm")}
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              {
                required: true,
                message: t("ustaDashboard.validation.confirmPasswordRequired"),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (
                    !value ||
                    getFieldValue("newPassword") === value
                  ) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error(
                      t("ustaDashboard.validation.passwordMismatch")
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password
              size="large"
              placeholder={t("ustaDashboard.password.confirmPlaceholder")}
              prefix={<LockOutlined />}
            />
          </Form.Item>

          <Button
            block
            type="primary"
            htmlType="submit"
            loading={passwordLoading}
            icon={<LockOutlined />}
            className="!h-11 !rounded-lg !bg-blue-600 !font-semibold"
          >
            {t("ustaDashboard.password.change")}
          </Button>
        </Form>
      </Modal>
    </div>
  );
}
