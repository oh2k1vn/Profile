import { Link, useLocation } from "react-router-dom";
import { Calculator, BookOpen, TrendingUp } from "lucide-react";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";

export function Navbar() {
  const location = useLocation();

  const isVocab = location.pathname.startsWith("/vocab");

  const navItems = [
    {
      path: "/calculator",
      label: "Máy Tính",
      icon: <Calculator className="w-4 h-4" />,
      color: "from-yellow-500 to-orange-500",
      activeColor: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
      visible: !isVocab,
    },
    {
      path: "/journal",
      label: "Nhật Ký",
      icon: <TrendingUp className="w-4 h-4" />,
      color: "from-purple-500 to-blue-500",
      activeColor: "text-purple-400 border-purple-500/30 bg-purple-500/10",
      visible: !isVocab,
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div
            className={cn(
              "p-2 rounded-lg group-hover:rotate-12 transition-transform shadow-lg",
              isVocab
                ? "bg-blue-600 shadow-blue-900/20"
                : "bg-emerald-600 shadow-emerald-900/20",
            )}
          >
            {isVocab ? (
              <BookOpen className="w-5 h-5 text-white" />
            ) : (
              <TrendingUp className="w-5 h-5 text-white" />
            )}
          </div>
          <span className="font-bold text-lg bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">
            {isVocab ? "EnglishHub" : "TraderTool"}
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {navItems
            .filter((item) => item.visible)
            .map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path === "/calculator" && location.pathname === "/");
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border border-transparent",
                    isActive
                      ? item.activeColor
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50",
                  )}
                >
                  {item.icon}
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className={cn(
                        "absolute inset-0 rounded-xl border opacity-50",
                        item.activeColor
                          .split(" ")
                          .find((c) => c.startsWith("border-")),
                      )}
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                </Link>
              );
            })}
        </div>
      </div>
    </nav>
  );
}
