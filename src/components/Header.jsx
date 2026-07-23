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
      className={`sticky top-0 z-50 shadow-md transition-all duration-300 ${
        darkMode ? "bg-gray-800" : "bg-yellow-400"
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <FaRegLightbulb className="text-3xl text-white" />
          <h1 className="text-3xl font-bold text-white">
            Keeper
          </h1>
        </Link>

        {/* Search */}
        <div className="relative w-full md:w-96">
          <FaSearch
            className={`absolute left-4 top-1/2 -translate-y-1/2 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          />

          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full rounded-full py-3 pl-11 pr-4 outline-none shadow-md transition ${
              darkMode
                ? "bg-gray-700 text-white placeholder-gray-400"
                : "bg-white text-black"
            }`}
          />
        </div>

        <div className="flex items-center gap-3">
          {user?.photo && (
  <img
  src={user.photo}
  alt={user.name}
  title={user.name}
  referrerPolicy="no-referrer"
  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
  onError={(e) => {
    console.log("Image failed:", user.photo);
    e.currentTarget.style.display = "none";
  }}
/>
)}
{user?.name && (
  <div className="hidden md:flex flex-col mr-2">
    <span className="text-sm font-semibold text-white">
      {user.name}
    </span>
    <span className="text-xs text-yellow-100">
      {user.email}
    </span>
  </div>
)}

          {/* Archive */}
          <Link
            to="/archive"
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition ${
              location.pathname === "/archive"
                ? "bg-blue-500 text-white"
                : darkMode
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-white text-blue-500 hover:bg-blue-100"
            }`}
          >
            <FaArchive />
          </Link>

          {/* Trash */}
          <Link
            to="/trash"
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition ${
              location.pathname === "/trash"
                ? "bg-red-500 text-white"
                : darkMode
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-white text-red-500 hover:bg-red-100"
            }`}
          >
            <FaTrash />
          </Link>

          {/* Theme */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
              darkMode
                ? "bg-yellow-400 text-white hover:bg-yellow-500"
                : "bg-white text-yellow-500 hover:bg-yellow-100"
            }`}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          <button
  onClick={onLogout}
  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition ${
    darkMode
      ? "bg-red-500 text-white hover:bg-red-600"
      : "bg-white text-red-500 hover:bg-red-100"
  }`}
  title="Logout"
>
  <FaSignOutAlt />
</button>

        </div>

      </div>
    </header>
  );
}

export default Header;