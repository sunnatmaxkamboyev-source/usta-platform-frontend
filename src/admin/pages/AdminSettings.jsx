import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  SafetyOutlined,
} from "@ant-design/icons";

import API_URL from "../../config/api";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: values.username,
            password: values.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Admin login amalga oshmadi"
        );
      }

      localStorage.setItem(
        "admin_token",
        data.token
      );

      localStorage.setItem(
        "admin",
        JSON.stringify(data.admin)
      );

      localStorage.setItem(
        "admin_role",
        data.admin.role
      );

      message.success(
        "Admin sifatida muvaffaqiyatli kirdingiz"
      );

      navigate("/admin/dashboard");
    } catch (error) {
      message.error(
        error.message ||
          "Server bilan bog'lanishda xatolik"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <Card
        className="w-full max-w-md shadow-xl"
        bordered={false}
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-900 flex items-center justify-center">
            <SafetyOutlined className="text-3xl text-white" />
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            Admin Panel
          </h1>

          <p className="text-slate-500 mt-2">
            Usta Platform boshqaruv paneli
          </p>
        </div>

        <Form
          layout="vertical"
          onFinish={handleLogin}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Username kiriting",
              },
            ]}
          >
            <Input
              size="large"
              prefix={<UserOutlined />}
              placeholder="Username"
            />
          </Form.Item>

          <Form.Item
            label="Parol"
            name="password"
            rules={[
              {
                required: true,
                message: "Parolni kiriting",
              },
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
              placeholder="Parol"
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              className="bg-blue-900"
            >
              Admin panelga kirish
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AdminLogin;