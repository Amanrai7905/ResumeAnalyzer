import { useTheme } from "../context/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => {
        // eslint-disable-next-line no-console
        console.debug('[ThemeToggle] click, current theme=', theme);
        try {
          toggleTheme();
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error('[ThemeToggle] toggle failed', e);
        }
      }}
      className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-950/80 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
    >
      {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}
