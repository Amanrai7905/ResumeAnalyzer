import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const { logout } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-slate-950">
      
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Dashboard
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Analyze and manage your resumes
        </p>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <button
          type="button"
          onClick={logout}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          Logout
        </button>
      </div>

    </header>
  );
}