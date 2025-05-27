"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
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
    <Button
      variant="outline"
      size="icon"
      className="fixed bottom-4 right-4 z-50 p-2 hover:bg-muted rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-background/80 backdrop-blur-md border-border/50 hover:border-primary/30 hover:scale-105 cursor-pointer"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-500 transition-transform duration-300 hover:rotate-12" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] text-gray-800 dark:text-gray-200 transition-transform duration-300 hover:rotate-12" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}