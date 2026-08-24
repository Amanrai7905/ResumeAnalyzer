import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-slate-200 px-6 dark:border-slate-800">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          Resume Analyzer
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `block rounded-lg px-4 py-3 text-sm font-medium transition ${
              isActive
                ? "bg-cyan-500 text-white"
                : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/resumes"
          className={({ isActive }) =>
            `block rounded-lg px-4 py-3 text-sm font-medium transition ${
              isActive
                ? "bg-cyan-500 text-white"
                : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
            }`
          }
        >
          My Resumes
        </NavLink>

      </nav>
    </aside>
  );
}