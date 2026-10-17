import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  Button,
  Tag,
  Avatar,
  Divider,
  message,
  Spin,
} from "antd";
import {
  ArrowLeftOutlined,
  UserOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  SendOutlined,
  DollarOutlined,
  AppstoreOutlined,
  ToolOutlined,
  SafetyCertificateOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const API = "https://usta-platform-backend.onrender.com/api";

export default function VacancyDetail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [vacancy, setVacancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [workSamples, setWorkSamples] = useState([]);
  const [samplesLoading, setSamplesLoading] = useState(false);

  // ========================================
  // VAKANSIYANI BACKENDDAN OLISH
  // ========================================

  useEffect(() => {
    const fetchVacancy = async () => {
      try {
        setLoading(true);
        setNotFound(false);
        setVacancy(null);
        setWorkSamples([]);

        const response = await fetch(`${API}/vacancies/${id}`);
        const data = await response.json();

        if (!response.ok || !data.vacancy) {
          setNotFound(true);
          return;
        }

        setVacancy(data.vacancy);
      } catch (error) {
        console.error("Get vacancy detail error:", error);
        message.error(t("common.errorFetchVacancy"));
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVacancy();
    } else {
      setLoading(false);
      setNotFound(true);
    }
  }, [id, t]);

  // ========================================
  // USTANING ISH NAMUNALARINI OLISH
  // ========================================

  useEffect(() => {
    const fetchWorkSamples = async () => {
      const ustaId = vacancy?.usta?._id;

      if (!ustaId) {
        setWorkSamples([]);
        return;
      }

      try {
        setSamplesLoading(true);

        const response = await fetch(
          `${API}/work-samples/usta/${ustaId}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Ish namunalarini olishda xatolik"
          );
        }

        // API arrayni turli shakllarda qaytarsa ham tekshiramiz
        const samples = Array.isArray(data)
          ? data
          : data.workSamples || data.samples || [];

        setWorkSamples(samples);
      } catch (error) {
        console.error("Get work samples error:", error);
        setWorkSamples([]);
      } finally {
        setSamplesLoading(false);
      }
    };

    if (vacancy) {
      fetchWorkSamples();
    }
  }, [vacancy]);

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-sm text-slate-500">
            {t("common.loadingVacancy")}
          </p>
        </div>
      </div>
    );
  }

  // ========================================
  // VAKANSIYA TOPILMADI
  // ========================================

  if (notFound || !vacancy) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <Card className="!overflow-hidden !rounded-2xl !border-slate-200 !shadow-sm">
            <div className="py-10 text-center sm:py-14">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600">
                <ToolOutlined />
              </div>

              <h1 className="text-2xl font-extrabold text-[#15233B]">
                {t("vacancies.notFoundTitle")}
              </h1>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                {t("vacancies.notFoundDescription")}
              </p>

              <Button
                type="primary"
                size="large"
                icon={<ArrowLeftOutlined />}
                className="!mt-6 !rounded-lg !bg-blue-600"
                onClick={() => navigate("/vakansiyalar")}
              >
                {t("vacancies.backToVacancies")}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // ========================================
  // TELEFON ORQALI BOG'LANISH
  // ========================================

  const handleCall = () => {
    if (!vacancy.contactPhone) {
      message.warning(t("vacancies.noPhone"));
      return;
    }

    window.location.href = `tel:${vacancy.contactPhone}`;
  };

  // ========================================
  // TELEGRAM ORQALI BOG'LANISH
  // ========================================

  const handleTelegram = () => {
    if (!vacancy.telegram) {
      message.warning(t("vacancies.noTelegram"));
      return;
    }

    const username = vacancy.telegram
      .trim()
      .replace(/^@/, "")
      .replace(/^https?:\/\/t\.me\//i, "")
      .replace(/\/+$/, "");

    if (!username) {
      message.warning(t("vacancies.noTelegram"));
      return;
    }

    window.open(
      `https://t.me/${encodeURIComponent(username)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ========================================
  // KATEGORIYA TARJIMASI
  // ========================================

  const translatedCategory = t(
    `vacancies.categories.${vacancy.category}`,
    {
      defaultValue: vacancy.category,
    }
  );

  // ========================================
  // USTA MA'LUMOTLARI
  // ========================================

  const ustaName = vacancy.usta?.name || t("common.master");

  const ustaProfession =
    vacancy.usta?.profession || translatedCategory;

  const ustaProfileImage = vacancy.usta?.profileImage || "";

  // ========================================
  // ISH NAMUNASI RASMLARI
  // ========================================

  const getSampleImages = (sample) => {
    if (!Array.isArray(sample.images)) {
      return [];
    }

    return sample.images.filter(
      (image) => typeof image === "string" && image.trim() !== ""
    );
  };

  // ========================================
  // ASOSIY SAHIFA
  // ========================================

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="bg-[#101D35] text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-3 text-left"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
              <ToolOutlined className="text-lg" />
            </span>

            <span>
              <span className="block font-bold">Usta Platform</span>
              <span className="block text-xs text-slate-400">
                {t("vacancies.detailsTitle")}
              </span>
            </span>
          </button>

          <Button
            ghost
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/vakansiyalar")}
            className="!border-slate-600 !text-slate-200"
          >
            <span className="hidden sm:inline">
              {t("vacancies.backToVacancies")}
            </span>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-9">
        {/* BACK BUTTON */}
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/vakansiyalar")}
          className="!mb-5 !text-slate-600 hover:!text-blue-600"
        >
          {t("vacancies.backToVacancies")}
        </Button>

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[1fr_320px]">
          {/* MAIN INFORMATION */}
          <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="h-1.5 bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400" />

            <div className="p-5 sm:p-8">
              {/* TITLE */}
              <Tag color="blue" className="!mb-4 !rounded-md !px-2 !py-1">
                <AppstoreOutlined className="mr-1" />
                {translatedCategory}
              </Tag>

              <h1 className="break-words text-2xl font-extrabold leading-tight tracking-tight text-[#15233B] sm:text-3xl">
                {vacancy.title}
              </h1>

              <div className="mt-4 flex items-start gap-2 text-sm text-slate-500">
                <EnvironmentOutlined className="mt-1 text-blue-600" />
                <span className="break-words">{vacancy.location}</span>
              </div>

              <Divider className="!my-6" />

              {/* VACANCY DETAILS */}
              <h2 className="mb-5 text-lg font-bold text-[#15233B]">
                {t("vacancies.detailsTitle")}
              </h2>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <AppstoreOutlined />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm text-slate-400">
                      {t("vacancies.serviceType")}
                    </p>
                    <p className="mt-1 break-words font-semibold text-[#15233B]">
                      {translatedCategory}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <EnvironmentOutlined />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm text-slate-400">
                      {t("vacancies.address")}
                    </p>
                    <p className="mt-1 break-words font-semibold text-[#15233B]">
                      {vacancy.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <DollarOutlined />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm text-slate-400">
                      {t("vacancies.price")}
                    </p>
                    <p className="mt-1 break-words font-semibold text-[#15233B]">
                      {vacancy.price || t("common.negotiable")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <PhoneOutlined />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm text-slate-400">
                      {t("vacancies.phone")}
                    </p>
                    <p className="mt-1 break-words font-semibold text-[#15233B]">
                      {vacancy.contactPhone || "—"}
                    </p>
                  </div>
                </div>
              </div>

              <Divider className="!my-7" />

              {/* DESCRIPTION */}
              <h2 className="mb-4 text-lg font-bold text-[#15233B]">
                {t("vacancies.fullDescription")}
              </h2>

              <p className="break-words whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-base">
                {vacancy.description}
              </p>

              {/* ================================== */}
              {/* USTANING ISH NAMUNALARI */}
              {/* ================================== */}

              <Divider className="!my-7" />

              <div className="mb-5">
                <h2 className="flex items-center gap-2 text-lg font-bold text-[#15233B]">
                  <PictureOutlined className="text-blue-600" />
                  Ish namunalari
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Ustaning avval bajargan ishlari va ularning rasmlari.
                </p>
              </div>

              {samplesLoading ? (
                <div className="flex justify-center py-8">
                  <Spin />
                </div>
              ) : workSamples.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
                  <PictureOutlined className="text-2xl text-slate-400" />
                  <p className="mt-3 text-sm text-slate-500">
                    Hozircha ish namunalari qo‘shilmagan.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {workSamples.map((sample) => {
                    const images = getSampleImages(sample);

                    return (
                      <div
                        key={sample._id}
                        className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                      >
                        <div className="p-4">
                          <h3 className="break-words font-bold text-[#15233B]">
                            {sample.title}
                          </h3>

                          {sample.description && (
                            <p className="mt-2 whitespace-pre-line break-words text-sm leading-6 text-slate-600">
                              {sample.description}
                            </p>
                          )}
                        </div>

                        {images.length > 0 ? (
                          <div className="grid grid-cols-1 gap-2 px-4 pb-4 sm:grid-cols-2">
                            {images.map((image, index) => (
                              <a
                                key={`${sample._id}-${index}`}
                                href={image}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block overflow-hidden rounded-lg bg-slate-100"
                                aria-label={`Ish namunasi rasmi ${index + 1}`}
                              >
                                <img
                                  src={image}
                                  alt={`${sample.title} — ${index + 1}`}
                                  loading="lazy"
                                  className="h-48 w-full object-cover transition duration-300 hover:scale-[1.02]"
                                  onError={(event) => {
                                    event.currentTarget.style.display = "none";
                                  }}
                                />
                              </a>
                            ))}
                          </div>
                        ) : (
                          <div className="mx-4 mb-4 rounded-lg bg-slate-50 px-3 py-4 text-sm text-slate-500">
                            Bu namunada rasm mavjud emas.
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* MASTER / CONTACT SIDEBAR */}
          <aside className="flex flex-col gap-5">
            {/* MASTER CARD */}
            <Card
              className="!rounded-2xl !border-slate-200 !shadow-sm"
              styles={{ body: { padding: 22 } }}
            >
              <h2 className="mb-5 text-base font-bold text-[#15233B]">
                {t("vacancies.postedBy")}
              </h2>

              <div className="flex items-center gap-3">
                <Avatar
                  size={54}
                  src={ustaProfileImage || undefined}
                  icon={<UserOutlined />}
                  className="!bg-blue-50 !text-blue-600"
                />

                <div className="min-w-0">
                  <p className="break-words font-bold text-[#15233B]">
                    {ustaName}
                  </p>

                  <p className="mt-1 break-words text-sm text-slate-500">
                    {ustaProfession}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-slate-50 p-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <SafetyCertificateOutlined className="text-blue-600" />
                  <span>{translatedCategory}</span>
                </div>
              </div>
            </Card>

            {/* CONTACT CARD */}
            <Card
              className="!rounded-2xl !border-slate-200 !shadow-sm"
              styles={{ body: { padding: 22 } }}
            >
              <h2 className="text-base font-bold text-[#15233B]">
                {t("vacancies.contactMaster")}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {t("vacancies.phone")}: {vacancy.contactPhone || "—"}
              </p>

              <div className="mt-5 flex flex-col gap-3">
                <Button
                  type="primary"
                  size="large"
                  block
                  icon={<PhoneOutlined />}
                  onClick={handleCall}
                  className="!h-11 !rounded-lg !bg-blue-600 !font-semibold"
                >
                  {t("vacancies.callButton")}
                </Button>

                <Button
                  size="large"
                  block
                  icon={<SendOutlined />}
                  onClick={handleTelegram}
                  className="!h-11 !rounded-lg !font-semibold"
                >
                  {t("vacancies.telegramButton")}
                </Button>
              </div>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}
