import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Hero from "./components/Hero";
import AboutServices from "./components/AboutServices";
import ServicesGrid from "./components/ServicesGrid";
import HomeVacancies from "./components/HomeVacancies";
import GuaranteeBox from "./components/GuaranteeBox";
import HowItWorks from "./components/HowItWorks";
import Reviews from "./components/Reviews";
import Blog from "./components/Blog";
import FAQ from "./components/Faq";
import CTABanner from "./components/CTABanner";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import NewVacancy from "./pages/NewVacancy";
import VacancyDetail from "./pages/VacancyDetail";
import Vacancies from "./pages/Vacancies";
import EditVacancy from "./pages/EditVacancy";
import BlogPage from "./pages/BlogPage";

import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminMasters from "./admin/pages/AdminMasters";
import AdminVacancies from "./admin/pages/AdminVacancies";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminProtectedRoute from "./admin/components/AdminProtectedRoute";
import AdminSettings from "./admin/pages/AdminSettings";

function HomePage() {
  return (
    <>
      <Header />

      <Hero />

      <AboutServices />

      <ServicesGrid />

      <HomeVacancies />

      <GuaranteeBox />

      <HowItWorks />

      <Reviews />

      <Blog />

      <FAQ />

      <CTABanner />

      <Newsletter />

      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      {/* =========================
          PUBLIC ROUTES
      ========================== */}

      <Route
        path="/"
        element={<HomePage />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/vakansiyalar"
        element={<Vacancies />}
      />

      <Route
        path="/vakansiyalar/:id"
        element={<VacancyDetail />}
      />

      <Route
        path="/blog"
        element={<BlogPage />}
      />

      {/* =========================
          USTA ROUTES
      ========================== */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/vacancies/new"
        element={
          <ProtectedRoute>
            <NewVacancy />
          </ProtectedRoute>
        }
      />

      <Route
        path="/vacancies/edit/:id"
        element={
          <ProtectedRoute>
            <EditVacancy />
          </ProtectedRoute>
        }
      />

      {/* =========================
          ADMIN LOGIN
      ========================== */}

      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      {/* =========================
          PROTECTED ADMIN ROUTES
      ========================== */}

      <Route
        path="/admin/dashboard"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/admin/masters"
        element={
          <AdminProtectedRoute>
            <AdminMasters />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/admin/vacancies"
        element={
          <AdminProtectedRoute>
            <AdminVacancies />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/admin/settings"
        element={
          <AdminProtectedRoute>
            <AdminSettings />
          </AdminProtectedRoute>
        }
      />
    </Routes>
  );
}