import {
  FaBell,
  FaUserCircle,
  FaChevronDown,
} from "react-icons/fa";

export default function AdminHeader() {
  const admin = JSON.parse(
    localStorage.getItem("admin") || "null"
  );

  const adminName = admin?.name || "Admin";

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6">

      {/* LEFT */}

      <div>
        <h1 className="text-xl font-bold text-navy">
          Admin Panel
        </h1>

        <p className="text-sm text-gray-400 mt-1">
          Usta Platform boshqaruv tizimi
        </p>
      </div>

      {/* RIGHT */}

      <div className="flex items-center gap-5">

        {/* NOTIFICATION */}

        <button
          type="button"
          className="relative w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-blue-50 hover:text-brand transition-colors"
          aria-label="Bildirishnomalar"
        >
          <FaBell />

          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
        </button>

        {/* PROFILE */}

        <div className="flex items-center gap-3 pl-5 border-l border-gray-100">

          <div className="w-10 h-10 rounded-full bg-blue-50 text-brand flex items-center justify-center text-lg">
            <FaUserCircle />
          </div>

          <div className="hidden sm:block">

            <p className="text-sm font-semibold text-navy">
              {adminName}
            </p>

            <p className="text-xs text-gray-400">
              Administrator
            </p>

          </div>

          <button
            type="button"
            className="text-gray-400 hover:text-navy transition-colors"
            aria-label="Profil menyusi"
          >
            <FaChevronDown size={12} />
          </button>

        </div>

      </div>

    </header>
  );
}

