import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-6 py-5 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500 text-sm font-bold text-white shadow-sm shadow-cyan-500/30">
            RA
          </span>

          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Resume Analyzer
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              &copy; {new Date().getFullYear()} All rights reserved.
            </p>
          </div>
        </div>

        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap items-center gap-2 text-sm"
        >
          <Link
            to="/dashboard"
            className="rounded-lg px-3 py-2 font-medium text-slate-600 transition hover:bg-cyan-50 hover:text-cyan-700 dark:text-slate-300 dark:hover:bg-cyan-950/40 dark:hover:text-cyan-300"
          >
            Dashboard
          </Link>
          <Link
            to="/resumes"
            className="rounded-lg px-3 py-2 font-medium text-slate-600 transition hover:bg-cyan-50 hover:text-cyan-700 dark:text-slate-300 dark:hover:bg-cyan-950/40 dark:hover:text-cyan-300"
          >
            My Resumes
          </Link>
        </nav>
      </div>
    </footer>
  );
}
