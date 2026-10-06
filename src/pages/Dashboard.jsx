import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Card,
  Button,
  Avatar,
  Empty,
  Tag,
  Popconfirm,
  message,
  Spin,
  Modal,
  Form,
  Input,
  Divider,
} from "antd";

import {
  UserOutlined,
  PlusOutlined,
  LogoutOutlined,
  DeleteOutlined,
  EditOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  SendOutlined,
  LockOutlined,
} from "@ant-design/icons";

import { logoutUser } from "../utils/auth";

export default function Dashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [user, setUser] = useState(null);
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  // ========================================
  // AUTH + USER + VACANCIES
  // ========================================

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login", {
            replace: true,
          });
          return;
        }

        // ========================================
        // CURRENT USER
        // ========================================

        const userResponse = await fetch(
          "http://localhost:5000/api/auth/me",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userData = await userResponse.json();

        if (userResponse.status === 401) {
          logoutUser();

          message.error(
            t("ustaDashboard.messages.sessionExpired")
          );

          navigate("/login", {
            replace: true,
          });

          return;
        }

        if (!userResponse.ok) {
          throw new Error(
            userData.message ||
              t("ustaDashboard.messages.userFetchError")
          );
        }

        setUser(userData.user);

        localStorage.setItem(
          "user",
          JSON.stringify(userData.user)
        );

        localStorage.setItem(
          "role",
          userData.user.role
        );

        // ========================================
        // MY VACANCIES
        // ========================================

        const vacancyResponse = await fetch(
          "http://localhost:5000/api/vacancies/my",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const vacancyData =
          await vacancyResponse.json();

        if (vacancyResponse.status === 401) {
          logoutUser();

          message.error(
            t("ustaDashboard.messages.sessionExpired")
          );

          navigate("/login", {
            replace: true,
          });

          return;
        }

        if (!vacancyResponse.ok) {
          throw new Error(
            vacancyData.message ||
              t("ustaDashboard.messages.vacanciesFetchError")
          );
        }

        setVacancies(
          vacancyData.vacancies || []
        );
      } catch (error) {
        console.error(
          "Dashboard loading error:",
          error
        );

        message.error(
          error.message ||
            t("ustaDashboard.messages.dashboardFetchError")
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate, t]);

  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = () => {
    logoutUser();
    setUser(null);

    message.success(
      t("ustaDashboard.messages.logoutSuccess")
    );

    navigate("/login", {
      replace: true,
    });
  };

  // ========================================
  // OPEN PROFILE MODAL
  // ========================================

  const handleOpenProfile = () => {
    profileForm.setFieldsValue({
      name: user?.name || "",
      phone: user?.phone || "",
      profession: user?.profession || "",
    });

    passwordForm.resetFields();
    setProfileModalOpen(true);
  };

  // ========================================
  // CLOSE PROFILE MODAL
  // ========================================

  const handleCloseProfile = () => {
    if (
      profileLoading ||
      passwordLoading
    ) {
      return;
    }

    setProfileModalOpen(false);
    profileForm.resetFields();
    passwordForm.resetFields();
  };

  // ========================================
  // UPDATE PROFILE
  // ========================================

  const handleUpdateProfile = async (
    values
  ) => {
    try {
      setProfileLoading(true);

      const token =
        localStorage.getItem("token");

      if (!token) {
        logoutUser();

        navigate("/login", {
          replace: true,
        });

        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/auth/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: values.name,
            phone: values.phone,
            profession:
              values.profession,
          }),
        }
      );

      const data =
        await response.json();

      if (response.status === 401) {
        logoutUser();

        message.error(
          t("ustaDashboard.messages.sessionExpired")
        );

        navigate("/login", {
          replace: true,
        });

        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            t("ustaDashboard.messages.profileUpdateError")
        );
      }

      setUser(data.user);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      localStorage.setItem(
        "role",
        data.user.role
      );

      message.success(
        t("ustaDashboard.messages.profileUpdateSuccess")
      );
    } catch (error) {
      console.error(
        "Update profile error:",
        error
      );

      message.error(
        error.message ||
          t("ustaDashboard.messages.profileUpdateError")
      );
    } finally {
      setProfileLoading(false);
    }
  };

  // ========================================
  // CHANGE PASSWORD
  // ========================================

  const handleChangePassword = async (
    values
  ) => {
    try {
      setPasswordLoading(true);

      const token =
        localStorage.getItem("token");

      if (!token) {
        logoutUser();

        navigate("/login", {
          replace: true,
        });

        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/auth/password",
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword:
              values.currentPassword,
            newPassword:
              values.newPassword,
          }),
        }
      );

      const data =
        await response.json();

      // ========================================
      // SESSION
      // ========================================

      if (response.status === 401) {
        logoutUser();

        message.error(
          data.message ||
            t("ustaDashboard.messages.sessionExpired")
        );

        navigate("/login", {
          replace: true,
        });

        return;
      }

      // ========================================
      // ERROR
      // ========================================

      if (!response.ok) {
        throw new Error(
          data.message ||
            t("ustaDashboard.messages.passwordUpdateError")
        );
      }

      // ========================================
      // SUCCESS
      // ========================================

      passwordForm.resetFields();

      message.success(
        t("ustaDashboard.messages.passwordUpdateSuccess")
      );
    } catch (error) {
      console.error(
        "Change password error:",
        error
      );

      message.error(
        error.message ||
          t("ustaDashboard.messages.passwordUpdateError")
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  // ========================================
  // DELETE VACANCY
  // ========================================

  const handleDelete = async (id) => {
    try {
      setDeleteLoading(true);

      const token =
        localStorage.getItem("token");

      if (!token) {
        logoutUser();

        navigate("/login", {
          replace: true,
        });

        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/vacancies/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (response.status === 401) {
        logoutUser();

        message.error(
          t("ustaDashboard.messages.sessionExpired")
        );

        navigate("/login", {
          replace: true,
        });

        return;
      }

      if (response.status === 403) {
        message.error(
          t("ustaDashboard.messages.deletePermission")
        );

        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            t("ustaDashboard.messages.deleteVacancyError")
        );
      }

      setVacancies(
        (previousVacancies) =>
          previousVacancies.filter(
            (vacancy) =>
              vacancy._id !== id
          )
      );

      message.success(
        t("ustaDashboard.messages.deleteSuccess")
      );
    } catch (error) {
      console.error(
        "Delete vacancy error:",
        error
      );

      message.error(
        error.message ||
          t("ustaDashboard.messages.deleteVacancyError")
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // ========================================
  // EDIT VACANCY
  // ========================================

  const handleEdit = (id) => {
    navigate(
      `/vacancies/edit/${id}`
    );
  };

  // ========================================
  // CREATE VACANCY
  // ========================================

  const handleCreate = () => {
    navigate("/vacancies/new");
  };

  // ========================================
  // DETAIL
  // ========================================

  const handleDetail = (id) => {
    navigate(
      `/vakansiyalar/${id}`
    );
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spin size="large" />

          <p className="text-gray-500">
            {t("ustaDashboard.loading")}
          </p>
        </div>
      </div>
    );
  }

  // ========================================
  // UI
  // ========================================

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-5xl mx-auto">

        {/* PROFILE */}

        <Card className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-5">

            <div className="flex items-center gap-4">
              <Avatar
                size={64}
                icon={<UserOutlined />}
              />

              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {user?.name ||
                    t("ustaDashboard.profile.defaultName")}
                </h2>

                <p className="text-gray-500">
                  {user?.profession ||
                    t("ustaDashboard.profile.noProfession")}
                </p>

                <p className="text-gray-400 text-sm">
                  {user?.phone ||
                    t("ustaDashboard.profile.noPhone")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                icon={<EditOutlined />}
                onClick={
                  handleOpenProfile
                }
              >
                {t("ustaDashboard.profile.edit")}
              </Button>

              <Button
                danger
                icon={
                  <LogoutOutlined />
                }
                onClick={handleLogout}
              >
                {t("auth.logout")}
              </Button>
            </div>
          </div>
        </Card>

        {/* PANEL HEADER */}

        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {t("ustaDashboard.title")}
            </h1>

            <p className="text-gray-500 mt-1">
              {t("ustaDashboard.description")}
            </p>
          </div>

          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            {t("ustaDashboard.newVacancy")}
          </Button>
        </div>

        {/* VACANCIES */}

        {vacancies.length === 0 ? (
          <Card>
            <Empty
              description={
                t("ustaDashboard.empty")
              }
            />

            <div className="flex justify-center mt-5">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreate}
              >
                {t("ustaDashboard.firstVacancy")}
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {vacancies.map(
              (vacancy) => (
                <Card
                  key={vacancy._id}
                  className="shadow-sm"
                >

                  {/* TITLE */}

                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-lg font-semibold text-gray-800">
                        {vacancy.title}
                      </h2>

                      <Tag
                        color="blue"
                        className="mt-2"
                      >
                        {vacancy.category}
                      </Tag>
                    </div>

                    <Popconfirm
                      title={t(
                        "ustaDashboard.deleteConfirm.title"
                      )}
                      description={t(
                        "ustaDashboard.deleteConfirm.description"
                      )}
                      okText={t(
                        "ustaDashboard.deleteConfirm.yes"
                      )}
                      cancelText={t(
                        "ustaDashboard.deleteConfirm.no"
                      )}
                      okButtonProps={{
                        danger: true,
                        loading:
                          deleteLoading,
                      }}
                      onConfirm={() =>
                        handleDelete(
                          vacancy._id
                        )
                      }
                    >
                      <Button
                        danger
                        type="text"
                        icon={
                          <DeleteOutlined />
                        }
                      />
                    </Popconfirm>
                  </div>

                  {/* LOCATION */}

                  <div className="mt-5 flex items-center gap-2 text-gray-600">
                    <EnvironmentOutlined />

                    <span>
                      {vacancy.location}
                    </span>
                  </div>

                  {/* PRICE */}

                  <div className="mt-3">
                    <span className="text-sm text-gray-400">
                      {t("ustaDashboard.vacancy.price")}
                    </span>

                    <p className="text-lg font-semibold text-blue-600">
                      {vacancy.price ||
                        t("common.negotiable")}
                    </p>
                  </div>

                  {/* DESCRIPTION */}

                  <div className="mt-4">
                    <p className="text-sm text-gray-500 line-clamp-3">
                      {vacancy.description}
                    </p>
                  </div>

                  {/* CONTACT */}

                  <div className="mt-5 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-gray-600">
                      <PhoneOutlined />

                      <span>
                        {vacancy.contactPhone}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600 mt-2">
                      <SendOutlined />

                      <span>
                        @
                        {vacancy.telegram?.replace(
                          "@",
                          ""
                        )}
                      </span>
                    </div>
                  </div>

                  {/* ACTIONS */}

                  <div className="flex gap-3 mt-5">
                    <Button
                      type="primary"
                      icon={
                        <EditOutlined />
                      }
                      onClick={() =>
                        handleEdit(
                          vacancy._id
                        )
                      }
                    >
                      {t("common.edit")}
                    </Button>

                    <Button
                      onClick={() =>
                        handleDetail(
                          vacancy._id
                        )
                      }
                    >
                      {t("common.viewDetail")}
                    </Button>
                  </div>
                </Card>
              )
            )}
          </div>
        )}
      </div>

      {/* PROFILE MODAL */}

      <Modal
        title={t(
          "ustaDashboard.profileModal.title"
        )}
        open={profileModalOpen}
        onCancel={handleCloseProfile}
        footer={null}
        destroyOnHidden
        width={520}
      >

        {/* PROFILE SECTION */}

        <div className="mb-5">
          <h3 className="text-lg font-semibold text-gray-800">
            {t(
              "ustaDashboard.profileModal.personalTitle"
            )}
          </h3>

          <p className="text-gray-500 mt-1">
            {t(
              "ustaDashboard.profileModal.personalDescription"
            )}
          </p>
        </div>

        <Form
          form={profileForm}
          layout="vertical"
          onFinish={
            handleUpdateProfile
          }
          requiredMark={false}
        >

          {/* NAME */}

          <Form.Item
            label={t(
              "ustaDashboard.form.name"
            )}
            name="name"
            rules={[
              {
                required: true,
                message: t(
                  "ustaDashboard.validation.nameRequired"
                ),
              },
              {
                min: 2,
                message: t(
                  "ustaDashboard.validation.nameMin"
                ),
              },
            ]}
          >
            <Input
              size="large"
              placeholder={t(
                "ustaDashboard.form.namePlaceholder"
              )}
              prefix={
                <UserOutlined />
              }
            />
          </Form.Item>

          {/* PHONE */}

          <Form.Item
            label={t(
              "ustaDashboard.form.phone"
            )}
            name="phone"
            rules={[
              {
                required: true,
                message: t(
                  "ustaDashboard.validation.phoneRequired"
                ),
              },
            ]}
          >
            <Input
              size="large"
              placeholder="+998 90 123 45 67"
              prefix={
                <PhoneOutlined />
              }
            />
          </Form.Item>

          {/* PROFESSION */}

          <Form.Item
            label={t(
              "ustaDashboard.form.profession"
            )}
            name="profession"
            rules={[
              {
                required: true,
                message: t(
                  "ustaDashboard.validation.professionRequired"
                ),
              },
              {
                min: 2,
                message: t(
                  "ustaDashboard.validation.professionMin"
                ),
              },
            ]}
          >
            <Input
              size="large"
              placeholder={t(
                "ustaDashboard.form.professionPlaceholder"
              )}
              prefix={
                <UserOutlined />
              }
            />
          </Form.Item>

          <div className="flex justify-end mt-5">
            <Button
              type="primary"
              htmlType="submit"
              loading={profileLoading}
              icon={
                <EditOutlined />
              }
            >
              {t(
                "ustaDashboard.form.saveProfile"
              )}
            </Button>
          </div>
        </Form>

        <Divider />

        {/* PASSWORD SECTION */}

        <div className="mb-5">
          <h3 className="text-lg font-semibold text-gray-800">
            {t(
              "ustaDashboard.password.title"
            )}
          </h3>

          <p className="text-gray-500 mt-1">
            {t(
              "ustaDashboard.password.description"
            )}
          </p>
        </div>

        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={
            handleChangePassword
          }
          requiredMark={false}
        >

          {/* CURRENT PASSWORD */}

          <Form.Item
            label={t(
              "ustaDashboard.password.current"
            )}
            name="currentPassword"
            rules={[
              {
                required: true,
                message: t(
                  "ustaDashboard.validation.currentPasswordRequired"
                ),
              },
            ]}
          >
            <Input.Password
              size="large"
              placeholder={t(
                "ustaDashboard.password.currentPlaceholder"
              )}
              prefix={
                <LockOutlined />
              }
            />
          </Form.Item>

          {/* NEW PASSWORD */}

          <Form.Item
            label={t(
              "ustaDashboard.password.new"
            )}
            name="newPassword"
            rules={[
              {
                required: true,
                message: t(
                  "ustaDashboard.validation.newPasswordRequired"
                ),
              },
              {
                min: 6,
                message: t(
                  "ustaDashboard.validation.newPasswordMin"
                ),
              },
            ]}
          >
            <Input.Password
              size="large"
              placeholder={t(
                "ustaDashboard.password.newPlaceholder"
              )}
              prefix={
                <LockOutlined />
              }
            />
          </Form.Item>

          {/* CONFIRM PASSWORD */}

          <Form.Item
            label={t(
              "ustaDashboard.password.confirm"
            )}
            name="confirmPassword"
            dependencies={[
              "newPassword",
            ]}
            rules={[
              {
                required: true,
                message: t(
                  "ustaDashboard.validation.confirmPasswordRequired"
                ),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (
                    !value ||
                    getFieldValue(
                      "newPassword"
                    ) === value
                  ) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error(
                      t(
                        "ustaDashboard.validation.passwordMismatch"
                      )
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password
              size="large"
              placeholder={t(
                "ustaDashboard.password.confirmPlaceholder"
              )}
              prefix={
                <LockOutlined />
              }
            />
          </Form.Item>

          <div className="flex justify-end">
            <Button
              type="primary"
              htmlType="submit"
              loading={passwordLoading}
              icon={
                <LockOutlined />
              }
            >
              {t(
                "ustaDashboard.password.change"
              )}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

