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
      value: "boshqa",
      label: t("vacancies.categories.other"),
    },
  ];

  const onFinish = async (values) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        message.error(
          t("newVacancy.messages.loginRequired")
        );
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
              values.price ||
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
          t("newVacancy.messages.sessionExpired")
        );

        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            t("newVacancy.messages.createError")
        );
      }

      message.success(
        t("newVacancy.messages.success")
      );

      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Create vacancy error:",
        error
      );

      message.error(
        error.message ||
          t("newVacancy.messages.createError")
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
              label={t("newVacancy.form.title")}
              name="title"
              rules={[
                {
                  required: true,
                  message: t(
                    "newVacancy.validation.title"
                  ),
                },
              ]}
            >
              <Input
                size="large"
                placeholder={t(
                  "newVacancy.form.titlePlaceholder"
                )}
              />
            </Form.Item>

            {/* XIZMAT TURI */}
            <Form.Item
              label={t("newVacancy.form.category")}
              name="category"
              rules={[
                {
                  required: true,
                  message: t(
                    "newVacancy.validation.category"
                  ),
                },
              ]}
            >
              <Select
                size="large"
                placeholder={t(
                  "newVacancy.form.categoryPlaceholder"
                )}
                options={categoryOptions}
              />
            </Form.Item>

            {/* MANZIL */}
            <Form.Item
              label={t("newVacancy.form.location")}
              name="location"
              rules={[
                {
                  required: true,
                  message: t(
                    "newVacancy.validation.location"
                  ),
                },
              ]}
            >
              <Input
                size="large"
                placeholder={t(
                  "newVacancy.form.locationPlaceholder"
                )}
              />
            </Form.Item>

            {/* NARX */}
            <Form.Item
              label={t("newVacancy.form.price")}
              name="price"
            >
              <Input
                size="large"
                placeholder={t(
                  "newVacancy.form.pricePlaceholder"
                )}
              />
            </Form.Item>

            {/* TELEFON */}
            <Form.Item
              label={t("newVacancy.form.phone")}
              name="contactPhone"
              rules={[
                {
                  required: true,
                  message: t(
                    "newVacancy.validation.phone"
                  ),
                },
              ]}
            >
              <Input
                size="large"
                placeholder="+998 90 123 45 67"
              />
            </Form.Item>

            {/* TELEGRAM */}
            <Form.Item
              label={t("newVacancy.form.telegram")}
              name="telegram"
              rules={[
                {
                  required: true,
                  message: t(
                    "newVacancy.validation.telegram"
                  ),
                },
              ]}
            >
              <Input
                size="large"
                addonBefore="@"
                placeholder="username"
              />
            </Form.Item>

            {/* TAVSIF */}
            <Form.Item
              label={t("newVacancy.form.description")}
              name="description"
              rules={[
                {
                  required: true,
                  message: t(
                    "newVacancy.validation.description"
                  ),
                },
              ]}
            >
              <TextArea
                rows={6}
                placeholder={t(
                  "newVacancy.form.descriptionPlaceholder"
                )}
              />
            </Form.Item>

            {/* BUTTONS */}
            <div className="flex gap-3">
              <Button
                size="large"
                onClick={() =>
                  navigate("/dashboard")
                }
              >
                {t("common.cancel")}
              </Button>

              <Button
                type="primary"
                htmlType="submit"
                size="large"
              >
                {t("newVacancy.submit")}
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
}