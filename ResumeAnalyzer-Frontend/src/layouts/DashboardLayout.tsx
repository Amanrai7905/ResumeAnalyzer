import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-linear-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">

            <button
                type="button"
                aria-label="Close navigation menu"
                onClick={() => setMobileOpen(false)}
                className={`fixed inset-0 z-40 bg-slate-950/50 transition-opacity sm:hidden ${
                    mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
            />

            {/* Desktop sidebar */}
            <div className="hidden sm:block shrink-0 z-40">
                <Sidebar
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                />
            </div>

            {/* Mobile off-canvas sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-[min(18rem,85vw)] transform transition-transform duration-300 sm:hidden ${
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

            {/* Scrollable Dashboard Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-4 sm:p-6 lg:p-8">
                    <button
                        type="button"
                        aria-label="Open navigation menu"
                        aria-expanded={mobileOpen}
                        onClick={() => setMobileOpen(true)}
                        className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-xl text-slate-700 shadow-sm transition hover:bg-slate-50 sm:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                        ☰
                    </button>
                    <Outlet />
                </div>
            </main>

        </div>
    );
}