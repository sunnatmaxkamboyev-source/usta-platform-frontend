
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Select,
  message,
  Spin,
  Tag,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  ToolOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  PhoneOutlined,
  SendOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { TextArea } = Input;
const API = "https://usta-platform-backend.onrender.com/api";

export default function EditVacancy() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchVacancy = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API}/vacancies/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || t("editVacancy.messages.fetchError")
          );
        }

        const vacancy = data.vacancy;

        if (!vacancy) {
          throw new Error(t("editVacancy.messages.notFound"));
        }

        form.setFieldsValue({
          title: vacancy.title,
          category: vacancy.category,
          location: vacancy.location,
          price: vacancy.price,
          contactPhone: vacancy.contactPhone,
          telegram: vacancy.telegram,
          description: vacancy.description,
        });
      } catch (error) {
        console.error("Get vacancy for edit error:", error);

        message.error(
          error.message || t("editVacancy.messages.loadError")
        );

        navigate("/dashboard", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVacancy();
    } else {
      setLoading(false);
      message.error(t("editVacancy.messages.notFound"));
      navigate("/dashboard", { replace: true });
    }
  }, [id, form, navigate, t]);

  const onFinish = async (values) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        message.error(t("editVacancy.messages.loginRequired"));
        navigate("/login");
        return;
      }

      setSaving(true);

      const response = await fetch(`${API}/vacancies/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: values.title,
          category: values.category,
          location: values.location,
          price: values.price || "Kelishiladi",
          contactPhone: values.contactPhone,
          telegram: values.telegram,
          description: values.description,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        message.error(t("editVacancy.messages.loginRequired"));
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || t("editVacancy.messages.updateError")
        );
      }

      message.success(t("editVacancy.messages.updateSuccess"));
      navigate("/dashboard");
    } catch (error) {
      console.error("Update vacancy error:", error);

      message.error(
        error.message || t("editVacancy.messages.updateError")
      );
    } finally {
      setSaving(false);
    }
  };

  const categoryOptions = [
    {
      value: "santexnik",
      label: t("newVacancy.categories.plumber"),
    },
    {
      value: "elektrik",
      label: t("newVacancy.categories.electrician"),
    },
    {
      value: "payvandchi",
      label: t("newVacancy.categories.welder"),
    },
    {
      value: "quruvchi",
      label: t("newVacancy.categories.builder"),
    },
    {
      value: "mebelchi",
      label: t("newVacancy.categories.furnitureMaker"),
    },
    {
      value: "boyoqchi",
      label: t("newVacancy.categories.painter"),
    },
    {
      value: "boshqa",
      label: t("newVacancy.categories.other"),
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50">
        <Spin size="large" />
        <p className="text-sm text-slate-500">
          {t("editVacancy.loading")}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="bg-[#101D35] text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3 text-left"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
              <ToolOutlined className="text-lg" />
            </span>

            <span>
              <span className="block font-bold">Usta Platform</span>
              <span className="block text-xs text-slate-400">
                {t("editVacancy.title")}
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
              {t("editVacancy.buttons.cancel")}
            </span>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-7 sm:px-6 sm:py-10">
        {/* PAGE INTRO */}
        <div className="mb-6">
          <Tag color="blue" className="!mb-3 !rounded-md !px-2 !py-1">
            <ToolOutlined className="mr-1" />
            Usta Platform
          </Tag>

          <h1 className="text-2xl font-extrabold tracking-tight text-[#15233B] sm:text-3xl">
            {t("editVacancy.title")}
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {t("editVacancy.form.descriptionPlaceholder")}
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
                label={t("editVacancy.form.title")}
                name="title"
                rules={[
                  {
                    required: true,
                    message: t(
                      "editVacancy.validation.titleRequired"
                    ),
                  },
                ]}
              >
                <Input
                  size="large"
                  prefix={<FileTextOutlined className="text-slate-400" />}
                  placeholder={t(
                    "editVacancy.form.titlePlaceholder"
                  )}
                />
              </Form.Item>

              <Form.Item
                label={t("editVacancy.form.category")}
                name="category"
                rules={[
                  {
                    required: true,
                    message: t(
                      "editVacancy.validation.categoryRequired"
                    ),
                  },
                ]}
              >
                <Select
                  size="large"
                  options={categoryOptions}
                  placeholder={t(
                    "editVacancy.form.categoryPlaceholder"
                  )}
                />
              </Form.Item>

              <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
                <Form.Item
                  label={t("editVacancy.form.location")}
                  name="location"
                  rules={[
                    {
                      required: true,
                      message: t(
                        "editVacancy.validation.locationRequired"
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
                      "editVacancy.form.locationPlaceholder"
                    )}
                  />
                </Form.Item>

                <Form.Item
                  label={t("editVacancy.form.price")}
                  name="price"
                >
                  <Input
                    size="large"
                    prefix={
                      <DollarOutlined className="text-slate-400" />
                    }
                    placeholder={t(
                      "editVacancy.form.pricePlaceholder"
                    )}
                  />
                </Form.Item>

                <Form.Item
                  label={t("editVacancy.form.phone")}
                  name="contactPhone"
                  rules={[
                    {
                      required: true,
                      message: t(
                        "editVacancy.validation.phoneRequired"
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
                      "editVacancy.form.phonePlaceholder"
                    )}
                  />
                </Form.Item>

                <Form.Item
                  label={t("editVacancy.form.telegram")}
                  name="telegram"
                  rules={[
                    {
                      required: true,
                      message: t(
                        "editVacancy.validation.telegramRequired"
                      ),
                    },
                  ]}
                >
                  <Input
                    size="large"
                    addonBefore="@"
                    prefix={<SendOutlined className="text-slate-400" />}
                    placeholder={t(
                      "editVacancy.form.telegramPlaceholder"
                    )}
                  />
                </Form.Item>
              </div>

              <Form.Item
                label={t("editVacancy.form.description")}
                name="description"
                rules={[
                  {
                    required: true,
                    message: t(
                      "editVacancy.validation.descriptionRequired"
                    ),
                  },
                ]}
              >
                <TextArea
                  rows={5}
                  showCount
                  maxLength={2000}
                  placeholder={t(
                    "editVacancy.form.descriptionPlaceholder"
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
                  {t("editVacancy.buttons.cancel")}
                </Button>

                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  icon={<SaveOutlined />}
                  loading={saving}
                  className="!h-11 !rounded-lg !bg-blue-600 !font-semibold hover:!bg-blue-700"
                >
                  {t("editVacancy.buttons.save")}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
}
