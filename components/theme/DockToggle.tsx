"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function DockToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Ensures the component is only rendered on the client
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Prevents rendering on the server
  }

  return (
    theme === "dark" ? (
      <Sun className="size-6 text-yellow-500" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}/>
    ) : (
      <Moon className="size-6 text-gray-800" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}/>
    )
  );
}