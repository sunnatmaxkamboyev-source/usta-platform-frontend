
import { useState } from "react";
import { Form, Input, Button, Select, message, Tag } from "antd";
import {
  useNavigate,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  ToolOutlined,
  FileTextOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  PhoneOutlined,
  SendOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;
const API = "https://usta-platform-backend.onrender.com/api";

export default function NewVacancy() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  const categoryOptions = [
    {
      value: "santexnik",
      label: t("vacancies.categories.plumber"),
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
      value: "tom-tamirlash",
      label: t("newVacancy.categories.roofRepair"),
    },
    {
      value: "zamburug-tozalash",
      label: t("newVacancy.categories.moldCleaning"),
    },
    {
      value: "daraxt-kesish",
      label: t("newVacancy.categories.treeCutting"),
    },
    {
      value: "maishiy-texnika",
      label: t("newVacancy.categories.applianceRepair"),
    },
    {
      value: "hammom",
      label: t("newVacancy.categories.bathroomRepair"),
    },
    {
      value: "qulfsoz",
      label: t("newVacancy.categories.locksmith"),
    },
    {
      value: "boshqa",
      label: t("vacancies.categories.other"),
    },
  ];

  const onFinish = async (values) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        message.error(t("newVacancy.loginRequired"));
        navigate("/login");
        return;
      }

      setSaving(true);

      const response = await fetch(`${API}/vacancies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: values.title,
          category: values.category,
          location: values.location,
          price:
            values.price?.trim() ||
            t("common.negotiable"),
          contactPhone: values.contactPhone,
          telegram: values.telegram,
          description: values.description,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");

        message.error(t("newVacancy.sessionExpired"));
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || t("newVacancy.createError")
        );
      }

      message.success(t("newVacancy.success"));
      navigate("/dashboard");
    } catch (error) {
      console.error("Create vacancy error:", error);

      message.error(
        error.message || t("newVacancy.createError")
      );
    } finally {
      setSaving(false);
    }
  };

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
              <span className="block font-bold">
                Usta Platform
              </span>
              <span className="block text-xs text-slate-400">
                {t("newVacancy.title")}
              </span>
            </span>
          </button>

          <Button
            ghost
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/dashboard")}
            className="!border-slate-600 !text-slate-200"
          >
            <span className="hidden sm:inline">
              {t("common.cancel")}
            </span>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-7 sm:px-6 sm:py-10">
        {/* INTRO */}
        <div className="mb-6">
          <Tag
            color="blue"
            className="!mb-3 !rounded-md !px-2 !py-1"
          >
            <ToolOutlined className="mr-1" />
            Usta Platform
          </Tag>

          <h1 className="text-2xl font-extrabold tracking-tight text-[#15233B] sm:text-3xl">
            {t("newVacancy.title")}
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {t("newVacancy.fields.titlePlaceholder")}
          </p>
        </div>

        {/* FORM */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400" />

          <div className="p-5 sm:p-8">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
              requiredMark={false}
            >
              <Form.Item
                label={t("newVacancy.fields.title")}
                name="title"
                rules={[
                  {
                    required: true,
                    message: t(
                      "newVacancy.validation.titleRequired"
                    ),
                  },
                ]}
              >
                <Input
                  size="large"
                  prefix={
                    <FileTextOutlined className="text-slate-400" />
                  }
                  placeholder={t(
                    "newVacancy.fields.titlePlaceholder"
                  )}
                />
              </Form.Item>

              <Form.Item
                label={t("newVacancy.fields.category")}
                name="category"
                rules={[
                  {
                    required: true,
                    message: t(
                      "newVacancy.validation.categoryRequired"
                    ),
                  },
                ]}
              >
                <Select
                  size="large"
                  options={categoryOptions}
                  placeholder={t(
                    "newVacancy.fields.categoryPlaceholder"
                  )}
                  showSearch
                  optionFilterProp="label"
                />
              </Form.Item>

              <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
                <Form.Item
                  label={t("newVacancy.fields.location")}
                  name="location"
                  rules={[
                    {
                      required: true,
                      message: t(
                        "newVacancy.validation.locationRequired"
                      ),
                    },
                  ]}
                >
                  <Input
                    size="large"
                    prefix={
                      <EnvironmentOutlined className="text-slate-400" />
                    }
                    placeholder={t(
                      "newVacancy.fields.locationPlaceholder"
                    )}
                  />
                </Form.Item>

                <Form.Item
                  label={t("newVacancy.fields.price")}
                  name="price"
                >
                  <Input
                    size="large"
                    prefix={
                      <DollarOutlined className="text-slate-400" />
                    }
                    placeholder={t(
                      "newVacancy.fields.pricePlaceholder"
                    )}
                  />
                </Form.Item>

                <Form.Item
                  label={t("newVacancy.fields.contactPhone")}
                  name="contactPhone"
                  rules={[
                    {
                      required: true,
                      message: t(
                        "newVacancy.validation.phoneRequired"
                      ),
                    },
                  ]}
                >
                  <Input
                    size="large"
                    prefix={
                      <PhoneOutlined className="text-slate-400" />
                    }
                    placeholder={t(
                      "newVacancy.fields.contactPhonePlaceholder"
                    )}
                  />
                </Form.Item>

                <Form.Item
                  label={t("newVacancy.fields.telegram")}
                  name="telegram"
                  rules={[
                    {
                      required: true,
                      message: t(
                        "newVacancy.validation.telegramRequired"
                      ),
                    },
                  ]}
                >
                  <Input
                    size="large"
                    addonBefore="@"
                    prefix={
                      <SendOutlined className="text-slate-400" />
                    }
                    placeholder={t(
                      "newVacancy.fields.telegramPlaceholder"
                    )}
                  />
                </Form.Item>
              </div>

              <Form.Item
                label={t("newVacancy.fields.description")}
                name="description"
                rules={[
                  {
                    required: true,
                    message: t(
                      "newVacancy.validation.descriptionRequired"
                    ),
                  },
                ]}
              >
                <TextArea
                  rows={5}
                  showCount
                  maxLength={2000}
                  placeholder={t(
                    "newVacancy.fields.descriptionPlaceholder"
                  )}
                  className="!resize-y"
                />
              </Form.Item>

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <Button
                  size="large"
                  icon={<ArrowLeftOutlined />}
                  onClick={() => navigate("/dashboard")}
                  disabled={saving}
                  className="!h-11 !rounded-lg"
                >
                  {t("common.cancel")}
                </Button>

                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  icon={<SaveOutlined />}
                  loading={saving}
                  className="!h-11 !rounded-lg !bg-blue-600 !font-semibold hover:!bg-blue-700"
                >
                  {t("newVacancy.buttons.submit")}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
}
