import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
    collapsed: boolean;
    setCollapsed: (value: boolean) => void;
}

export default function Sidebar({
    collapsed,
    setCollapsed,
}: SidebarProps) {

    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/", { replace: true });
    };

    const menuItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: "🏠",
        },
        {
            name: "My Resumes",
            path: "/resumes",
            icon: "📄",
        },
        {
            name: "Upload Resume",
            path: "/upload",
            icon: "⬆️",
        },
        {
            name: "Profile",
            path: "/profile",
            icon: "👤",
        },
    ];

    return (
        <aside
            className={`flex h-full flex-col border-r border-slate-200 bg-linear-to-b from-white to-slate-50 transition-all duration-300 dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 ${
                collapsed ? "w-16 sm:w-20" : "w-64 sm:w-72"
            }`}
        >

            {/* Sidebar Header */}
            <div
                className={`flex items-center gap-3 border-b border-slate-200 bg-white/50 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/50 ${
                    collapsed
                        ? "justify-center px-3 py-4 sm:px-4"
                        : "justify-between px-4 py-5 sm:px-6"
                }`}
            >

                {!collapsed && (
                    <div className="min-w-0">
                        <h2 className="text-base font-bold bg-linear-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent sm:text-lg">
                            Resume Analyzer
                        </h2>

                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            AI Powered
                        </p>
                    </div>
                )}

                {/* Collapse Button */}
                <button
                    type="button"
                    onClick={() => setCollapsed(!collapsed)}
                    className="shrink-0 rounded-lg p-2 text-slate-600 transition hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800"
                    title={
                        collapsed
                            ? "Expand sidebar"
                            : "Collapse sidebar"
                    }
                >
                    {collapsed ? "☰" : "←"}
                </button>

            </div>


            {/* Menu */}
            <nav className="flex-1 overflow-y-auto px-2 py-4 sm:px-3">

                {!collapsed && (
                    <p className="mb-4 px-3 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                        Menu
                    </p>
                )}

                <div className="space-y-2">

                    {menuItems.map((item) => (

                        <NavLink
                            key={item.path}
                            to={item.path}
                            title={
                                collapsed
                                    ? item.name
                                    : undefined
                            }
                            className={({ isActive }) =>
                                `flex items-center rounded-lg transition duration-200 ${
                                    collapsed
                                        ? "justify-center px-3 py-3"
                                        : "gap-3 px-4 py-3"
                                } ${
                                    isActive
                                        ? "bg-linear-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30 dark:shadow-cyan-500/20"
                                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                                }`
                            }
                        >

                            <span className="text-xl shrink-0">
                                {item.icon}
                            </span>

                            {!collapsed && (
                                <span className="text-sm font-medium">
                                    {item.name}
                                </span>
                            )}

                        </NavLink>

                    ))}

                </div>

            </nav>


            {/* Logout */}
            <div className="border-t border-slate-200 bg-white/50 backdrop-blur-sm px-2 py-3 dark:border-slate-700 dark:bg-slate-900/50 sm:px-3">

                <button
                    type="button"
                    onClick={handleLogout}
                    title={
                        collapsed
                            ? "Logout"
                            : undefined
                    }
                    className={`flex w-full items-center rounded-lg py-3 text-sm font-medium text-red-600 transition duration-200 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 ${
                        collapsed
                            ? "justify-center px-3"
                            : "gap-3 px-4"
                    }`}
                >

                    <span className="text-xl shrink-0">
                        🚪
                    </span>

                    {!collapsed && (
                        <span>
                            Logout
                        </span>
                    )}

                </button>

            </div>

        </aside>
    );
}