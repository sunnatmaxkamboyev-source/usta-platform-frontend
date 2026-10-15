import {
  Form,
  Input,
  Button,
  Card,
  Select,
  message,
} from "antd";

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const { TextArea } = Input;

export default function NewVacancy() {
  const navigate = useNavigate();
  const { t } = useTranslation();

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

      const response = await fetch(
        "https://usta-platform-backend.onrender.com/api/vacancies",
        {
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
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");

        message.error(
          t("newVacancy.sessionExpired")
        );

        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            t("newVacancy.createError")
        );
      }

      message.success(t("newVacancy.success"));

      navigate("/dashboard");
    } catch (error) {
      console.error("Create vacancy error:", error);

      message.error(
        error.message ||
          t("newVacancy.createError")
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <Card title={t("newVacancy.title")}>
          <Form
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            {/* VAKANSIYA NOMI */}
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
                placeholder={t(
                  "newVacancy.fields.titlePlaceholder"
                )}
              />
            </Form.Item>

            {/* XIZMAT TURI */}
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
                placeholder={t(
                  "newVacancy.fields.categoryPlaceholder"
                )}
                options={categoryOptions}
              />
            </Form.Item>

            {/* MANZIL */}
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
                placeholder={t(
                  "newVacancy.fields.locationPlaceholder"
                )}
              />
            </Form.Item>

            {/* NARX */}
            <Form.Item
              label={t("newVacancy.fields.price")}
              name="price"
            >
              <Input
                size="large"
                placeholder={t(
                  "newVacancy.fields.pricePlaceholder"
                )}
              />
            </Form.Item>

            {/* TELEFON */}
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
                placeholder={t(
                  "newVacancy.fields.contactPhonePlaceholder"
                )}
              />
            </Form.Item>

            {/* TELEGRAM */}
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
                placeholder={t(
                  "newVacancy.fields.telegramPlaceholder"
                )}
              />
            </Form.Item>

            {/* TAVSIF */}
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
                rows={6}
                placeholder={t(
                  "newVacancy.fields.descriptionPlaceholder"
                )}
              />
            </Form.Item>

            {/* TUGMALAR */}
            <div className="flex gap-3">
              <Button
                size="large"
                onClick={() => navigate("/dashboard")}
              >
                {t("common.cancel")}
              </Button>

              <Button
                type="primary"
                htmlType="submit"
                size="large"
              >
                {t("newVacancy.buttons.submit")}
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
}