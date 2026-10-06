import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  FaYoutube,
  FaInstagram,
  FaFacebookF,
  FaTelegramPlane,
  FaPhoneAlt,
  FaArrowRight,
} from "react-icons/fa";

export default function Footer() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const companyLinks = [
    {
      label: t("footer.links.about"),
      section: "about",
    },
    {
      label: t("footer.links.services"),
      section: "services",
    },
    {
      label: t("footer.links.blog"),
      section: "blog",
    },
    {
      label: t("footer.links.contact"),
      section: "contact",
    },
  ];

  const legalLinks = [
    t("footer.legal.terms"),
    t("footer.legal.privacy"),
    t("footer.legal.cookies"),
    t("footer.legal.license"),
  ];

  const socialLinks = [
    {
      label: "YouTube",
      icon: <FaYoutube />,
      href: "#",
    },
    {
      label: "Instagram",
      icon: <FaInstagram />,
      href: "#",
    },
    {
      label: "Facebook",
      icon: <FaFacebookF />,
      href: "#",
    },
    {
      label: "Telegram",
      icon: <FaTelegramPlane />,
      href: "#",
    },
  ];

  const goToSection = (section) => {
    if (location.pathname !== "/") {
      navigate(`/#${section}`);
      return;
    }

    const element = document.getElementById(section);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <footer className="bg-navy text-white">
      {/* MAIN FOOTER */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* BRAND */}
          <div>
            <Link
              to="/"
              className="inline-block text-2xl font-black tracking-tight"
            >
              USTA <span className="text-brand">PLATFORM</span>
            </Link>

            <p className="text-white/60 leading-7 text-sm mt-5 max-w-sm">
              {t("footer.description")}
            </p>

            {/* SOCIAL */}
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-brand transition"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* PLATFORM */}
          <div>
            <h3 className="font-bold text-lg mb-5">
              {t("footer.platformTitle")}
            </h3>

            <div className="space-y-3">
              <Link
                to="/vakansiyalar"
                className="block text-sm text-white/60 hover:text-white transition"
              >
                {t("footer.platform.vacancies")}
              </Link>

              <Link
                to="/register"
                className="block text-sm text-white/60 hover:text-white transition"
              >
                {t("footer.platform.becomeMaster")}
              </Link>

              <Link
                to="/login"
                className="block text-sm text-white/60 hover:text-white transition"
              >
                {t("footer.platform.masterLogin")}
              </Link>

              <button
                type="button"
                onClick={() => goToSection("services")}
                className="block text-sm text-white/60 hover:text-white transition"
              >
                {t("footer.links.services")}
              </button>
            </div>
          </div>

          {/* COMPANY */}
          <div>
            <h3 className="font-bold text-lg mb-5">
              {t("footer.companyTitle")}
            </h3>

            <div className="space-y-3">
              {companyLinks.map((item) => (
                <button
                  key={item.section}
                  type="button"
                  onClick={() => goToSection(item.section)}
                  className="block text-sm text-white/60 hover:text-white transition"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="font-bold text-lg mb-5">
              {t("footer.contactTitle")}
            </h3>

            <p className="text-sm text-white/60 leading-6 mb-5">
              {t("footer.contactDescription")}
            </p>

            <a
              href="tel:+998881234567"
              className="inline-flex items-center gap-3 text-white font-semibold hover:text-brand transition"
            >
              <span className="w-10 h-10 rounded-full bg-brand flex items-center justify-center">
                <FaPhoneAlt size={14} />
              </span>

              <span>+998 88 123 45 67</span>
            </a>

            <button
              type="button"
              onClick={() => goToSection("contact")}
              className="mt-5 inline-flex items-center gap-2 text-sm text-brand font-semibold hover:text-white transition"
            >
              {t("footer.contactButton")}
              <FaArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            <p className="text-sm text-white/50 text-center md:text-left">
              {t("footer.copyright")}
            </p>

            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {legalLinks.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="text-xs text-white/40 hover:text-white transition"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}