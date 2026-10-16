import { useEffect, useState } from "react";
import { Card, Button, Tag, Spin, Empty } from "antd";

import {
  EnvironmentOutlined,
  DollarOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function HomeVacancies() {
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
        console.error("Home vacancies error:", error);
        setVacancies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVacancies();
  }, [t]);

  const getCategoryName = (category) => {
    if (!category) {
      return t("vacancies.categories.other");
    }

    const categoryKey = `vacancies.categories.${category}`;
    const translatedCategory = t(categoryKey);

    return translatedCategory === categoryKey
      ? category
      : translatedCategory;
  };

  const latestVacancies = vacancies.slice(0, 3);

  if (loading) {
    return (
      <section className="bg-slate-50 py-16 sm:py-20 px-5">
        <div className="max-w-7xl mx-auto flex justify-center py-12">
          <Spin size="large" />
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-50 py-16 sm:py-20 px-5">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="inline-flex items-center gap-2 text-brand text-xs sm:text-sm font-bold uppercase tracking-[0.16em] mb-4">
            <span className="w-7 h-[2px] bg-brand rounded-full" />
            Usta Platform
            <span className="w-7 h-[2px] bg-brand rounded-full" />
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-navy">
            {t("vacancies.available")}
          </h2>

          <p className="text-gray-500 mt-4 leading-7">
            {t("vacancies.subtitle")}
          </p>
        </div>

        {/* EMPTY STATE */}
        {latestVacancies.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10">
            <Empty
              description={t("vacancies.emptyNoVacancies")}
            />
          </div>
        ) : (
          <>
            {/* VACANCY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {latestVacancies.map((vacancy) => (
                <Card
                  key={vacancy._id}
                  hoverable
                  className="h-full overflow-hidden rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 hover:border-brand/40 transition-all duration-300"
                  styles={{
                    body: {
                      padding: "24px",
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    },
                  }}
                >
                  {/* CATEGORY */}
                  <div className="mb-4">
                    <Tag
                      color="blue"
                      className="!rounded-full !px-3 !py-1 !text-xs !font-semibold !border-0"
                    >
                      {getCategoryName(vacancy.category)}
                    </Tag>
                  </div>

                  {/* TITLE */}
                  <h3 className="text-lg sm:text-xl font-bold text-navy leading-snug line-clamp-2 min-h-[3.5rem]">
                    {vacancy.title}
                  </h3>

                  {/* LOCATION */}
                  <div className="flex items-start gap-3 text-gray-500 mt-5">
                    <EnvironmentOutlined className="text-brand mt-1" />
                    <span className="text-sm leading-6">
                      {vacancy.location}
                    </span>
                  </div>

                  {/* PRICE */}
                  <div className="flex items-start gap-3 mt-3">
                    <DollarOutlined className="text-brand mt-1" />
                    <span className="text-sm font-bold text-navy leading-6">
                      {vacancy.price || t("common.negotiable")}
                    </span>
                  </div>

                  {/* DESCRIPTION */}
                  <p className="text-sm text-gray-500 leading-6 mt-5 line-clamp-3 min-h-[4.5rem]">
                    {vacancy.description}
                  </p>

                  {/* MASTER */}
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <p className="text-xs text-gray-400 mb-1">
                      {t("vacancies.postedBy")}
                    </p>

                    <p className="font-semibold text-navy truncate">
                      {vacancy.usta?.name || t("common.master")}
                    </p>
                  </div>

                  {/* DETAIL BUTTON */}
                  <Button
                    type="primary"
                    block
                    size="large"
                    icon={<ArrowRightOutlined />}
                    className="!mt-5 !h-12 !rounded-xl !font-semibold"
                    onClick={() =>
                      navigate(`/vakansiyalar/${vacancy._id}`)
                    }
                  >
                    {t("common.viewDetail")}
                  </Button>
                </Card>
              ))}
            </div>

            {/* ALL VACANCIES */}
            <div className="text-center mt-10">
              <Button
                size="large"
                onClick={() => navigate("/vakansiyalar")}
                className="!h-12 !px-7 !rounded-xl !font-semibold"
              >
                {t("vacancies.viewAll")}
                <ArrowRightOutlined className="ml-2" />
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}