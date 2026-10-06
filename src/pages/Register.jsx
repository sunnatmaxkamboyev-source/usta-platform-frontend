import { Form, Input, Button, Card, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: values.name,
            profession: values.profession,
            phone: values.phone,
            password: values.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || t("auth.registerError")
        );
      }

      message.success(
        t("auth.registerSuccess")
      );

      navigate("/login");
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <Card
        className="w-full max-w-md"
        title={t("auth.masterRegister")}
      >
        <Form
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          {/* ISM */}
          <Form.Item
            label={t("auth.name")}
            name="name"
            rules={[
              {
                required: true,
                message: t("auth.nameRequired"),
              },
            ]}
          >
            <Input
              size="large"
              placeholder="Jasur Toshmatov"
            />
          </Form.Item>

          {/* KASB */}
          <Form.Item
            label={t("auth.profession")}
            name="profession"
            rules={[
              {
                required: true,
                message: t("auth.professionRequired"),
              },
            ]}
          >
            <Input
              size="large"
              placeholder={t("auth.professionPlaceholder")}
            />
          </Form.Item>

          {/* TELEFON */}
          <Form.Item
            label={t("auth.phone")}
            name="phone"
            rules={[
              {
                required: true,
                message: t("auth.phoneRequired"),
              },
            ]}
          >
            <Input
              size="large"
              placeholder="+998 90 123 45 67"
            />
          </Form.Item>

          {/* PAROL */}
          <Form.Item
            label={t("auth.password")}
            name="password"
            rules={[
              {
                required: true,
                message: t("auth.passwordRequired"),
              },
              {
                min: 6,
                message:
                  t("auth.passwordMinLength"),
              },
            ]}
          >
            <Input.Password
              size="large"
              placeholder={t("auth.passwordPlaceholder")}
            />
          </Form.Item>

          {/* TUGMA */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
            >
              {t("auth.register")}
            </Button>
          </Form.Item>

          {/* LOGIN */}
          <div className="text-center text-sm text-gray-500">
            {t("auth.haveAccount")} {t("auth.login")}
            <Link
              to="/login"
              className="text-blue-600 font-medium"
            >
              {t("auth.login")}
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}