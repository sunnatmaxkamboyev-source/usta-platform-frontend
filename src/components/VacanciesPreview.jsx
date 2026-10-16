
import { useEffect, useState } from "react";
import { Button, Tag, Spin, message } from "antd";
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

  return (
    <section className="bg-slate-50 px-5 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
            {t("vacancies.latestTitle")}
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
            {t("vacancies.latestDescription")}
          </p>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex justify-center py-10">
            <Spin size="large" />
          </div>
        ) : latestVacancies.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">
            {t("common.noVacancies", {
              defaultValue: "Hozircha e'lonlar mavjud emas.",
            })}
          </p>
        ) : (
          <>
            {/* VACANCIES */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {latestVacancies.map((vacancy) => (
                <article
                  key={vacancy._id}
                  className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                >
                  <div className="mb-3">
                    <Tag color="blue">{vacancy.category}</Tag>
                  </div>

                  <h3 className="line-clamp-2 text-lg font-bold text-slate-900">
                    {vacancy.title}
                  </h3>

                  <div className="mt-4 flex items-start gap-2 text-sm text-slate-500">
                    <EnvironmentOutlined className="mt-1 text-blue-600" />
                    <span>{vacancy.location}</span>
                  </div>

                  <div className="mt-2 flex items-start gap-2 text-sm font-semibold text-slate-800">
                    <DollarOutlined className="mt-1 text-blue-600" />
                    <span>
                      {vacancy.price || t("common.negotiable")}
                    </span>
                  </div>

                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                    {vacancy.description}
                  </p>

                  <div className="mt-auto">
                    <div className="my-4 border-t border-slate-100 pt-3">
                      <p className="text-xs text-slate-400">
                        {t("vacancies.postedBy")}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {vacancy.usta?.name || t("common.master")}
                      </p>
                    </div>

                    <Button
                      block
                      type="primary"
                      icon={<ArrowRightOutlined />}
                      onClick={() =>
                        navigate(`/vakansiyalar/${vacancy._id}`)
                      }
                    >
                      {t("common.viewDetail")}
                    </Button>
                  </div>
                </article>
              ))}
            </div>

            {/* VIEW ALL */}
            <div className="mt-7 flex justify-center">
              <Button
                size="large"
                onClick={() => navigate("/vakansiyalar")}
              >
                {t("vacancies.viewAll")}
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
