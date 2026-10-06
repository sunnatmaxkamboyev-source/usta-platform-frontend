import { Form, Input, Button, Card, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: values.phone,
            password: values.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || t("auth.loginError")
        );
      }

      // JWT tokenni saqlaymiz
      localStorage.setItem("token", data.token);

      // User ma'lumotlarini saqlaymiz
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Role'ni saqlaymiz
      localStorage.setItem(
        "role",
        data.user.role
      );

      message.success(t("common.welcome"));

      // Usta dashboardiga o'tkazamiz
      if (data.user.role === "usta") {
        navigate("/dashboard", { replace: true });
        return;
      }

      // Agar boshqa role bo'lsa
      message.error(t("auth.noPermission"));
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <Card
        className="w-full max-w-md"
        title={t("auth.masterLogin")}
      >
        <Form
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
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
            ]}
          >
            <Input.Password
              size="large"
              placeholder={t("auth.password")}
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
              {t("auth.login")}
            </Button>
          </Form.Item>

          {/* REGISTER */}
          <div className="text-center text-sm text-gray-500">
            {t("auth.noAccount")} {t("auth.register")}
            <Link
              to="/register"
              className="text-blue-600 font-medium"
            >
              {t("auth.register")}
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}