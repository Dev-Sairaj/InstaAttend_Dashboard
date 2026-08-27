import { useEffect, useRef, useState } from "react";
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
  const itemRefs = useRef({});
  const [indicatorTop, setIndicatorTop] = useState(null);

  const navItems = [
    { name: "Dashboard", icon: GridIcon, path: "/" },
    { name: "Employees", icon: Users, path: "/employees" },
    { name: "Attendance", icon: Clock, path: "/attendance" },
    { name: "Expense", icon: Receipt, path: "/expense" },
    { name: "Leave", icon: Calendar, path: "/leave" },
    { name: "Calendar", icon: CalendarDays, path: "/calendar" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  // A single indicator slides between items instead of each item
  // toggling its own bar on/off — reads as motion, not a color swap.
  useEffect(() => {
    const activeItem = navItems.find((item) => item.path === location.pathname);
    const el = activeItem ? itemRefs.current[activeItem.path] : null;
    if (el) {
      setIndicatorTop(el.offsetTop + el.offsetHeight / 2 - 12);
    } else {
      setIndicatorTop(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, collapsed]);

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
        "relative border-r border-border bg-card h-screen flex flex-col overflow-hidden",
        "shadow-soft",
        "transition-[width] duration-500 ease-smooth",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <div className="relative p-4 border-b border-border flex items-center justify-between">
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
          className="text-muted-foreground hover:text-primary rounded-md p-1 transition-all duration-300 ease-smooth hover:bg-primary/10 active:scale-90 focus-ring"
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
        <ul className="relative stagger-children">
          {/* shared sliding indicator */}
          <span
            className="absolute left-4 w-1 rounded-r-full bg-gradient-primary transition-[top,opacity] duration-350 ease-spring pointer-events-none"
            style={{
              top: indicatorTop ?? 0,
              height: 24,
              opacity: indicatorTop === null ? 0 : 1,
            }}
          />
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <li
                key={item.name}
                className="mb-2 px-4"
                ref={(el) => {
                  itemRefs.current[item.path] = el;
                }}
              >
                <Link
                  to={item.path}
                  title={collapsed ? item.name : undefined}
                  className={cn(
                    "group relative flex items-center px-4 py-3 rounded-lg overflow-hidden",
                    "text-muted-foreground transition-all duration-300 ease-smooth",
                    "hover:bg-primary/10 hover:text-primary hover:translate-x-1",
                    active &&
                      "bg-primary/10 text-primary font-medium shadow-glow",
                  )}
                >
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

      <div className="relative p-4 border-t border-border">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-semibold transition-transform duration-300 ease-spring hover:scale-110">
            {roleInitial}
          </div>
          {!collapsed && currentUser && (
            <div className="ml-3 animate-fade-in">
              <p className="text-sm font-medium text-foreground">
                {currentUser.username}
              </p>
              <p className="text-xs text-muted-foreground">
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
