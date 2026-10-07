import { useEffect, useState } from "react";

import { Card, Button, Tag, Spin, message } from "antd";

import {
  EnvironmentOutlined,
  DollarOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";

export default function VacanciesPreview() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          "https://usta-platform-backend.onrender.com/api/vacancies"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || t("common.errorFetchVacancies")
          );
        }

        setVacancies(data.vacancies || []);
      } catch (error) {
        console.error("Get preview vacancies error:", error);

        message.error(
          error.message || t("common.errorFetchVacancies")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVacancies();
  }, [t]);

  const latestVacancies = [...vacancies]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    )
    .slice(0, 3);

  if (loading) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto flex justify-center">
          <Spin size="large" />
        </div>
      </section>
    );
  }

  if (latestVacancies.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            {t("vacancies.latestTitle")}
          </h2>

          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
            {t("vacancies.latestDescription")}
          </p>
        </div>

        {/* VACANCIES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {latestVacancies.map((vacancy) => (
            <Card
              key={vacancy._id}
              hoverable
              className="h-full"
            >
              {/* CATEGORY */}
              <Tag color="blue">
                {vacancy.category}
              </Tag>

              {/* TITLE */}
              <h3 className="text-xl font-semibold text-gray-800 mt-4 line-clamp-2">
                {vacancy.title}
              </h3>

              {/* LOCATION */}
              <div className="flex items-center gap-2 text-gray-500 mt-4">
                <EnvironmentOutlined />
                <span>{vacancy.location}</span>
              </div>

              {/* PRICE */}
              <div className="flex items-center gap-2 text-gray-700 mt-3">
                <DollarOutlined />

                <span className="font-medium">
                  {vacancy.price ||
                    t("common.negotiable")}
                </span>
              </div>

              {/* DESCRIPTION */}
              <p className="text-gray-500 mt-4 line-clamp-3">
                {vacancy.description}
              </p>

              {/* USTA */}
              <div className="mt-5 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-400">
                  {t("vacancies.postedBy")}
                </p>

                <p className="font-medium text-gray-800 mt-1">
                  {vacancy.usta?.name ||
                    t("common.master")}
                </p>
              </div>

              {/* DETAIL BUTTON */}
              <Button
                type="primary"
                block
                size="large"
                className="mt-5"
                icon={<ArrowRightOutlined />}
                onClick={() =>
                  navigate(
                    `/vakansiyalar/${vacancy._id}`
                  )
                }
              >
                {t("common.viewDetail")}
              </Button>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Button
            size="large"
            type="primary"
            onClick={() => navigate("/vakansiyalar")}
          >
            {t("vacancies.viewAll")}
          </Button>
        </div>
      </div>
    </section>
  );
}