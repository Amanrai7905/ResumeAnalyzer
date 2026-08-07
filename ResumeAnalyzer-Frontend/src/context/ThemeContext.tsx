import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ThemeContext } from "./theme";

type Theme = "light" | "dark";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    const stored = window.localStorage.getItem("theme");
    return stored === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    // Apply the class to the document element so Tailwind's `dark:` classes work
    root.classList.toggle("dark", theme === "dark");
    // persist the preference
    window.localStorage.setItem("theme", theme);
    // Debugging aid: log current theme
    // Remove or lower verbosity in production if desired
    // eslint-disable-next-line no-console
    console.debug(`[ThemeProvider] applied theme=\"${theme}\"`);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => {
        // Use functional update to avoid stale closures
        setTheme((current) => {
          const next = current === "dark" ? "light" : "dark";
          // eslint-disable-next-line no-console
          console.debug(`[ThemeProvider] toggle requested, next=\"${next}\"`);
          return next;
        });
      },
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
