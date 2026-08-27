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
        "relative border-r border-black/5 bg-white/40 backdrop-blur-xl h-screen flex flex-col overflow-hidden",
        "shadow-[8px_0_32px_rgba(15,23,42,0.06)]",
        "transition-[width] duration-500 ease-smooth",
        collapsed ? "w-20" : "w-64",
      )}
    >
      {/* ambient glow layer — same soft mint wash as the dashboard cards */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-emerald-400/8 to-transparent" />
        <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-emerald-400/10 blur-[100px]" />
        <div className="absolute bottom-0 -right-16 h-64 w-64 rounded-full bg-teal-300/10 blur-[100px]" />
      </div>

      <div className="relative p-4 border-b border-black/5 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center animate-fade-in">
            <span className="text-2xl font-bold text-gradient-primary">
              Insta Attend
            </span>
          </div>
        )}
        {collapsed && (
          <div className="flex items-center mx-auto animate-scale-in">
            <span className="text-2xl font-bold text-gradient-primary">IA</span>
          </div>
        )}
        <button
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="text-slate-400 hover:text-emerald-600 rounded-md p-1 transition-all duration-300 ease-smooth hover:bg-emerald-500/10 active:scale-90 focus-ring"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={cn(
              "h-6 w-6 transition-transform duration-500 ease-smooth",
              collapsed && "rotate-180",
            )}
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
        </button>
      </div>

      <nav className="relative flex-1 pt-6 overflow-y-auto">
        <ul className="stagger-children">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <li key={item.name} className="mb-2 px-4">
                <Link
                  to={item.path}
                  title={collapsed ? item.name : undefined}
                  className={cn(
                    "group relative flex items-center px-4 py-3 rounded-lg overflow-hidden",
                    "text-slate-600 transition-all duration-300 ease-smooth",
                    "hover:bg-emerald-500/10 hover:text-emerald-700 hover:translate-x-1",
                    active &&
                      "bg-emerald-500/10 text-emerald-700 font-medium shadow-[0_0_20px_rgba(16,185,129,0.12)]",
                  )}
                >
                  {/* active indicator bar */}
                  <span
                    className={cn(
                      "absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-gradient-to-b from-emerald-400 to-teal-400",
                      "transition-all duration-300 ease-spring",
                      active ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0",
                    )}
                  />
                  <item.icon
                    className={cn(
                      "h-5 w-5 shrink-0 transition-transform duration-300 ease-spring",
                      "group-hover:scale-110",
                      active && "scale-110",
                    )}
                  />
                  {!collapsed && (
                    <span className="ml-4 whitespace-nowrap">{item.name}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="relative p-4 border-t border-black/5">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-700 font-semibold transition-transform duration-300 ease-spring hover:scale-110">
            {roleInitial}
          </div>
          {!collapsed && currentUser && (
            <div className="ml-3 animate-fade-in">
              <p className="text-sm font-medium text-slate-800">
                {currentUser.username}
              </p>
              <p className="text-xs text-slate-400">
                {currentUser.email}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;