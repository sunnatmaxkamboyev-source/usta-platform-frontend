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
} from "@ant-design/icons";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function VacancyDetail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [vacancy, setVacancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // =========================
  // BACKENDDAN VAKANSIYA OLISH
  // =========================
  useEffect(() => {
    const fetchVacancy = async () => {
      try {
        setLoading(true);
        setNotFound(false);

        const response = await fetch(
          `https://usta-platform-backend.onrender.com/api/vacancies/${id}`
        );

        const data = await response.json();

        console.log(
          "Vacancy detail response:",
          data
        );

        if (!response.ok) {
          setNotFound(true);
          return;
        }

        setVacancy(data.vacancy);
      } catch (error) {
        console.error(
          "Get vacancy detail error:",
          error
        );

        message.error(
          t("common.errorFetchVacancy")
        );

        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVacancy();
    }
  }, [id, t]);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Spin size="large" />

          <p className="text-gray-500 mt-4">
            {t("common.loadingVacancy")}
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // VAKANSIYA TOPILMADI
  // =========================
  if (notFound || !vacancy) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <Card>
            <div className="text-center py-10">
              <h1 className="text-2xl font-bold text-gray-800">
                {t("vacancies.notFoundTitle")}
              </h1>

              <p className="text-gray-500 mt-2">
                {t(
                  "vacancies.notFoundDescription"
                )}
              </p>

              <Button
                type="primary"
                className="mt-6"
                onClick={() =>
                  navigate("/vakansiyalar")
                }
              >
                {t("vacancies.backToVacancies")}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // =========================
  // TELEFON
  // =========================
  const handleCall = () => {
    if (!vacancy.contactPhone) {
      message.warning(
        t("vacancies.noPhone")
      );
      return;
    }

    window.location.href =
      `tel:${vacancy.contactPhone}`;
  };

  // =========================
  // TELEGRAM
  // =========================
  const handleTelegram = () => {
    if (!vacancy.telegram) {
      message.warning(
        t("vacancies.noTelegram")
      );
      return;
    }

    const username =
      vacancy.telegram.replace("@", "");

    window.open(
      `https://t.me/${username}`,
      "_blank"
    );
  };

  // =========================
  // CATEGORY TARJIMASI
  // =========================
  const translatedCategory = t(
    `vacancies.categories.${vacancy.category}`,
    {
      defaultValue: vacancy.category,
    }
  );

  // =========================
  // USTA MA'LUMOTI
  // =========================
  const ustaName =
    vacancy.usta?.name ||
    t("common.master");

  const ustaProfession =
    vacancy.usta?.profession ||
    translatedCategory;

  // =========================
  // PAGE
  // =========================
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        {/* ORQAGA */}
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() =>
            navigate("/vakansiyalar")
          }
          className="mb-5"
        >
          {t("vacancies.backToVacancies")}
        </Button>

        {/* ASOSIY CARD */}
        <Card>
          {/* HEADER */}
          <div className="flex items-start justify-between gap-5 flex-wrap">
            <div>
              <Tag
                color="blue"
                className="mb-3"
              >
                {translatedCategory}
              </Tag>

              <h1 className="text-3xl font-bold text-gray-800">
                {vacancy.title}
              </h1>

              <div className="flex items-center gap-2 text-gray-500 mt-3">
                <EnvironmentOutlined />

                <span>
                  {vacancy.location}
                </span>
              </div>
            </div>
          </div>

          <Divider />

          {/* USTA */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              {t("vacancies.postedBy")}
            </h2>

            <div className="flex items-center gap-4">
              <Avatar
                size={60}
                icon={<UserOutlined />}
              />

              <div>
                <p className="font-semibold text-gray-800 text-lg">
                  {ustaName}
                </p>

                <p className="text-gray-500">
                  {ustaProfession}
                </p>
              </div>
            </div>
          </div>

          <Divider />

          {/* VAKANSIYA MA'LUMOTLARI */}
          <h2 className="text-lg font-semibold text-gray-800 mb-5">
            {t("vacancies.detailsTitle")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* XIZMAT */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <AppstoreOutlined />
              </div>

              <div>
                <p className="text-sm text-gray-400">
                  {t("vacancies.serviceType")}
                </p>

                <p className="font-medium text-gray-800">
                  {translatedCategory}
                </p>
              </div>
            </div>

            {/* MANZIL */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <EnvironmentOutlined />
              </div>

              <div>
                <p className="text-sm text-gray-400">
                  {t("vacancies.address")}
                </p>

                <p className="font-medium text-gray-800">
                  {vacancy.location}
                </p>
              </div>
            </div>

            {/* NARX */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <DollarOutlined />
              </div>

              <div>
                <p className="text-sm text-gray-400">
                  {t("vacancies.price")}
                </p>

                <p className="font-medium text-gray-800">
                  {vacancy.price ||
                    t("common.negotiable")}
                </p>
              </div>
            </div>

            {/* TELEFON */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <PhoneOutlined />
              </div>

              <div>
                <p className="text-sm text-gray-400">
                  {t("vacancies.phone")}
                </p>

                <p className="font-medium text-gray-800">
                  {vacancy.contactPhone}
                </p>
              </div>
            </div>
          </div>

          <Divider />

          {/* TAVSIF */}
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {t("vacancies.fullDescription")}
          </h2>

          <p className="text-gray-600 leading-7 whitespace-pre-line">
            {vacancy.description}
          </p>

          <Divider />

          {/* USTA BILAN BOG'LANISH */}
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {t("vacancies.contactMaster")}
          </h2>

          <div className="flex flex-wrap gap-3">
            {/* TELEFON */}
            <Button
              type="primary"
              size="large"
              icon={<PhoneOutlined />}
              onClick={handleCall}
            >
              {t("vacancies.callButton")}
            </Button>

            {/* TELEGRAM */}
            <Button
              size="large"
              icon={<SendOutlined />}
              onClick={handleTelegram}
            >
              {t("vacancies.telegramButton")}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}