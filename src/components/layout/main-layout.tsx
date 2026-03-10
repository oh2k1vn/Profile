import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { BottomNav } from "./bottom-nav";
import { Header } from "./header";

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  const getHeaderConfig = () => {
    switch (path) {
      case "/":
        return {
          title: "Dashboard",
          transparent: false,
        };
      case "/tasks":
        return {
          title: "Nhiệm vụ",
          transparent: false,
        };
      case "/campaigns":
        return {
          title: "Chiến dịch",
          transparent: false,
        };
      case "/rewards":
        return {
          title: "Kho Quà",

          transparent: false,
        };
      case "/profile":
        return {
          title: "Cá nhân",
          transparent: true,
        };
      default:
        return { title: "Loyalty App" };
    }
  };

  const headerConfig = getHeaderConfig();

  return (
    <div className="min-h-screen bg-zmp text-zmp-primary flex flex-col relative overflow-hidden font-sans pt-safe">
      <Header
        title={headerConfig.title}
        transparent={headerConfig.transparent}
      />

      {/* Background Decorative Soft Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[40%] bg-blue-400/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[60%] h-[50%] bg-indigo-400/10 blur-[150px] rounded-full pointer-events-none" />

      <main className="flex-1 relative flex flex-col pt-14 pb-32 overflow-hidden">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
};
