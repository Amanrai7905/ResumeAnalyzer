import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-linear-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">

            {/* Fixed Sidebar - Hidden on mobile, visible on sm+ */}
            <div className="hidden sm:block shrink-0 z-40">
                <Sidebar
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                />
            </div>

            {/* Scrollable Dashboard Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </div>
            </main>

        </div>
    );
}