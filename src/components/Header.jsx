import { useEffect, useState } from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  FaHome,
  FaUserCircle,
  FaBriefcase,
  FaInfoCircle,
  FaTools,
  FaBookOpen,
  FaPhoneAlt,
} from "react-icons/fa";

import {
  HiMenuAlt3,
  HiX,
} from "react-icons/hi";

import { useTranslation } from "react-i18next";

import { getCurrentUser } from "../utils/auth";

export default function Header() {
  const { t, i18n } = useTranslation();

  const [menuOpen, setMenuOpen] = useState(false);

  const [user, setUser] = useState(
    getCurrentUser()
  );

  const navigate = useNavigate();
  const location = useLocation();

  // ========================================
  // LOGIN HOLATINI TEKSHIRISH
  // ========================================

  useEffect(() => {
    const checkUser = () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
    };

    checkUser();

    window.addEventListener(
      "storage",
      checkUser
    );

    return () => {
      window.removeEventListener(
        "storage",
        checkUser
      );
    };
  }, [location.pathname]);

  // ========================================
  // TILNI O'ZGARTIRISH
  // ========================================

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);

    localStorage.setItem(
      "usta_language",
      language
    );
  };

  // ========================================
  // LANDING PAGE SECTIONIGA O'TISH
  // ========================================

  const goToSection = (sectionId) => {
    setMenuOpen(false);

    // Agar hozir Home sahifada bo'lsak
    if (location.pathname === "/") {
      const element =
        document.getElementById(sectionId);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      return;
    }

    // Boshqa sahifada bo'lsak
    navigate(`/#${sectionId}`);
  };

  // ========================================
  // LOGO BOSILGANDA
  // ========================================

  const handleLogoClick = () => {
    setMenuOpen(false);

    if (location.pathname === "/") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <header className="bg-navy text-white sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* =========================
            LOGO
        ========================== */}

        <Link
          to="/"
          onClick={handleLogoClick}
          className="flex items-center gap-2 font-bold text-lg"
        >
          <span className="w-7 h-7 rounded-full bg-brand flex items-center justify-center text-white text-sm">
            <FaHome />
          </span>

          Usta Platform
        </Link>

        {/* =========================
            DESKTOP NAV
        ========================== */}

        <nav className="hidden md:flex items-center gap-7 text-sm text-gray-200">

          {/* VAKANSIYALAR */}

          <Link
            to="/vakansiyalar"
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <FaBriefcase />

            {t("navbar.vacancies")}
          </Link>

          {/* BIZ HAQIMIZDA */}

          <button
            type="button"
            onClick={() =>
              goToSection("about")
            }
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <FaInfoCircle />

            {t("navbar.about")}
          </button>

          {/* XIZMATLAR */}

          <button
            type="button"
            onClick={() =>
              goToSection("services")
            }
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <FaTools />

            {t("navbar.services")}
          </button>

          {/* BLOG */}

          <button
            type="button"
            onClick={() =>
              goToSection("blog")
            }
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <FaBookOpen />

            {t("navbar.blog")}
          </button>

          {/* ALOQA */}

          <button
            type="button"
            onClick={() =>
              goToSection("contact")
            }
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <FaPhoneAlt />

            {t("navbar.contact")}
          </button>

        </nav>

        {/* =========================
            RIGHT SIDE
        ========================== */}

        <div className="hidden md:flex items-center gap-5 text-sm">

          {/* TIL ALMASHTIRISH */}

          <div className="flex items-center gap-1 bg-white/10 rounded-full p-1">

            <button
              type="button"
              onClick={() =>
                changeLanguage("uz")
              }
              className={`px-3 py-1 rounded-full transition-colors ${
                i18n.language === "uz"
                  ? "bg-brand text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              UZ
            </button>

            <button
              type="button"
              onClick={() =>
                changeLanguage("ru")
              }
              className={`px-3 py-1 rounded-full transition-colors ${
                i18n.language === "ru"
                  ? "bg-brand text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              RU
            </button>

            <button
              type="button"
              onClick={() =>
                changeLanguage("en")
              }
              className={`px-3 py-1 rounded-full transition-colors ${
                i18n.language === "en"
                  ? "bg-brand text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              EN
            </button>

          </div>

          {/* 24 SOAT */}

          <span className="flex items-center gap-2">

            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />

            {t("navbar.service24")}

          </span>

          {/* AUTH */}

          {user ? (
            <Link
              to="/dashboard"
              className="flex items-center gap-2 bg-brand hover:bg-brand-dark transition-colors rounded-full px-4 py-2 font-medium"
            >
              <FaUserCircle />

              {t("navbar.masterPanel")}
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 bg-brand hover:bg-brand-dark transition-colors rounded-full px-4 py-2 font-medium"
            >
              <FaUserCircle />

              {t("navbar.masterLogin")}
            </Link>
          )}

        </div>

        {/* =========================
            MOBILE MENU BUTTON
        ========================== */}

        <button
          type="button"
          className="md:hidden text-2xl"
          onClick={() =>
            setMenuOpen(
              (open) => !open
            )
          }
          aria-label={t(
            "navbar.menu"
          )}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <HiX />
          ) : (
            <HiMenuAlt3 />
          )}
        </button>

      </div>

      {/* =========================
          MOBILE MENU
      ========================== */}

      {menuOpen && (
        <nav className="md:hidden flex flex-col gap-4 px-6 pb-6 text-gray-200">

          {/* VAKANSIYALAR */}

          <Link
            to="/vakansiyalar"
            onClick={() =>
              setMenuOpen(false)
            }
            className="flex items-center gap-2 hover:text-white"
          >
            <FaBriefcase />

            {t("navbar.vacancies")}
          </Link>

          {/* BIZ HAQIMIZDA */}

          <button
            type="button"
            onClick={() =>
              goToSection("about")
            }
            className="flex items-center gap-2 hover:text-white text-left"
          >
            <FaInfoCircle />

            {t("navbar.about")}
          </button>

          {/* XIZMATLAR */}

          <button
            type="button"
            onClick={() =>
              goToSection("services")
            }
            className="flex items-center gap-2 hover:text-white text-left"
          >
            <FaTools />

            {t("navbar.services")}
          </button>

          {/* BLOG */}

          <button
            type="button"
            onClick={() =>
              goToSection("blog")
            }
            className="flex items-center gap-2 hover:text-white text-left"
          >
            <FaBookOpen />

            {t("navbar.blog")}
          </button>

          {/* ALOQA */}

          <button
            type="button"
            onClick={() =>
              goToSection("contact")
            }
            className="flex items-center gap-2 hover:text-white text-left"
          >
            <FaPhoneAlt />

            {t("navbar.contact")}
          </button>

          {/* TIL */}

          <div className="flex items-center gap-2 pt-3 border-t border-white/10">

            <span className="text-sm">
              {t("navbar.language")}:
            </span>

            <button
              type="button"
              onClick={() =>
                changeLanguage("uz")
              }
              className={`px-3 py-1 rounded-full ${
                i18n.language === "uz"
                  ? "bg-brand text-white"
                  : "bg-white/10 text-gray-300"
              }`}
            >
              UZ
            </button>

            <button
              type="button"
              onClick={() =>
                changeLanguage("ru")
              }
              className={`px-3 py-1 rounded-full ${
                i18n.language === "ru"
                  ? "bg-brand text-white"
                  : "bg-white/10 text-gray-300"
              }`}
            >
              RU
            </button>

            <button
              type="button"
              onClick={() =>
                changeLanguage("en")
              }
              className={`px-3 py-1 rounded-full ${
                i18n.language === "en"
                  ? "bg-brand text-white"
                  : "bg-white/10 text-gray-300"
              }`}
            >
              EN
            </button>

          </div>

          {/* 24 SOAT */}

          <div className="flex items-center gap-2 text-sm pt-3 border-t border-white/10">

            <span className="w-2 h-2 rounded-full bg-red-500" />

            {t("navbar.service24")}

          </div>

          {/* AUTH BUTTON */}

          {user ? (
            <Link
              to="/dashboard"
              onClick={() =>
                setMenuOpen(false)
              }
              className="flex items-center gap-2 bg-brand rounded-full px-4 py-2 font-medium w-fit"
            >
              <FaUserCircle />

              {t("navbar.masterPanel")}
            </Link>
          ) : (
            <Link
              to="/login"
              onClick={() =>
                setMenuOpen(false)
              }
              className="flex items-center gap-2 bg-brand rounded-full px-4 py-2 font-medium w-fit"
            >
              <FaUserCircle />

              {t("navbar.masterLogin")}
            </Link>
          )}

        </nav>
      )}
    </header>
  );
}