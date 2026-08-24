import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import {
  Users,
  Calendar,
  CalendarDays,
  Receipt,
  Clock,
  Settings,
  GridIcon,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { authService } from "../../api/services/auth.service.js";

const Sidebar = ({ collapsed, onToggle }) => {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", icon: GridIcon, path: "/" },
    { name: "Employees", icon: Users, path: "/employees" },
    { name: "Attendance", icon: Clock, path: "/attendance" },
    { name: "Expense", icon: Receipt, path: "/expense" },
    { name: "Leave", icon: Calendar, path: "/leave" },
    { name: "Calendar", icon: CalendarDays, path: "/calendar" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  const currentUser = authService.getCurrentUser();
  const designationName = currentUser?.designation?.designation_name;
  const roleInitial = designationName
    ? designationName
        .split(" ")
        .map((word) => word[0]?.toUpperCase())
        .join("")
    : "U";

  return (
    <aside
      className={cn(
        "bg-white border-r border-gray-200 h-screen transition-all duration-300 flex flex-col",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <div className="p-4 border-b flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center">
            <span className="text-2xl font-bold text-instattend-500">
              Insta Attend
            </span>
          </div>
        )}
        {collapsed && (
          <div className="flex items-center mx-auto">
            <span className="text-2xl font-bold text-instattend-500">IA</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          {collapsed ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          )}
        </button>
      </div>
      <nav className="flex-1 pt-6">
        <ul>
          {navItems.map((item) => (
            <li key={item.name} className="mb-2 px-4">
              <Link
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-3 text-gray-600 rounded-lg hover:bg-instattend-50 hover:text-instattend-500",
                  location.pathname === item.path &&
                    "bg-instattend-50 text-instattend-500",
                )}
              >
                <item.icon className={cn("h-5 w-5")} />
                {!collapsed && <span className="ml-4">{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-instattend-200 flex items-center justify-center text-instattend-700 font-medium">
            {roleInitial}
          </div>
          {!collapsed && currentUser && (
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">
                {currentUser.username}
              </p>
              <p className="text-xs text-gray-500">{currentUser.email}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
