import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { FiMenu, FiPlus, FiX } from "react-icons/fi";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
            <header className="fixed inset-x-0 top-0 z-40 h-16 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
                <div className="flex h-full items-center">
                    <Link
                        to="/dashboard"
                        aria-label="ResumeAnalyzer dashboard"
                        className={`hidden h-full shrink-0 items-center gap-3 border-r border-slate-200 px-5 transition-[width] duration-300 sm:flex dark:border-slate-800 ${
                            collapsed ? "w-20 justify-center px-2" : "w-64 lg:w-72"
                        }`}
                    >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-600 text-lg font-bold text-white shadow-sm shadow-cyan-900/20">
                            R
                        </span>
                        {!collapsed && (
                            <span className="whitespace-nowrap text-lg font-bold tracking-tight text-slate-950 dark:text-white">
                                Resume<span className="text-cyan-600 dark:text-cyan-400">Analyzer</span>
                            </span>
                        )}
                    </Link>

                    <div className="flex min-w-0 flex-1 items-center justify-between gap-3 px-4 sm:px-5">
                        <div className="flex min-w-0 items-center gap-3">
                            <button
                                type="button"
                                aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
                                aria-expanded={mobileOpen}
                                onClick={() => setMobileOpen((isOpen) => !isOpen)}
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 sm:hidden dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                            >
                                {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                            </button>
                            <Link
                                to="/dashboard"
                                className="flex min-w-0 items-center gap-2 sm:hidden"
                            >
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-600 text-sm font-bold text-white">
                                    R
                                </span>
                                <span className="truncate text-base font-bold tracking-tight text-slate-950 dark:text-white">
                                    Resume<span className="text-cyan-600 dark:text-cyan-400">Analyzer</span>
                                </span>
                            </Link>
                        </div>

                        <Link
                            to="/upload"
                            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-cyan-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 sm:px-4"
                        >
                            <FiPlus size={17} aria-hidden="true" />
                            <span className="hidden sm:inline">Analyze a resume</span>
                            <span className="sm:hidden">Analyze</span>
                        </Link>
                    </div>
                </div>
            </header>

            {mobileOpen && (
                <button
                    type="button"
                    aria-label="Close navigation menu"
                    onClick={() => setMobileOpen(false)}
                    className="fixed inset-x-0 bottom-0 top-16 z-40 bg-slate-950/40 sm:hidden"
                />
            )}

            <div className="fixed inset-x-0 bottom-0 top-16 flex">
                <div className="z-30 hidden h-full shrink-0 sm:block">
                    <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
                </div>

                <div
                    className={`fixed bottom-0 left-0 top-16 z-50 h-[calc(100vh-4rem)] w-[min(18rem,85vw)] transform transition-transform duration-300 ease-out sm:hidden ${
                        mobileOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                >
                    <Sidebar
                        collapsed={false}
                        setCollapsed={setCollapsed}
                        onClose={() => setMobileOpen(false)}
                        onNavigate={() => setMobileOpen(false)}
                    />
                </div>

                <main className="min-w-0 flex-1 overflow-y-auto scroll-smooth">
                    <div className="p-4 sm:p-6 lg:p-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
