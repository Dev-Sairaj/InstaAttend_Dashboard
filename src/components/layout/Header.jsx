import { LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { authService } from "../../api/services/auth.service";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Header = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    authService.logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const currentUser = authService.getCurrentUser();
  const userInitial = currentUser?.username
    ? currentUser.username.charAt(0)
    : "U";

  return (
    // border/60 + a hairline shadow instead of the harder default border —
    // matches the soft mint palette instead of clashing with it.
    <header className="sticky top-0 z-30 h-16 flex items-center justify-end px-6 border-b border-border/60 bg-card/80 backdrop-blur-md supports-[backdrop-filter]:bg-card/70 shadow-[0_1px_0_0_hsl(var(--border))]">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          title={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </Button>
        <div className="hidden md:block h-10 w-px bg-border"></div>
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full gradient-primary text-primary-foreground font-semibold flex items-center justify-center shadow-soft transition-transform duration-300 ease-spring hover:scale-110">
            {userInitial}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium">
              {currentUser?.username || "Admin User"}
            </p>
            <p className="text-xs text-muted-foreground">
              {currentUser?.designation?.designation_name || "Administrator"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
