import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { authService } from "../../api/services/auth.service";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const currentUser = authService.getCurrentUser();
  const userInitial = currentUser?.username
    ? currentUser.username.charAt(0)
    : "U";

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-end px-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </Button>
        <div className="hidden md:block h-10 w-px bg-gray-200"></div>
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-instattend-500 text-white flex items-center justify-center">
            {userInitial}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium">
              {currentUser?.username || "Admin User"}
            </p>
            <p className="text-xs text-gray-500">
              {currentUser?.designation?.designation_name || "Administrator"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
