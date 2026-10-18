
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

// Profil rasmini brauzerning o'zida kichraytirish va siqish
const compressProfileImage = (file) =>
  new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      try {
        const maxDimension = 400;
        const scale = Math.min(
          1,
          maxDimension / Math.max(image.width, image.height)
        );

        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));

        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("Rasmni qayta ishlash imkoni bo'lmadi.");
        }

        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        const compressedImage = canvas.toDataURL("image/jpeg", 0.7);

        URL.revokeObjectURL(objectUrl);

        if (!compressedImage.startsWith("data:image/jpeg;base64,")) {
          reject(new Error("Rasmni siqishda xatolik yuz berdi."));
          return;
        }

        resolve(compressedImage);
      } catch (error) {
        URL.revokeObjectURL(objectUrl);
        reject(error);
      }
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Rasmni ochib bo'lmadi. Boshqa rasm tanlang."));
    };

    image.src = objectUrl;
  });

function Dashboard() {
  const navigate = useNavigate();

  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vacanciesLoading, setVacanciesLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem(PROFILE_IMAGE_KEY) || ""
  );
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  // API so'rovlari uchun umumiy funksiya
  const apiRequest = async (url, options = {}) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API}${url}`, {
      ...options,
      headers: {
        ...(options.body instanceof FormData
          ? {}
          : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    let data = {};

    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (response.status === 401) {
      logoutUser();
      navigate("/login", { replace: true });
      throw new Error("Sessiya tugadi. Qaytadan tizimga kiring.");
    }

    if (!response.ok) {
      throw new Error(
        data.message ||
          data.error ||
          "So'rovni bajarishda xatolik yuz berdi."
      );
    }

    return data;
  };

  // Foydalanuvchi va e'lonlarni olish
  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        setLoading(true);

        const userData = await apiRequest("/auth/me");

        if (cancelled) return;

        const currentUser = userData.user || userData;

        setUser(currentUser);
        localStorage.setItem("user", JSON.stringify(currentUser));

        if (currentUser.role) {
          localStorage.setItem("role", currentUser.role);
        }

        const savedImage = currentUser.profileImage || "";

        setProfileImage(savedImage);

        if (savedImage) {
          localStorage.setItem(PROFILE_IMAGE_KEY, savedImage);
        } else {
          localStorage.removeItem(PROFILE_IMAGE_KEY);
        }

        profileForm.setFieldsValue({
          name: currentUser.name || "",
          phone: currentUser.phone || "",
          profession: currentUser.profession || "",
        });

        setVacanciesLoading(true);

        try {
          const vacancyData = await apiRequest("/vacancies/my");

          if (cancelled) return;

          const myVacancies = Array.isArray(vacancyData)
            ? vacancyData
            : vacancyData.vacancies || vacancyData.data || [];

          setVacancies(myVacancies);
        } catch (error) {
          if (!cancelled) {
            console.error("E'lonlarni olishda xatolik:", error);
            message.error(
              error.message || "E'lonlarni yuklab bo'lmadi."
            );
          }
        } finally {
          if (!cancelled) setVacanciesLoading(false);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Dashboard yuklashda xatolik:", error);
          message.error(
            error.message || "Ma'lumotlarni yuklab bo'lmadi."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [navigate, profileForm]);

  // Profil rasmini tanlash, siqish va backend'ga saqlash
  const handleChooseProfileImage = async (event) => {
    const input = event.target;
    const file = input.files?.[0];

    // Bir xil rasmni qaytadan tanlash mumkin
    input.value = "";

    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      message.error("JPG, PNG, WEBP yoki GIF formatidagi rasm tanlang.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      message.error("Rasm hajmi 10 MB dan oshmasligi kerak.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token || !user) {
      message.error("Avval akkauntingizga kiring.");
      navigate("/login", { replace: true });
      return;
    }

    try {
      setProfileSaving(true);

      // Asl rasmni emas, siqilgan rasmni yuboramiz
      const imageData = await compressProfileImage(file);

      const data = await apiRequest("/auth/profile", {
        method: "PUT",
        body: JSON.stringify({
          name: user.name,
          phone: user.phone,
          profession: user.profession,
          profileImage: imageData,
        }),
      });

      const savedUser = data.user || data;
      const savedImage = savedUser.profileImage || imageData;

      setUser(savedUser);
      setProfileImage(savedImage);

      localStorage.setItem("user", JSON.stringify(savedUser));
      localStorage.setItem(PROFILE_IMAGE_KEY, savedImage);

      message.success("Profil rasmi muvaffaqiyatli saqlandi!");
    } catch (error) {
      console.error("Profil rasmini saqlashda xatolik:", error);
      message.error(
        error.message || "Rasmni saqlashda xatolik yuz berdi."
      );
    } finally {
      setProfileSaving(false);
    }
  };

  // Profil rasmini backend'dan o'chirish
  const handleRemoveProfileImage = async () => {
    if (!user) return;

    try {
      setProfileSaving(true);

      const data = await apiRequest("/auth/profile", {
        method: "PUT",
        body: JSON.stringify({
          name: user.name,
          phone: user.phone,
          profession: user.profession,
          profileImage: "",
        }),
      });

      const updatedUser = data.user || data;

      setUser(updatedUser);
      setProfileImage("");

      localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.removeItem(PROFILE_IMAGE_KEY);

      message.success("Profil rasmi o'chirildi!");
    } catch (error) {
      console.error("Profil rasmini o'chirishda xatolik:", error);
      message.error(
        error.message || "Profil rasmini o'chirib bo'lmadi."
      );
    } finally {
      setProfileSaving(false);
    }
  };

  // Avatar boshqaruvi
  const handleManageProfileImage = () => {
    Modal.confirm({
      title: "Profil rasmi",
      content: profileImage
        ? "Rasmni almashtirish uchun yangi rasm tanlang yoki mavjud rasmni o'chiring."
        : "Profilingiz uchun rasm tanlang.",
      okText: "Rasm tanlash",
      cancelText: "Bekor qilish",
      onOk: () => fileInputRef.current?.click(),
      footer: (_, { OkBtn, CancelBtn }) => (
        <>
          <CancelBtn />
          {profileImage && (
            <Button
              danger
              loading={profileSaving}
              onClick={() => {
                Modal.confirm({
                  title: "Rasmni o'chirish",
                  content: "Profil rasmini o'chirmoqchimisiz?",
                  okText: "Ha, o'chirish",
                  cancelText: "Bekor qilish",
                  okButtonProps: { danger: true },
                  onOk: handleRemoveProfileImage,
                });
              }}
            >
              Rasmni o'chirish
            </Button>
          )}
          <OkBtn />
        </>
      ),
    });
  };

  // Profil ma'lumotlarini yangilash
  const handleUpdateProfile = async (values) => {
    try {
      setProfileSaving(true);

      const data = await apiRequest("/auth/profile", {
        method: "PUT",
        body: JSON.stringify({
          name: values.name?.trim(),
          phone: values.phone?.trim(),
          profession: values.profession?.trim(),
        }),
      });

      const updatedUser = data.user || data;

      setUser(updatedUser);
      setProfileImage(updatedUser.profileImage || "");

      localStorage.setItem("user", JSON.stringify(updatedUser));

      if (updatedUser.profileImage) {
        localStorage.setItem(
          PROFILE_IMAGE_KEY,
          updatedUser.profileImage
        );
      } else {
        localStorage.removeItem(PROFILE_IMAGE_KEY);
      }

      message.success("Profil ma'lumotlari yangilandi!");
      setProfileModalOpen(false);
    } catch (error) {
      console.error("Profilni yangilashda xatolik:", error);
      message.error(error.message || "Profilni yangilab bo'lmadi.");
    } finally {
      setProfileSaving(false);
    }
  };

  // Parolni o'zgartirish
  const handleChangePassword = async (values) => {
    try {
      setPasswordSaving(true);

      await apiRequest("/auth/password", {
        method: "PUT",
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      });

      message.success("Parol muvaffaqiyatli o'zgartirildi!");
      passwordForm.resetFields();
      setPasswordModalOpen(false);
    } catch (error) {
      console.error("Parolni o'zgartirishda xatolik:", error);
      message.error(
        error.message || "Parolni o'zgartirib bo'lmadi."
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleCreate = () => {
    navigate("/vacancies/new");
  };

  const handleEdit = (vacancy) => {
    navigate(`/vacancies/edit/${vacancy._id || vacancy.id}`);
  };

  const handleDetail = (vacancy) => {
    navigate(`/vakansiyalar/${vacancy._id || vacancy.id}`);
  };

  // E'lonni o'chirish
  const handleDelete = async (vacancyId) => {
    try {
      await apiRequest(`/vacancies/${vacancyId}`, {
        method: "DELETE",
      });

      setVacancies((previous) =>
        previous.filter(
          (vacancy) => (vacancy._id || vacancy.id) !== vacancyId
        )
      );

      message.success("E'lon muvaffaqiyatli o'chirildi!");
    } catch (error) {
      console.error("E'lonni o'chirishda xatolik:", error);
      message.error(error.message || "E'lonni o'chirib bo'lmadi.");
    }
  };

  // Tizimdan chiqish
  const handleLogout = () => {
    logoutUser();
    localStorage.removeItem(PROFILE_IMAGE_KEY);
    navigate("/login", { replace: true });
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" tip="Ma'lumotlar yuklanmoqda..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <Empty description="Foydalanuvchi ma'lumotlari topilmadi">
          <Button type="primary" onClick={() => navigate("/login")}>
            Tizimga kirish
          </Button>
        </Empty>
      </div>
    );
  }

  const displayName = user.name || "Usta";
  const displayProfession = user.profession || "Usta";
  const displayPhone = user.phone || "Telefon ko'rsatilmagan";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        paddingBottom: 40,
      }}
    >
      <header
        style={{
          background: "#101828",
          color: "#fff",
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 20,
            fontWeight: 700,
          }}
        >
          <ToolOutlined style={{ fontSize: 25, color: "#60a5fa" }} />
          <span>Usta Platform</span>
        </div>

        <Button icon={<LogoutOutlined />} onClick={handleLogout}>
          Chiqish
        </Button>
      </header>

      <main
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "28px 20px",
        }}
      >
        <Card
          bordered={false}
          style={{
            borderRadius: 16,
            marginBottom: 24,
            boxShadow: "0 4px 20px rgba(16,24,40,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                flexWrap: "wrap",
              }}
            >
              <div style={{ position: "relative" }}>
                <Avatar
                  size={100}
                  src={profileImage || undefined}
                  icon={!profileImage ? <UserOutlined /> : undefined}
                  style={{
                    background: "#dbeafe",
                    color: "#1d4ed8",
                    border: "3px solid #fff",
                    boxShadow: "0 0 0 2px #dbeafe",
                  }}
                />

                <Button
                  type="primary"
                  shape="circle"
                  icon={<CameraOutlined />}
                  size="small"
                  loading={profileSaving}
                  onClick={handleManageProfileImage}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                  }}
                />

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleChooseProfileImage}
                  style={{ display: "none" }}
                />
              </div>

              <div>
                <h2
                  style={{
                    margin: "0 0 8px",
                    fontSize: 24,
                    fontWeight: 700,
                    color: "#101828",
                  }}
                >
                  {displayName}
                </h2>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    marginBottom: 10,
                  }}
                >
                  <Tag color="blue" icon={<ToolOutlined />}>
                    {displayProfession}
                  </Tag>

                  <Tag color="green" icon={<SafetyCertificateOutlined />}>
                    Usta profili
                  </Tag>
                </div>

                <div style={{ color: "#667085" }}>
                  <PhoneOutlined style={{ marginRight: 8 }} />
                  {displayPhone}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <Button
                icon={<EditOutlined />}
                onClick={() => {
                  profileForm.setFieldsValue({
                    name: user.name || "",
                    phone: user.phone || "",
                    profession: user.profession || "",
                  });
                  setProfileModalOpen(true);
                }}
              >
                Profilni tahrirlash
              </Button>

              <Button
                icon={<LockOutlined />}
                onClick={() => setPasswordModalOpen(true)}
              >
                Parolni o'zgartirish
              </Button>
            </div>
          </div>
        </Card>

        <WorkSamples />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
            margin: "28px 0 20px",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 28,
                fontWeight: 700,
                color: "#101828",
              }}
            >
              Mening e'lonlarim
            </h1>

            <p style={{ margin: "8px 0 0", color: "#667085" }}>
              E'lonlaringizni boshqaring va yangilarini joylashtiring.
            </p>
          </div>

          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            E'lon yaratish
          </Button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginBottom: 28,
          }}
        >
          <Card
            bordered={false}
            style={{
              borderRadius: 14,
              boxShadow: "0 4px 20px rgba(16,24,40,0.04)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: "#dbeafe",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#2563eb",
                  fontSize: 22,
                }}
              >
                <FileTextOutlined />
              </div>

              <div>
                <div style={{ color: "#667085", marginBottom: 4 }}>
                  Jami e'lonlar
                </div>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 700,
                    color: "#101828",
                  }}
                >
                  {vacancies.length}
                </div>
              </div>
            </div>
          </Card>

          <Card
            bordered={false}
            style={{
              borderRadius: 14,
              boxShadow: "0 4px 20px rgba(16,24,40,0.04)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: "#dcfce7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#16a34a",
                  fontSize: 22,
                }}
              >
                <SettingOutlined />
              </div>

              <div>
                <div style={{ color: "#667085", marginBottom: 4 }}>
                  Profil holati
                </div>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#16a34a",
                  }}
                >
                  Faol
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Divider />

        <div style={{ marginTop: 24 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              marginBottom: 20,
              flexWrap: "wrap",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 700,
                color: "#101828",
              }}
            >
              Joylashtirilgan e'lonlar
            </h2>

            <Tag color="blue">{vacancies.length} ta e'lon</Tag>
          </div>

          {vacanciesLoading ? (
            <div style={{ textAlign: "center", padding: 50 }}>
              <Spin size="large" />
            </div>
          ) : vacancies.length === 0 ? (
            <Card
              bordered={false}
              style={{
                borderRadius: 16,
                padding: "30px 0",
              }}
            >
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Hozircha e'lonlaringiz yo'q"
              >
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleCreate}
                >
                  Birinchi e'lonni yaratish
                </Button>
              </Empty>
            </Card>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 20,
              }}
            >
              {vacancies.map((vacancy) => {
                const vacancyId = vacancy._id || vacancy.id;

                return (
                  <Card
                    key={vacancyId}
                    bordered={false}
                    style={{
                      borderRadius: 16,
                      boxShadow: "0 4px 20px rgba(16,24,40,0.05)",
                      height: "100%",
                    }}
                    styles={{
                      body: {
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                      },
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 12,
                        marginBottom: 12,
                      }}
                    >
                      <h3
                        style={{
                          fontSize: 18,
                          fontWeight: 700,
                          color: "#101828",
                          margin: 0,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {vacancy.title || "Nomsiz e'lon"}
                      </h3>

                      <Tag color="blue">
                        {vacancy.category || "Xizmat"}
                      </Tag>
                    </div>

                    {vacancy.location && (
                      <div
                        style={{
                          color: "#667085",
                          marginBottom: 10,
                          display: "flex",
                          gap: 8,
                        }}
                      >
                        <EnvironmentOutlined />
                        <span>{vacancy.location}</span>
                      </div>
                    )}

                    {vacancy.price !== undefined &&
                      vacancy.price !== null &&
                      vacancy.price !== "" && (
                        <div
                          style={{
                            fontSize: 18,
                            fontWeight: 700,
                            color: "#2563eb",
                            marginBottom: 12,
                          }}
                        >
                          {typeof vacancy.price === "number"
                            ? vacancy.price.toLocaleString("uz-UZ")
                            : vacancy.price}{" "}
                          so'm
                        </div>
                      )}

                    <p
                      style={{
                        color: "#667085",
                        lineHeight: 1.6,
                        marginBottom: 16,
                        whiteSpace: "pre-wrap",
                        overflowWrap: "anywhere",
                        flex: 1,
                      }}
                    >
                      {vacancy.description || "Tavsif kiritilmagan."}
                    </p>

                    {vacancy.contactPhone && (
                      <div style={{ color: "#475467", marginBottom: 8 }}>
                        <PhoneOutlined style={{ marginRight: 8 }} />
                        {vacancy.contactPhone}
                      </div>
                    )}

                    {vacancy.telegram && (
                      <div style={{ color: "#475467", marginBottom: 12 }}>
                        <SendOutlined style={{ marginRight: 8 }} />
                        {vacancy.telegram}
                      </div>
                    )}

                    <Divider style={{ margin: "12px 0" }} />

                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      <Button
                        icon={<EyeOutlined />}
                        onClick={() => handleDetail(vacancy)}
                      >
                        Ko'rish
                      </Button>

                      <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(vacancy)}
                      >
                        Tahrirlash
                      </Button>

                      <Popconfirm
                        title="E'lonni o'chirish"
                        description="Ushbu e'lonni o'chirmoqchimisiz?"
                        okText="Ha, o'chirish"
                        cancelText="Bekor qilish"
                        okButtonProps={{ danger: true }}
                        onConfirm={() => handleDelete(vacancyId)}
                      >
                        <Button danger icon={<DeleteOutlined />}>
                          O'chirish
                        </Button>
                      </Popconfirm>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Modal
        title="Profil ma'lumotlarini tahrirlash"
        open={profileModalOpen}
        onCancel={() => setProfileModalOpen(false)}
        footer={null}
        destroyOnHidden={false}
      >
        <Form
          form={profileForm}
          layout="vertical"
          onFinish={handleUpdateProfile}
          autoComplete="off"
        >
          <Form.Item
            label="Ism"
            name="name"
            rules={[
              { required: true, message: "Ismingizni kiriting." },
              {
                min: 2,
                message: "Ism kamida 2 ta belgidan iborat bo'lsin.",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Ism va familiyangiz"
              maxLength={100}
            />
          </Form.Item>

          <Form.Item
            label="Telefon raqami"
            name="phone"
            rules={[
              {
                required: true,
                message: "Telefon raqamingizni kiriting.",
              },
            ]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="+998901234567"
              maxLength={20}
            />
          </Form.Item>

          <Form.Item
            label="Kasbingiz"
            name="profession"
            rules={[
              { required: true, message: "Kasbingizni kiriting." },
            ]}
          >
            <Input
              prefix={<ToolOutlined />}
              placeholder="Masalan: Elektrik, santexnik"
              maxLength={100}
            />
          </Form.Item>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
            }}
          >
            <Button onClick={() => setProfileModalOpen(false)}>
              Bekor qilish
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              loading={profileSaving}
              icon={<EditOutlined />}
            >
              Saqlash
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        title="Parolni o'zgartirish"
        open={passwordModalOpen}
        onCancel={() => {
          setPasswordModalOpen(false);
          passwordForm.resetFields();
        }}
        footer={null}
        destroyOnHidden={false}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleChangePassword}
          autoComplete="off"
        >
          <Form.Item
            label="Joriy parol"
            name="currentPassword"
            rules={[
              {
                required: true,
                message: "Joriy parolingizni kiriting.",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Joriy parol"
            />
          </Form.Item>

          <Form.Item
            label="Yangi parol"
            name="newPassword"
            rules={[
              { required: true, message: "Yangi parolni kiriting." },
              {
                min: 6,
                message: "Parol kamida 6 ta belgidan iborat bo'lsin.",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Yangi parol"
            />
          </Form.Item>

          <Form.Item
            label="Yangi parolni tasdiqlang"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              {
                required: true,
                message: "Yangi parolni qayta kiriting.",
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
                    new Error("Parollar bir-biriga mos kelmadi.")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Yangi parolni qayta kiriting"
            />
          </Form.Item>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
            }}
          >
            <Button
              onClick={() => {
                setPasswordModalOpen(false);
                passwordForm.resetFields();
              }}
            >
              Bekor qilish
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              loading={passwordSaving}
              icon={<LockOutlined />}
            >
              Parolni saqlash
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default Dashboard;
