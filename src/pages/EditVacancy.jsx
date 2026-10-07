import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
  Form,
  Input,
  Button,
  Card,
  Select,
  message,
  Spin,
} from "antd";

import { useTranslation } from "react-i18next";

const { TextArea } = Input;

export default function EditVacancy() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // =========================
  // VAKANSIYANI BACKENDDAN OLISH
  // =========================

  useEffect(() => {
    const fetchVacancy = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `https://usta-platform-backend.onrender.com/api/vacancies/${id}`
        );

        const data = await response.json();

        console.log("Edit vacancy response:", data);

        if (!response.ok) {
          throw new Error(
            data.message ||
              t("editVacancy.messages.fetchError")
          );
        }

        const vacancy = data.vacancy;

        if (!vacancy) {
          throw new Error(
            t("editVacancy.messages.notFound")
          );
        }

        // =========================
        // FORMAGA MA'LUMOTLARNI JOYLASH
        // =========================

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
        console.error(
          "Get vacancy for edit error:",
          error
        );

        message.error(
          error.message ||
            t("editVacancy.messages.loadError")
        );

        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVacancy();
    }
  }, [id, form, navigate, t]);

  // =========================
  // VAKANSIYANI YANGILASH
  // =========================

  const onFinish = async (values) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        message.error(
          t("editVacancy.messages.loginRequired")
        );

        navigate("/login");

        return;
      }

      setSaving(true);

      const response = await fetch(
        `https://usta-platform-backend.onrender.com/api/vacancies/${id}`,
        {
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
        }
      );

      const data = await response.json();

      console.log(
        "Update vacancy response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            t("editVacancy.messages.updateError")
        );
      }

      message.success(
        t("editVacancy.messages.updateSuccess")
      );

      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Update vacancy error:",
        error
      );

      message.error(
        error.message ||
          t("editVacancy.messages.updateError")
      );
    } finally {
      setSaving(false);
    }
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
            {t("editVacancy.loading")}
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // PAGE
  // =========================

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <Card title={t("editVacancy.title")}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            {/* =========================
                VAKANSIYA NOMI
            ========================== */}

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
                placeholder={t(
                  "editVacancy.form.titlePlaceholder"
                )}
              />
            </Form.Item>

            {/* =========================
                XIZMAT TURI
            ========================== */}

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
                placeholder={t(
                  "editVacancy.form.categoryPlaceholder"
                )}
                options={[
                  {
                    value: "santexnik",
                    label: t(
                      "newVacancy.categories.plumber"
                    ),
                  },
                  {
                    value: "elektrik",
                    label: t(
                      "newVacancy.categories.electrician"
                    ),
                  },
                  {
                    value: "payvandchi",
                    label: t(
                      "newVacancy.categories.welder"
                    ),
                  },
                  {
                    value: "quruvchi",
                    label: t(
                      "newVacancy.categories.builder"
                    ),
                  },
                  {
                    value: "mebelchi",
                    label: t(
                      "newVacancy.categories.furnitureMaker"
                    ),
                  },
                  {
                    value: "boyoqchi",
                    label: t(
                      "newVacancy.categories.painter"
                    ),
                  },
                  {
                    value: "boshqa",
                    label: t(
                      "newVacancy.categories.other"
                    ),
                  },
                ]}
              />
            </Form.Item>

            {/* =========================
                MANZIL
            ========================== */}

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
                placeholder={t(
                  "editVacancy.form.locationPlaceholder"
                )}
              />
            </Form.Item>

            {/* =========================
                NARX
            ========================== */}

            <Form.Item
              label={t("editVacancy.form.price")}
              name="price"
            >
              <Input
                size="large"
                placeholder={t(
                  "editVacancy.form.pricePlaceholder"
                )}
              />
            </Form.Item>

            {/* =========================
                TELEFON
            ========================== */}

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
                placeholder={t(
                  "editVacancy.form.phonePlaceholder"
                )}
              />
            </Form.Item>

            {/* =========================
                TELEGRAM
            ========================== */}

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
                placeholder={t(
                  "editVacancy.form.telegramPlaceholder"
                )}
              />
            </Form.Item>

            {/* =========================
                TAVSIF
            ========================== */}

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
                rows={6}
                placeholder={t(
                  "editVacancy.form.descriptionPlaceholder"
                )}
              />
            </Form.Item>

            {/* =========================
                BUTTONLAR
            ========================== */}

            <div className="flex gap-3">
              <Button
                size="large"
                onClick={() =>
                  navigate("/dashboard")
                }
                disabled={saving}
              >
                {t("editVacancy.buttons.cancel")}
              </Button>

              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={saving}
              >
                {t("editVacancy.buttons.save")}
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
}