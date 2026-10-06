import { Navigate } from "react-router-dom";

export default function AdminProtectedRoute({ children }) {
  const adminToken = localStorage.getItem("admin_token");
  const admin = localStorage.getItem("admin");

  if (!adminToken || !admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

