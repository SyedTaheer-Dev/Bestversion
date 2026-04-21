import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

const ThemeToggle = () => {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as "dark" | "light") || "dark";
    }
    return "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-9 h-9 rounded-full flex items-center justify-center bg-muted/50 border border-border/50 hover:border-primary/50 transition-all"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun size={16} className="text-primary" /> : <Moon size={16} className="text-primary" />}
    </motion.button>
  );
};

export default ThemeToggle;
