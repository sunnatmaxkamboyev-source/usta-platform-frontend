import { Form, Input, Button, Card, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await fetch(
        "https://usta-platform-backend.onrender.com/api/auth/login",
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
        throw new Error(data.message || t("auth.loginError"));
      }

      if (!data.token || !data.user) {
        throw new Error(t("auth.loginError"));
      }

      // Token va foydalanuvchi ma'lumotlarini saqlash
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", data.user.role);

      message.success(t("common.welcome"));

      // Faqat usta paneliga kirish
      if (data.user.role === "usta") {
        navigate("/dashboard", { replace: true });
        return;
      }

      // Ruxsat berilmagan foydalanuvchi
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");

      message.error(t("auth.noPermission"));
    } catch (error) {
      message.error(error.message || t("auth.loginError"));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <Card
        className="w-full max-w-md"
        title={t("auth.masterLogin", {
          defaultValue: "Usta sifatida kirish",
        })}
      >
        <Form
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
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

          <div className="text-center text-sm text-gray-500">
            {t("auth.noAccount")}{" "}
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

