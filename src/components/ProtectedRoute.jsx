import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const role = localStorage.getItem("role");

  // Login qilmagan
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Faqat usta dashboardga kira oladi
  if (role !== "usta") {
    return <Navigate to="/" replace />;
  }

  return children;
}