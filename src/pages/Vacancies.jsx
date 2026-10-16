
import { useEffect, useMemo, useState } from "react";
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
  ToolOutlined,
  ClearOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const API = "https://usta-platform-backend.onrender.com/api";

export default function Vacancies() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const urlCategory = searchParams.get("category") || "all";
  const [category, setCategory] = useState(urlCategory);

  // URL o'zgarsa, kategoriya filtrini ham yangilash
  useEffect(() => {
    setCategory(searchParams.get("category") || "all");
  }, [searchParams]);

  // Backenddan ochiq vakansiyalarni olish
  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API}/vacancies`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || t("common.errorFetchVacancies")
          );
        }

        setVacancies(data.vacancies || []);
      } catch (error) {
        console.error("Get vacancies error:", error);

        message.error(
          error.message || t("common.errorFetchVacancies")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVacancies();
  }, [t]);

  const categoryOptions = [
    { value: "all", label: t("vacancies.categories.all") },
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
  ];

  const handleCategoryChange = (value) => {
    setCategory(value);

    if (value === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category: value });
    }
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setSearchParams({});
  };

  const filteredVacancies = useMemo(() => {
    return vacancies.filter((vacancy) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        vacancy.title?.toLowerCase().includes(searchText) ||
        vacancy.description?.toLowerCase().includes(searchText) ||
        vacancy.location?.toLowerCase().includes(searchText) ||
        vacancy.category?.toLowerCase().includes(searchText);

      const matchesCategory =
        category === "all" || vacancy.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [vacancies, search, category]);

  // Loading
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-sm text-slate-500">
            {t("common.loadingVacancies")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="bg-[#101D35] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-3 text-left"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
              <ToolOutlined className="text-lg" />
            </span>

            <span>
              <span className="block font-bold">
                Usta Platform
              </span>
              <span className="block text-xs text-slate-400">
                {t("navbar.vacancies")}
              </span>
            </span>
          </button>

          <Button
            ghost
            onClick={() => navigate("/login")}
            className="!border-slate-600 !text-slate-200"
          >
            {t("navbar.login")}
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-10">
        {/* PAGE INTRO */}
        <div className="mb-7">
          <Tag
            color="blue"
            className="!mb-3 !rounded-md !px-2 !py-1"
          >
            <FileSearchOutlined className="mr-1" />
            Usta Platform
          </Tag>

          <h1 className="text-2xl font-extrabold tracking-tight text-[#15233B] sm:text-3xl md:text-4xl">
            {t("navbar.vacancies")}
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
            {t("vacancies.subtitle")}
          </p>
        </div>

        {/* SEARCH AND FILTERS */}
        <Card
          className="!mb-8 !rounded-2xl !border-slate-200 !shadow-sm"
          styles={{ body: { padding: 20 } }}
        >
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#15233B]">
            <SearchOutlined className="text-blue-600" />
            {t("common.searchPlaceholder")}
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.5fr_1fr_auto]">
            <Input
              size="large"
              prefix={
                <SearchOutlined className="text-slate-400" />
              }
              placeholder={t("common.searchPlaceholder")}
              value={search}
              allowClear
              onChange={(e) => setSearch(e.target.value)}
              className="!rounded-lg"
            />

            <Select
              size="large"
              value={category}
              onChange={handleCategoryChange}
              className="w-full"
              options={categoryOptions}
            />

            <Button
              size="large"
              icon={<ClearOutlined />}
              onClick={clearFilters}
              className="!rounded-lg"
            >
              {t("common.clearFilters")}
            </Button>
          </div>
        </Card>

        {/* RESULTS HEADER */}
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#15233B] sm:text-xl">
              {t("vacancies.available")}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredVacancies.length} {t("vacancies.count")}
            </p>
          </div>
        </div>

        {/* EMPTY STATE */}
        {filteredVacancies.length === 0 ? (
          <Card
            className="!rounded-2xl !border-slate-200"
            styles={{ body: { padding: "40px 16px" } }}
          >
            <Empty
              description={
                vacancies.length === 0
                  ? t("vacancies.emptyNoVacancies")
                  : t("vacancies.emptyNoResults")
              }
            />

            {(search || category !== "all") && (
              <div className="mt-5 text-center">
                <Button type="primary" onClick={clearFilters}>
                  {t("common.clearFilters")}
                </Button>
              </div>
            )}
          </Card>
        ) : (
          /* VACANCY CARDS */
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredVacancies.map((vacancy) => (
              <Card
                key={vacancy._id}
                hoverable
                className="!h-full !overflow-hidden !rounded-2xl !border-slate-200 !shadow-sm transition-all hover:!border-blue-200 hover:!shadow-md"
                styles={{ body: { padding: 20 } }}
              >
                <div className="mb-4 flex items-start justify-between gap-2">
                  <Tag
                    color="blue"
                    className="!m-0 !rounded-md !px-2 !py-1"
                  >
                    {categoryOptions.find(
                      (item) => item.value === vacancy.category
                    )?.label || vacancy.category}
                  </Tag>

                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <ToolOutlined />
                  </span>
                </div>

                <h3 className="line-clamp-2 min-h-[3.5rem] text-lg font-bold leading-7 text-[#15233B]">
                  {vacancy.title}
                </h3>

                <div className="mt-4 flex items-start gap-2 text-sm text-slate-500">
                  <EnvironmentOutlined className="mt-1 text-blue-600" />
                  <span className="break-words">
                    {vacancy.location}
                  </span>
                </div>

                <div className="mt-3 flex items-start gap-2 text-sm">
                  <DollarOutlined className="mt-1 text-emerald-600" />
                  <span className="font-semibold text-slate-800">
                    {vacancy.price || t("common.negotiable")}
                  </span>
                </div>

                <p className="mt-4 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-slate-500">
                  {vacancy.description}
                </p>

                <div className="mt-5 border-t border-slate-100 pt-4">
                  <p className="text-xs text-slate-400">
                    {t("vacancies.postedBy")}
                  </p>

                  <p className="mt-1 truncate text-sm font-semibold text-[#15233B]">
                    {vacancy.usta?.name || t("common.master")}
                  </p>
                </div>

                <Button
                  type="primary"
                  block
                  size="large"
                  icon={<ArrowRightOutlined />}
                  className="!mt-5 !h-11 !rounded-lg !bg-blue-600 !font-semibold hover:!bg-blue-700"
                  onClick={() =>
                    navigate(`/vakansiyalar/${vacancy._id}`)
                  }
                >
                  {t("common.viewDetail")}
                </Button>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
