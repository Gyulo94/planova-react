import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { FaMoon, FaSun } from "react-icons/fa6";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
      className="relative group"
    >
      <FaSun className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 dark:scale-100 dark:rotate-0 opacity-70 group-hover:opacity-100 transition-opacity" />
      <FaMoon className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 dark:scale-0 dark:-rotate-90 opacity-70 group-hover:opacity-100 transition-opacity" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
