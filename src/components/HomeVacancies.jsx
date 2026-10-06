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
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // BACKENDDAN VAKANSIYALARNI OLISH
  // =========================

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          "http://localhost:5000/api/vacancies"
        );

        const data = await response.json();

        console.log("Home vacancies response:", data);

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

  // =========================
  // KATEGORIYANI TARJIMA QILISH
  // =========================

  const getCategoryName = (category) => {
    if (!category) {
      return t("vacancies.categories.other");
    }

    const categoryKey = `vacancies.categories.${category}`;

    const translatedCategory = t(categoryKey);

    // Agar translation topilmasa backenddagi qiymat chiqadi
    if (translatedCategory === categoryKey) {
      return category;
    }

    return translatedCategory;
  };

  // =========================
  // ENG SO'NGGI 3 TA VAKANSIYA
  // =========================

  const latestVacancies = vacancies.slice(0, 3);

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center py-10">
            <Spin size="large" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">

        {/* =========================
            HEADER
        ========================== */}

        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            {t("vacancies.available")}
          </h2>

          <p className="text-gray-500 mt-3">
            {t("vacancies.subtitle")}
          </p>
        </div>

        {/* =========================
            EMPTY
        ========================== */}

        {latestVacancies.length === 0 ? (
          <Card>
            <Empty
              description={t(
                "vacancies.emptyNoVacancies"
              )}
            />
          </Card>
        ) : (
          <>
            {/* =========================
                VACANCIES
            ========================== */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {latestVacancies.map((vacancy) => (
                <Card
                  key={vacancy._id}
                  hoverable
                  className="h-full"
                >
                  {/* CATEGORY */}

                  <Tag color="blue">
                    {getCategoryName(vacancy.category)}
                  </Tag>

                  {/* TITLE */}

                  <h3 className="text-xl font-semibold text-gray-800 mt-4 line-clamp-2">
                    {vacancy.title}
                  </h3>

                  {/* LOCATION */}

                  <div className="flex items-center gap-2 text-gray-500 mt-4">
                    <EnvironmentOutlined />

                    <span>
                      {vacancy.location}
                    </span>
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

            {/* =========================
                ALL VACANCIES BUTTON
            ========================== */}

            <div className="text-center mt-10">
              <Button
                size="large"
                onClick={() =>
                  navigate("/vakansiyalar")
                }
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