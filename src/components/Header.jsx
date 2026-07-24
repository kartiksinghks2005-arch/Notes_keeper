import {
  FaRegLightbulb,
  FaSearch,
  FaMoon,
  FaSun,
  FaTrash,
  FaArchive,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

function Header({
  search,
  setSearch,
  darkMode,
  setDarkMode,
  onLogout,
  user,
}) {
  const location = useLocation();

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-lg shadow-lg transition-all duration-300 ${
        darkMode
          ? "border-gray-700 bg-gray-900/90"
          : "border-yellow-200 bg-yellow-400/95"
      }`}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">

        <Link to="/" className="flex items-center gap-3">
          <div className="rounded-2xl bg-white/20 p-2">
            <FaRegLightbulb className="text-3xl text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Keeper</h1>
            <p className="text-xs text-yellow-100">Capture ideas instantly</p>
          </div>
        </Link>

        <div className="relative order-3 w-full lg:order-2 lg:max-w-md">
          <FaSearch className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-400":"text-gray-500"}`} />
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            className={`w-full rounded-2xl py-3 pl-12 pr-4 shadow-lg outline-none transition-all focus:scale-[1.02] ${
              darkMode
                ? "bg-gray-800 text-white placeholder-gray-400"
                : "bg-white text-gray-800"
            }`}
          />
        </div>

        <div className="order-2 flex items-center gap-3 lg:order-3">
          {user?.photo && (
            <img
              src={user.photo}
              alt={user.name}
              title={user.name}
              referrerPolicy="no-referrer"
              className="h-11 w-11 rounded-full border-2 border-white object-cover shadow-lg"
            />
          )}

          <div className="hidden xl:block">
            <p className="font-semibold text-white">{user?.name}</p>
            <p className="text-xs text-yellow-100">{user?.email}</p>
          </div>

          <Link
            to="/archive"
            className={`flex h-11 w-11 items-center justify-center rounded-xl shadow-md transition hover:-translate-y-1 ${
              location.pathname === "/archive"
                ? "bg-blue-500 text-white"
                : darkMode
                ? "bg-gray-800 text-white hover:bg-gray-700"
                : "bg-white text-blue-500 hover:bg-blue-100"
            }`}
          >
            <FaArchive />
          </Link>

          <Link
            to="/trash"
            className={`flex h-11 w-11 items-center justify-center rounded-xl shadow-md transition hover:-translate-y-1 ${
              location.pathname === "/trash"
                ? "bg-red-500 text-white"
                : darkMode
                ? "bg-gray-800 text-white hover:bg-gray-700"
                : "bg-white text-red-500 hover:bg-red-100"
            }`}
          >
            <FaTrash />
          </Link>

          <button
            onClick={()=>setDarkMode(!darkMode)}
            className={`flex h-11 w-11 items-center justify-center rounded-xl shadow-md transition hover:-translate-y-1 ${
              darkMode
                ? "bg-yellow-400 text-white hover:bg-yellow-500"
                : "bg-white text-yellow-500 hover:bg-yellow-100"
            }`}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

          <button
            onClick={onLogout}
            className={`flex h-11 w-11 items-center justify-center rounded-xl shadow-md transition hover:-translate-y-1 ${
              darkMode
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-white text-red-500 hover:bg-red-100"
            }`}
          >
            <FaSignOutAlt />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
