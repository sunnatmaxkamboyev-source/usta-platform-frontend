import { useNavigate, useSearchParams } from "react-router-dom";

import {
  Card,
  Button,
  Tag,
  Empty,
  Input,
  Select,
  Spin,
  message,
} from "antd";

import {
  SearchOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Vacancies() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] =
    useSearchParams();

  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);

  const urlCategory =
    searchParams.get("category") || "all";

  const [search, setSearch] = useState("");
  const [category, setCategory] =
    useState(urlCategory);

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

        console.log(
          "Public vacancies response:",
          data
        );

        if (!response.ok) {
          throw new Error(
            data.message ||
              t("common.errorFetchVacancies")
          );
        }

        setVacancies(data.vacancies || []);
      } catch (error) {
        console.error(
          "Get vacancies error:",
          error
        );

        message.error(
          error.message ||
            t("common.errorFetchVacancies")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVacancies();
  }, [t]);

  // =========================
  // CATEGORY
  // =========================
  const handleCategoryChange = (value) => {
    setCategory(value);

    if (value === "all") {
      setSearchParams({});
    } else {
      setSearchParams({
        category: value,
      });
    }
  };

  // =========================
  // FILTER
  // =========================
  const filteredVacancies = useMemo(() => {
    return vacancies.filter((vacancy) => {
      const searchText =
        search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        vacancy.title
          ?.toLowerCase()
          .includes(searchText) ||
        vacancy.description
          ?.toLowerCase()
          .includes(searchText) ||
        vacancy.location
          ?.toLowerCase()
          .includes(searchText) ||
        vacancy.category
          ?.toLowerCase()
          .includes(searchText);

      const matchesCategory =
        category === "all" ||
        vacancy.category === category;

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [vacancies, search, category]);

  // =========================
  // CLEAR FILTERS
  // =========================
  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setSearchParams({});
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Spin size="large" />

          <p className="text-gray-500 mt-4">
            {t("common.loadingVacancies")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-6xl mx-auto">

        {/* =========================
            HEADER
        ========================== */}

        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            {t("navbar.vacancies")}
          </h1>

          <p className="text-gray-500 mt-3">
            {t("vacancies.subtitle")}
          </p>
        </div>

        {/* =========================
            SEARCH
        ========================== */}

        <Card className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* SEARCH */}

            <Input
              size="large"
              prefix={<SearchOutlined />}
              placeholder={t("common.searchPlaceholder")}
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {/* CATEGORY */}

            <Select
              size="large"
              value={category}
              onChange={handleCategoryChange}
              className="w-full"
              options={[
                {
                  value: "all",
                  label: t("vacancies.categories.all"),
                },
                {
                  value: "santexnik",
                  label: t("services.items.plumbing.title"),
                },
                {
                  value: "tom-tamirlash",
                  label: t("services.items.roofRepair.title"),
                },
                {
                  value: "zamburug-tozalash",
                  label: t("services.items.moldCleaning.title"),
                },
                {
                  value: "daraxt-kesish",
                  label: t("services.items.treeCutting.title"),
                },
                {
                  value: "maishiy-texnika",
                  label: t("services.items.applianceRepair.title"),
                },
                {
                  value: "hammom",
                  label: t("services.items.bathroomRepair.title"),
                },
                {
                  value: "qulfsoz",
                  label: t("services.items.locksmith.title"),
                },
                {
                  value: "elektrik",
                  label: t("vacancies.categories.electrician"),
                },
                {
                  value: "payvandchi",
                  label: t("vacancies.categories.welder"),
                },
                {
                  value: "quruvchi",
                  label: t("vacancies.categories.builder"),
                },
                {
                  value: "mebelchi",
                  label: t("vacancies.categories.furnitureMaker"),
                },
                {
                  value: "boyoqchi",
                  label: t("vacancies.categories.painter"),
                },
                {
                  value: "boshqa",
                  label: t("vacancies.categories.other"),
                },
              ]}
            />

            {/* CLEAR */}

            <Button
              size="large"
              onClick={clearFilters}
            >
              {t("common.clearFilters")}
            </Button>
          </div>
        </Card>

        {/* =========================
            RESULT HEADER
        ========================== */}

        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {t("vacancies.available")}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {filteredVacancies.length} {t("vacancies.count")}
            </p>
          </div>
        </div>

        {/* =========================
            VACANCIES
        ========================== */}

        {filteredVacancies.length === 0 ? (
          <Card>
            <Empty
              description={
                vacancies.length === 0
                  ? t("vacancies.emptyNoVacancies")
                  : t("vacancies.emptyNoResults")
              }
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            {filteredVacancies.map(
              (vacancy) => (
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

                  <h2 className="text-xl font-semibold text-gray-800 mt-4 line-clamp-2">
                    {vacancy.title}
                  </h2>

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
                    icon={
                      <ArrowRightOutlined />
                    }
                    onClick={() =>
                      navigate(
                        `/vakansiyalar/${vacancy._id}`
                      )
                    }
                  >
                    {t("common.viewDetail")}
                  </Button>

                </Card>
              )
            )}

          </div>
        )}

      </div>
    </div>
  );
}

