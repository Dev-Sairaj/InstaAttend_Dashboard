import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const MainLayout = ({ children }) => {


  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main key={collapsed ? "c" : "e"} className="flex-1 overflow-y-auto p-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
