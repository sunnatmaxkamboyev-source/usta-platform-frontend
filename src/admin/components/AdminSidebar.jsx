import { NavLink } from "react-router-dom";

import {
  FaChartPie,
  FaUserTie,
  FaBriefcase,
  FaCog,
  FaSignOutAlt,
  FaHome,
} from "react-icons/fa";


const menuItems = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <FaChartPie />,
  },
  {
    label: "Ustalar",
    path: "/admin/masters",
    icon: <FaUserTie />,
  },
  {
    label: "Vakansiyalar",
    path: "/admin/vacancies",
    icon: <FaBriefcase />,
  },
];


export default function AdminSidebar() {

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin");

    window.location.href = "/admin/login";
  };


  return (
    <aside className="w-64 min-h-screen bg-navy text-white flex flex-col">

      {/* =========================
          LOGO
      ========================== */}

      <div className="h-20 px-6 flex items-center border-b border-white/10">

        <NavLink
          to="/admin/dashboard"
          className="flex items-center gap-3"
        >

          <span className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center">
            <FaHome />
          </span>

          <div>

            <h1 className="font-bold text-lg">
              Usta Platform
            </h1>

            <p className="text-xs text-gray-400">
              Admin Panel
            </p>

          </div>

        </NavLink>

      </div>


      {/* =========================
          MENU
      ========================== */}

      <nav className="flex-1 px-4 py-6">

        <p className="text-xs uppercase tracking-wider text-gray-500 px-3 mb-3">
          Asosiy menyu
        </p>


        <div className="space-y-2">

          {menuItems.map((item) => (

            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-brand text-white shadow-lg"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >

              <span className="text-lg">
                {item.icon}
              </span>

              <span className="text-sm font-medium">
                {item.label}
              </span>

            </NavLink>

          ))}

        </div>


        {/* =========================
            SETTINGS
        ========================== */}

        <div className="mt-8">

          <p className="text-xs uppercase tracking-wider text-gray-500 px-3 mb-3">
            Tizim
          </p>


          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-brand text-white"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`
            }
          >

            <FaCog />

            <span className="text-sm font-medium">
              Sozlamalar
            </span>

          </NavLink>

        </div>

      </nav>


      {/* =========================
          BOTTOM
      ========================== */}

      <div className="p-4 border-t border-white/10">

        {/* SAYTGA QAYTISH */}

        <NavLink
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition-all"
        >

          <FaHome />

          <span className="text-sm">
            Saytga qaytish
          </span>

        </NavLink>


        {/* LOGOUT */}

        <button
          type="button"
          onClick={handleLogout}
          className="w-full mt-2 flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-all"
        >

          <FaSignOutAlt />

          <span className="text-sm font-medium">
            Chiqish
          </span>

        </button>

      </div>

    </aside>
  );
}

