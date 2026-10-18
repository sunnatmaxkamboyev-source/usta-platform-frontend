
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
  ClockCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const API = "https://usta-platform-backend.onrender.com/api";

function getUstaId(usta) {
  if (typeof usta === "string") return usta;
  return usta?._id || usta?.id || "";
}

function getSampleImages(sample) {
  if (!Array.isArray(sample?.images)) return [];

  return sample.images.filter(
    (image) =>
      typeof image === "string" && image.trim().length > 0
  );
}

export default function VacancyDetail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [vacancy, setVacancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [workSamples, setWorkSamples] = useState([]);
  const [samplesLoading, setSamplesLoading] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);

  // VAKANSIYANI OLISH
  useEffect(() => {
    const controller = new AbortController();

    async function fetchVacancy() {
      setLoading(true);
      setNotFound(false);
      setVacancy(null);
      setWorkSamples([]);

      try {
        const response = await fetch(`${API}/vacancies/${id}`, {
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok || !data?.vacancy) {
          setNotFound(true);
          return;
        }

        setVacancy(data.vacancy);
      } catch (error) {
        if (error.name === "AbortError") return;

        console.error("Get vacancy detail error:", error);
        message.error(t("common.errorFetchVacancy"));
        setNotFound(true);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    if (id) {
      fetchVacancy();
    } else {
      setLoading(false);
      setNotFound(true);
    }

    return () => controller.abort();
  }, [id, t]);

  // USTANING ISH NAMUNALARINI OLISH
  useEffect(() => {
    const controller = new AbortController();
    const ustaId = getUstaId(vacancy?.usta);

    async function fetchWorkSamples() {
      if (!ustaId) {
        setWorkSamples([]);
        setSamplesLoading(false);
        return;
      }

      setSamplesLoading(true);
      setWorkSamples([]);

      try {
        const response = await fetch(
          `${API}/work-samples/usta/${encodeURIComponent(ustaId)}`,
          { signal: controller.signal }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              `Ish namunalarini olishda xatolik: ${response.status}`
          );
        }

        const samples = Array.isArray(data)
          ? data
          : Array.isArray(data?.samples)
            ? data.samples
            : Array.isArray(data?.workSamples)
              ? data.workSamples
              : [];

        setWorkSamples(samples);
      } catch (error) {
        if (error.name === "AbortError") return;

        console.error("Get work samples error:", error);
        setWorkSamples([]);
      } finally {
        if (!controller.signal.aborted) {
          setSamplesLoading(false);
        }
      }
    }

    if (vacancy) {
      fetchWorkSamples();
    } else {
      setWorkSamples([]);
      setSamplesLoading(false);
    }

    return () => controller.abort();
  }, [vacancy]);

  // LOADING
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

  // VAKANSIYA TOPILMADI
  if (notFound || !vacancy) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <Card className="!overflow-hidden !rounded-3xl !border-slate-200 !shadow-sm">
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
                className="!mt-6 !rounded-xl !bg-blue-600"
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

  // BOG'LANISH
  const handleCall = () => {
    if (!vacancy.contactPhone) {
      message.warning(t("vacancies.noPhone"));
      return;
    }

    window.location.href = `tel:${vacancy.contactPhone}`;
  };

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

  // USTA VA KATEGORIYA
  const translatedCategory = t(
    `vacancies.categories.${vacancy.category}`,
    { defaultValue: vacancy.category }
  );

  const ustaName =
    typeof vacancy.usta === "object" && vacancy.usta
      ? vacancy.usta.name || t("common.master")
      : t("common.master");

  const ustaProfession =
    (typeof vacancy.usta === "object" &&
      vacancy.usta?.profession) ||
    translatedCategory;

  const ustaProfileImage =
    typeof vacancy.usta === "object"
      ? vacancy.usta?.profileImage || ""
      : "";

  // SAHIFA
  return (
    <div className="min-h-screen bg-[#F4F7FC] text-[#15233B]">
      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#101D35] text-white shadow-lg shadow-slate-900/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-3 text-left"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
              <ToolOutlined className="text-lg" />
            </span>

            <span>
              <span className="block font-bold tracking-tight">
                Usta Platform
              </span>
              <span className="block text-xs text-slate-400">
                {t("vacancies.detailsTitle")}
              </span>
            </span>
          </button>

          <Button
            ghost
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/vakansiyalar")}
            className="!rounded-xl !border-slate-600 !text-slate-200 hover:!border-blue-400 hover:!text-white"
          >
            <span className="hidden sm:inline">
              {t("vacancies.backToVacancies")}
            </span>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        {/* ORQAGA QAYTISH */}
        <button
          type="button"
          onClick={() => navigate("/vakansiyalar")}
          className="mb-5 inline-flex items-center gap-2 rounded-lg py-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeftOutlined />
          {t("vacancies.backToVacancies")}
        </button>

        {/* KENG USTA PROFILI */}
        <section className="relative mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="h-2 bg-gradient-to-r from-blue-800 via-blue-500 to-cyan-400" />

          <div className="relative p-5 sm:p-7 lg:p-9">
            <div className="absolute right-0 top-0 -z-0 h-56 w-56 rounded-full bg-blue-50/80 blur-3xl" />

            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
                <div className="relative w-fit shrink-0">
                  <Avatar
                    size={104}
                    src={ustaProfileImage || undefined}
                    icon={<UserOutlined />}
                    className="!border-4 !border-white !bg-blue-50 !text-4xl !text-blue-600 !shadow-lg sm:!h-32 sm:!w-32"
                  />

                  <span className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full border-4 border-white bg-emerald-500 text-white">
                    <SafetyCertificateOutlined className="text-xs" />
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Tag color="blue" className="!m-0 !rounded-full !px-3 !py-1">
                      <ToolOutlined className="mr-1" />
                      {ustaProfession}
                    </Tag>

                    <Tag className="!m-0 !rounded-full !border-emerald-100 !bg-emerald-50 !px-3 !py-1 !text-emerald-700">
                      <SafetyCertificateOutlined className="mr-1" />
                      {translatedCategory}
                    </Tag>
                  </div>

                  <h1 className="break-words text-2xl font-extrabold tracking-tight text-[#15233B] sm:text-3xl lg:text-4xl">
                    {ustaName}
                  </h1>

                  <p className="mt-2 text-sm text-slate-500 sm:text-base">
                    {t("vacancies.postedBy")}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-slate-600">
                    <span className="inline-flex items-start gap-2">
                      <EnvironmentOutlined className="mt-0.5 text-blue-600" />
                      <span className="break-words">
                        {vacancy.location}
                      </span>
                    </span>

                    <span className="inline-flex items-center gap-2">
                      <AppstoreOutlined className="text-blue-600" />
                      {translatedCategory}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:min-w-[230px] lg:flex-col">
                <Button
                  type="primary"
                  size="large"
                  icon={<PhoneOutlined />}
                  onClick={handleCall}
                  className="!h-12 !rounded-xl !bg-blue-600 !font-semibold shadow-lg shadow-blue-600/15 hover:!bg-blue-700"
                >
                  {t("vacancies.callButton")}
                </Button>

                <Button
                  size="large"
                  icon={<SendOutlined />}
                  onClick={handleTelegram}
                  className="!h-12 !rounded-xl !border-slate-200 !font-semibold hover:!border-blue-300 hover:!text-blue-600"
                >
                  {t("vacancies.telegramButton")}
                </Button>
              </div>
            </div>

            {/* XIZMAT HAQIDA QISQA MA'LUMOT */}
            <div className="relative z-10 mt-7 grid grid-cols-1 gap-3 border-t border-slate-100 pt-6 sm:grid-cols-3">
              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <AppstoreOutlined />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-400">
                    {t("vacancies.serviceType")}
                  </p>
                  <p className="mt-1 break-words text-sm font-bold text-[#15233B]">
                    {translatedCategory}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <DollarOutlined />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-400">
                    {t("vacancies.price")}
                  </p>
                  <p className="mt-1 break-words text-sm font-bold text-[#15233B]">
                    {vacancy.price || t("common.negotiable")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                  <PhoneOutlined />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-400">
                    {t("vacancies.phone")}
                  </p>
                  <p className="mt-1 break-words text-sm font-bold text-[#15233B]">
                    {vacancy.contactPhone || "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ASOSIY SAHIFA VA ALOQA PANELI */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-6">
            {/* XIZMAT TAVSIFI */}
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="p-5 sm:p-7 lg:p-8">
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <ToolOutlined className="text-lg" />
                  </span>

                  <div>
                    <h2 className="text-lg font-extrabold text-[#15233B] sm:text-xl">
                      {vacancy.title}
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">
                      {t("vacancies.fullDescription")}
                    </p>
                  </div>
                </div>

                <div className="mb-5 flex flex-wrap gap-2">
                  <Tag color="blue" className="!rounded-full !px-3 !py-1">
                    <AppstoreOutlined className="mr-1" />
                    {translatedCategory}
                  </Tag>

                  <Tag className="!rounded-full !border-slate-200 !px-3 !py-1">
                    <EnvironmentOutlined className="mr-1" />
                    {vacancy.location}
                  </Tag>
                </div>

                <Divider className="!my-5" />

                <p className="break-words whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                  {vacancy.description}
                </p>
              </div>
            </section>

            {/* KATTA ISH NAMUNALARI GALEREYASI */}
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-5 sm:p-7">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-xl text-blue-600">
                      <PictureOutlined />
                    </span>

                    <div>
                      <h2 className="text-lg font-extrabold text-[#15233B] sm:text-xl">
                        Ish namunalari
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Ustaning avval bajargan ishlari
                      </p>
                    </div>
                  </div>

                  {!samplesLoading && workSamples.length > 0 && (
                    <span className="w-fit rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                      {workSamples.length} ta ish
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 sm:p-7">
                {samplesLoading ? (
                  <div className="flex flex-col items-center justify-center py-14">
                    <Spin size="large" />
                    <p className="mt-4 text-sm text-slate-500">
                      Ish namunalari yuklanmoqda...
                    </p>
                  </div>
                ) : workSamples.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-12 text-center">
                    <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl text-slate-400 shadow-sm">
                      <PictureOutlined />
                    </span>

                    <h3 className="mt-4 font-bold text-[#15233B]">
                      Hozircha ish namunalari yo‘q
                    </h3>

                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                      Usta yangi ish namunalarini qo‘shganida ular shu yerda ko‘rinadi.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-7">
                    {workSamples.map((sample, sampleIndex) => {
                      const images = getSampleImages(sample);

                      return (
                        <article
                          key={sample._id || sample.id || sampleIndex}
                          className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:border-blue-200 hover:shadow-md"
                        >
                          <div className="p-4 sm:p-5">
                            <div className="flex items-start gap-3">
                              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <PictureOutlined />
                              </span>

                              <div className="min-w-0 flex-1">
                                <h3 className="break-words text-base font-extrabold text-[#15233B] sm:text-lg">
                                  {sample.title || `Ish namunasi ${sampleIndex + 1}`}
                                </h3>

                                {sample.description && (
                                  <p className="mt-2 whitespace-pre-line break-words text-sm leading-7 text-slate-600">
                                    {sample.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          {images.length > 0 ? (
                            <div className="grid grid-cols-1 gap-3 px-4 pb-4 sm:grid-cols-2 sm:px-5 sm:pb-5 lg:grid-cols-2">
                              {images.map((image, index) => (
                                <button
                                  key={`${sample._id || sample.id || sampleIndex}-${index}`}
                                  type="button"
                                  onClick={() =>
                                    setSelectedImage({
                                      src: image,
                                      title: sample.title || "Ish namunasi",
                                      index,
                                    })
                                  }
                                  className="group relative block w-full overflow-hidden rounded-xl bg-slate-100 text-left focus:outline-none focus:ring-4 focus:ring-blue-100"
                                  aria-label={`Ish namunasining ${index + 1}-rasmini kattalashtirish`}
                                >
                                  <img
                                    src={image}
                                    alt={`${sample.title || "Ish namunasi"} — ${index + 1}`}
                                    loading="lazy"
                                    className="h-64 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-72"
                                    onError={(event) => {
                                      event.currentTarget.style.display = "none";
                                    }}
                                  />

                                  <span className="absolute inset-0 flex items-center justify-center bg-[#101D35]/0 text-white transition duration-300 group-hover:bg-[#101D35]/35">
                                    <span className="flex h-11 w-11 scale-90 items-center justify-center rounded-full bg-white/90 text-lg text-blue-700 opacity-0 shadow-lg transition duration-300 group-hover:scale-100 group-hover:opacity-100">
                                      <EyeOutlined />
                                    </span>
                                  </span>

                                  <span className="absolute bottom-3 left-3 rounded-lg bg-[#101D35]/75 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                                    {index + 1} / {images.length}
                                  </span>
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="mx-4 mb-4 rounded-xl bg-slate-50 px-4 py-5 text-sm text-slate-500 sm:mx-5 sm:mb-5">
                              Bu namunada rasm mavjud emas.
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* ALOQA PANELI */}
          <aside className="flex flex-col gap-5 lg:sticky lg:top-24">
            <Card
              className="!overflow-hidden !rounded-3xl !border-slate-200 !shadow-sm"
              styles={{ body: { padding: 0 } }}
            >
              <div className="bg-[#101D35] p-5 text-white sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-300">
                  Usta bilan aloqa
                </p>

                <h2 className="mt-2 text-xl font-extrabold">
                  Bog‘lanishga tayyormisiz?
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Xizmat haqida batafsil bilish uchun ustaga murojaat qiling.
                </p>
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <Avatar
                    size={58}
                    src={ustaProfileImage || undefined}
                    icon={<UserOutlined />}
                    className="!bg-blue-50 !text-blue-600"
                  />

                  <div className="min-w-0">
                    <p className="break-words font-extrabold text-[#15233B]">
                      {ustaName}
                    </p>

                    <p className="mt-1 break-words text-sm text-slate-500">
                      {ustaProfession}
                    </p>
                  </div>
                </div>

                <Divider className="!my-5" />

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <PhoneOutlined />
                    </span>

                    <div className="min-w-0">
                      <p className="text-xs text-slate-400">
                        {t("vacancies.phone")}
                      </p>
                      <p className="mt-1 break-words text-sm font-bold text-[#15233B]">
                        {vacancy.contactPhone || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                      <EnvironmentOutlined />
                    </span>

                    <div className="min-w-0">
                      <p className="text-xs text-slate-400">
                        {t("vacancies.address")}
                      </p>
                      <p className="mt-1 break-words text-sm font-semibold text-[#15233B]">
                        {vacancy.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <DollarOutlined />
                    </span>

                    <div className="min-w-0">
                      <p className="text-xs text-slate-400">
                        {t("vacancies.price")}
                      </p>
                      <p className="mt-1 break-words text-sm font-bold text-[#15233B]">
                        {vacancy.price || t("common.negotiable")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <Button
                    type="primary"
                    size="large"
                    block
                    icon={<PhoneOutlined />}
                    onClick={handleCall}
                    className="!h-12 !rounded-xl !bg-blue-600 !font-semibold shadow-lg shadow-blue-600/15 hover:!bg-blue-700"
                  >
                    {t("vacancies.callButton")}
                  </Button>

                  <Button
                    size="large"
                    block
                    icon={<SendOutlined />}
                    onClick={handleTelegram}
                    className="!h-12 !rounded-xl !border-slate-200 !font-semibold hover:!border-blue-300 hover:!text-blue-600"
                  >
                    {t("vacancies.telegramButton")}
                  </Button>
                </div>

                <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                  Usta bilan bog‘lanishdan oldin xizmat tafsilotlarini kelishib oling.
                </p>
              </div>
            </Card>

            <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                  <SafetyCertificateOutlined />
                </span>

                <div>
                  <h3 className="text-sm font-bold text-[#15233B]">
                    Xizmat ma’lumotlari
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Narx, bajarish muddati va ish tafsilotlarini usta bilan oldindan kelishib oling.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* RASMNI KATTA KO'RISH */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#071225]/95 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Ish namunasi rasmi"
          onClick={() => setSelectedImage(null)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setSelectedImage(null);
          }}
          tabIndex={-1}
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-2xl text-white transition hover:bg-white/20"
            aria-label="Rasmni yopish"
          >
            ×
          </button>

          <div
            className="flex max-h-full w-full max-w-6xl flex-col items-center gap-4"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={selectedImage.src}
              alt={selectedImage.title}
              className="max-h-[78vh] max-w-full rounded-2xl object-contain shadow-2xl"
            />

            <p className="text-center text-sm font-semibold text-white">
              {selectedImage.title}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
