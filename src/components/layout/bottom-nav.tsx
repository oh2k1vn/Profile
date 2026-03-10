import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ListChecks, Target, Gem, User } from "lucide-react";
import { cn } from "@/utils/cn";

const TABS = [
  { path: "/", id: "home", label: "Trang chủ", icon: Home },
  { path: "/tasks", id: "tasks", label: "Nhiệm vụ", icon: ListChecks },
  { path: "/campaigns", id: "campaigns", label: "Chiến dịch", icon: Target },
  { path: "/rewards", id: "rewards", label: "Đổi quà", icon: Gem },
  { path: "/profile", id: "profile", label: "Tôi", icon: User },
];

export const BottomNav: React.FC = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2 bg-linear-to-t from-zmp via-zmp/80 to-transparent pointer-events-none">
      <div className="mx-auto max-w-md h-16 bg-zmp-card border border-black/5 rounded-[24px] flex items-center justify-around px-2 pointer-events-auto shadow-xl shadow-black/5">
        {TABS.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <Link
              key={tab.id}
              to={tab.path}
              className="relative flex flex-col items-center justify-center w-full h-full outline-none group"
            >
              {/* Active Indicator Bubble */}
              {isActive && (
                <motion.div
                  layoutId="activeTabBg"
                  className="absolute inset-x-1 inset-y-1.5 bg-zmp-blue/10 rounded-2xl z-0"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 450,
                    damping: 35,
                  }}
                />
              )}

              <div
                className={cn(
                  "relative z-10 flex flex-col items-center transition-all duration-300",
                  isActive ? "text-zmp-blue" : "text-zmp-tertiary",
                )}
              >
                <motion.div
                  animate={
                    isActive ? { y: -1, scale: 1.1 } : { y: 0, scale: 1 }
                  }
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                >
                  <tab.icon
                    size={22}
                    className={cn(
                      "transition-all",
                      isActive
                        ? "drop-shadow-[0_0_5px_rgba(0,104,255,0.15)]"
                        : "opacity-80",
                    )}
                  />
                </motion.div>

                <span
                  className={cn(
                    "zmp-caption font-medium transition-all text-[9.5px] mt-0.5 text-current",
                    isActive ? "opacity-100" : "opacity-60",
                  )}
                >
                  {tab.label}
                </span>

                {/* Tiny Active Dot Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeDot"
                    className="absolute -bottom-1.5 w-1 h-1 bg-zmp-blue rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
